#!/usr/bin/env node
/**
 * translate.mjs — Build-time PT → EN translator using Google Gemini.
 *
 * Walks public/posts/ for every `<base>-pt.md` and regenerates the matching
 * `<base>-en.md` whenever the Portuguese source has actually changed.
 *
 * Staleness is decided by hashing the PT source and comparing against
 * `scripts/translations.lock.json`, NOT by file mtime: git does not preserve
 * mtime, so on a fresh clone (CI, Docker `COPY . .`) every file gets the
 * checkout timestamp and an mtime comparison becomes a coin flip.
 *
 * Usage:
 *   node scripts/translate.mjs            # translate what changed
 *   node scripts/translate.mjs --force    # regenerate everything
 *   node scripts/translate.mjs --dry-run  # report only, no API call, no write
 *   node scripts/translate.mjs --check    # exit 1 if anything is out of date
 *
 * Without GEMINI_API_KEY the script does NOT fail the build: it warns about
 * stale files and leaves the committed `-en.md` in place. `--check` is the
 * mode that turns "out of date" into a non-zero exit, for CI.
 *
 * Required env (only to actually translate): GEMINI_API_KEY, read from .env
 * at the project root.
 * Optional env: GEMINI_MODEL (default: gemini-3.1-flash-lite)
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join, resolve, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import { YAML_SCHEMA, YAML_DUMP_OPTIONS } from '../src/lib/frontmatter.js'

// ── paths ───────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const POSTS_DIR = resolve(ROOT, 'public/posts')
const MANIFEST_PATH = resolve(__dirname, 'translations.lock.json')

// ── flags ───────────────────────────────────────────────────────────────────
const FORCE = process.argv.includes('--force')
const DRY_RUN = process.argv.includes('--dry-run')
const CHECK = process.argv.includes('--check')

// ── env ─────────────────────────────────────────────────────────────────────
loadDotenv(resolve(ROOT, '.env'))

const API_KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'

// ── API tuning ──────────────────────────────────────────────────────────────
const MAX_ATTEMPTS = 3
const BASE_RETRY_DELAY_MS = 1000
const REQUEST_TIMEOUT_MS = 60_000

// ── frontmatter keys eligible for translation ──────────────────────────────
// Everything else (id, date, urls, paths, tags, type, location, name…) is
// passed through untouched.
const TRANSLATABLE_KEYS = ['title', 'subtitle', 'description', 'role']

/**
 * Prose that lives inside array-of-object frontmatter values, as
 * `{ <key>: [<field>, …] }`. Flattened into the payload as
 * `frontmatter.<key>.<index>.<field>`.
 *
 * Without this, a field like `stats[].label` would be copied verbatim from the
 * Portuguese source into the English file — silently regressing a translation
 * that was already correct.
 */
const TRANSLATABLE_LIST_FIELDS = {
  stats: ['label'],
  groups: ['cat', 'items'],
}

/**
 * gray-matter is pointed at the same js-yaml schema the browser uses
 * (src/lib/frontmatter.js), so anything written here is guaranteed to parse
 * identically at runtime. This is what replaced the old hand-rolled serializer.
 */
const MATTER_OPTIONS = {
  engines: {
    yaml: {
      parse: (str) => yaml.load(str, { schema: YAML_SCHEMA }),
      stringify: (obj) => yaml.dump(obj, YAML_DUMP_OPTIONS),
    },
  },
}

/** Non-retryable API failure (4xx other than 429). */
class FatalApiError extends Error {}

// ───────────────────────────────────────────────────────────────────────────
async function main() {
  const allFiles = await walk(POSTS_DIR)
  const ptFiles = allFiles.filter((f) => f.endsWith('-pt.md')).sort()

  if (ptFiles.length === 0) {
    console.log('No *-pt.md files found under public/posts/. Nothing to do.')
    return
  }

  const manifest = await loadManifest()

  const mode = CHECK
    ? ' (check)'
    : (FORCE ? ' (force)' : '') + (DRY_RUN ? ' (dry run)' : '')
  console.log(`Found ${ptFiles.length} Portuguese source file(s).${mode}`)

  // ── work out what changed ────────────────────────────────────────────────
  const jobs = []
  for (const ptPath of ptFiles) {
    const enPath = ptPath.replace(/-pt\.md$/, '-en.md')
    const key = manifestKey(ptPath)
    const raw = await readFile(ptPath, 'utf8')
    const hash = sha256(raw)

    const isStale =
      FORCE ||
      !existsSync(enPath) ||
      manifest.entries[key]?.sourceSha256 !== hash

    jobs.push({ ptPath, enPath, key, raw, hash, isStale })
  }

  const staleJobs = jobs.filter((j) => j.isStale)
  const upToDate = jobs.length - staleJobs.length

  // ── --check: report and exit, never touch the API ────────────────────────
  if (CHECK) {
    if (staleJobs.length === 0) {
      console.log(`\n✓ All ${jobs.length} translation(s) are up to date.`)
      return
    }
    console.error(`\n✗ ${staleJobs.length} translation(s) out of date:`)
    for (const j of staleJobs) console.error(`  - ${j.key}`)
    console.error('\nRun `npm run translate` to regenerate them.')
    process.exitCode = 1
    return
  }

  for (const j of jobs.filter((x) => !x.isStale)) {
    console.log(`✓ up-to-date  ${j.key}`)
  }

  if (staleJobs.length === 0) {
    console.log(`\nDone. translated=0 up-to-date=${upToDate} errors=0`)
    if (!DRY_RUN && pruneManifest(manifest, jobs) > 0) await saveManifest(manifest)
    return
  }

  // ── no API key: warn, keep the committed EN files, do NOT fail the build ─
  if (!API_KEY && !DRY_RUN) {
    console.warn(
      `\n⚠ ${staleJobs.length} file(s) changed but GEMINI_API_KEY is not set.\n` +
        '  Keeping the existing -en.md files. Set the key and run ' +
        '`npm run translate` to refresh them:',
    )
    for (const j of staleJobs) console.warn(`  - ${j.key}`)
    return
  }

  // ── translate ────────────────────────────────────────────────────────────
  let processed = 0
  let errors = 0

  for (const job of staleJobs) {
    try {
      const { data, content } = matter(job.raw, MATTER_OPTIONS)

      const payload = {}
      for (const key of TRANSLATABLE_KEYS) {
        const value = data[key]
        if (typeof value === 'string' && value.trim().length > 0) {
          payload[`frontmatter.${key}`] = value
        }
      }
      for (const [key, fields] of Object.entries(TRANSLATABLE_LIST_FIELDS)) {
        if (!Array.isArray(data[key])) continue
        data[key].forEach((item, index) => {
          if (!item || typeof item !== 'object') return
          for (const field of fields) {
            const value = item[field]
            if (typeof value === 'string' && value.trim().length > 0) {
              payload[`frontmatter.${key}.${index}.${field}`] = value
            }
          }
        })
      }
      if (content.trim().length > 0) payload.body = content

      if (Object.keys(payload).length === 0) {
        console.log(`✓ no text     ${job.key}`)
        // Nothing translatable: copy the source through so the EN file exists
        // and record it, otherwise it stays "stale" forever.
        if (!DRY_RUN) {
          await writeFile(job.enPath, job.raw, 'utf8')
          recordEntry(manifest, job)
        }
        continue
      }

      console.log(`→ translating ${job.key}`)
      if (DRY_RUN) {
        console.log(`  would send keys: ${Object.keys(payload).join(', ')}`)
        processed++
        continue
      }

      const translated = await translateBatch(payload)

      const newData = { ...data }
      for (const key of TRANSLATABLE_KEYS) {
        const flat = `frontmatter.${key}`
        if (typeof translated[flat] === 'string') newData[key] = translated[flat]
      }
      for (const [key, fields] of Object.entries(TRANSLATABLE_LIST_FIELDS)) {
        if (!Array.isArray(newData[key])) continue
        // `newData` is a shallow copy, so rebuild the items instead of
        // mutating them — they are still shared with `data`.
        newData[key] = newData[key].map((item, index) => {
          if (!item || typeof item !== 'object') return item
          const next = { ...item }
          for (const field of fields) {
            const flat = `frontmatter.${key}.${index}.${field}`
            if (typeof translated[flat] === 'string') next[field] = translated[flat]
          }
          return next
        })
      }
      const newBody =
        typeof translated.body === 'string' ? translated.body : content

      const output = matter.stringify(newBody.trim(), newData, MATTER_OPTIONS)
      await writeFile(job.enPath, output, 'utf8')
      recordEntry(manifest, job)

      console.log(`  wrote ${manifestKey(job.enPath)}`)
      processed++
    } catch (err) {
      console.error(`✗ error on ${job.key}: ${err.message}`)
      errors++
    }
  }

  if (!DRY_RUN) {
    pruneManifest(manifest, jobs)
    await saveManifest(manifest)
  }

  console.log(
    `\nDone. translated=${processed} up-to-date=${upToDate} errors=${errors}`,
  )
  if (errors > 0) process.exitCode = 1
}

// ── manifest ───────────────────────────────────────────────────────────────

/** Repo-relative path with forward slashes, stable across Windows and Linux. */
function manifestKey(absPath) {
  return relative(ROOT, absPath).split(sep).join('/')
}

/**
 * Hash of the *normalized* source: CRLF collapsed to LF and any BOM stripped.
 *
 * The repo sets core.autocrlf=true and relies on .gitattributes to keep the
 * working tree at LF. Normalizing here means the manifest stays valid even if
 * a checkout lands with CRLF, instead of marking every file stale.
 */
function sha256(text) {
  const withoutBom = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  const normalized = withoutBom.replace(/\r\n/g, '\n')
  return createHash('sha256').update(normalized, 'utf8').digest('hex')
}

async function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return { version: 1, entries: {} }
  try {
    const parsed = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
    return { version: 1, entries: parsed.entries ?? {} }
  } catch (err) {
    console.warn(`⚠ Could not read the manifest (${err.message}). Rebuilding it.`)
    return { version: 1, entries: {} }
  }
}

function recordEntry(manifest, job) {
  manifest.entries[job.key] = {
    sourceSha256: job.hash,
    // Recorded for traceability only — a model change does not by itself mark
    // a file stale. Use --force after switching models.
    model: MODEL,
    translatedAt: new Date().toISOString(),
  }
}

/**
 * Drop entries whose PT source no longer exists. Mutates `manifest` and returns
 * how many were removed; saving is the caller's job.
 */
function pruneManifest(manifest, jobs) {
  const live = new Set(jobs.map((j) => j.key))
  let removed = 0
  for (const key of Object.keys(manifest.entries)) {
    if (!live.has(key)) {
      delete manifest.entries[key]
      removed++
    }
  }
  if (removed > 0) console.log(`  pruned ${removed} orphaned manifest entry(ies)`)
  return removed
}

async function saveManifest(manifest) {
  const sorted = {}
  for (const key of Object.keys(manifest.entries).sort()) {
    sorted[key] = manifest.entries[key]
  }
  const output = JSON.stringify({ version: 1, entries: sorted }, null, 2)
  await writeFile(MANIFEST_PATH, `${output}\n`, 'utf8')
}

// ── translation ────────────────────────────────────────────────────────────

async function translateBatch(payload) {
  const data = await callGemini(buildPrompt(payload))

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 200)}…`)
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Gemini response is not a JSON object')
  }

  // Reject partial responses rather than silently writing Portuguese text into
  // the English file, which is what the previous permissive merge did.
  const expected = Object.keys(payload)
  const missing = expected.filter((k) => typeof parsed[k] !== 'string')
  if (missing.length > 0) {
    throw new Error(`Gemini response missing key(s): ${missing.join(', ')}`)
  }

  const unexpected = Object.keys(parsed).filter((k) => !expected.includes(k))
  if (unexpected.length > 0) {
    console.warn(`  ⚠ ignoring unexpected key(s): ${unexpected.join(', ')}`)
  }

  return parsed
}

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  })

  let lastError
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Header rather than `?key=` so the secret cannot leak through
          // proxy logs or an echoed request URL in an error body.
          'x-goog-api-key': API_KEY,
        },
        body,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })

      if (res.ok) return res.json()

      const detail = redactKey(await res.text()).slice(0, 300)
      const message = `Gemini API ${res.status}: ${detail}`

      // 429 and 5xx are worth another go; other 4xx are our fault.
      if (res.status !== 429 && res.status < 500) throw new FatalApiError(message)
      lastError = new Error(message)
    } catch (err) {
      if (err instanceof FatalApiError) throw err
      lastError =
        err.name === 'TimeoutError' || err.name === 'AbortError'
          ? new Error(`request timed out after ${REQUEST_TIMEOUT_MS}ms`)
          : err
    }

    if (attempt < MAX_ATTEMPTS) {
      const delay = BASE_RETRY_DELAY_MS * 2 ** (attempt - 1)
      console.log(`  retry ${attempt}/${MAX_ATTEMPTS - 1} in ${delay}ms — ${lastError.message}`)
      await sleep(delay)
    }
  }

  throw lastError
}

function redactKey(text) {
  return API_KEY ? text.split(API_KEY).join('***') : text
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function buildPrompt(payload) {
  return `You are a professional bilingual translator working on a developer portfolio.
Translate the STRING VALUES in the JSON below from Brazilian Portuguese into natural, professional English.

ABSOLUTE RULES:
- Preserve markdown EXACTLY in body fields: headings (##), bold (**), italics (*), bullets (-), numbered lists, links [text](url), inline code \`x\`, code fences. Do not add or remove formatting.
- Keep proper nouns, brand names, product names, and technical jargon unchanged. Examples: Google Cloud, Microsoft Azure, AWS, OCI, IBM Cloud, Apache Airflow, Astronomer, Databricks, DBT, BigQuery, Data Factory, Spark, Python, SQL, Apache, GDG Cloud Brasília, Google I/O, Google Cloud Next, GDG Summit, Ford, C6 Bank, CI&T, Cognizant, Sentry, Github, Oracle, Cisco, CrewAI, Manus, MCP, EC2, S3, Compute Engine, Cloud Storage, Tailwind CSS, React.
- Keep certifications, acronyms, URLs, file paths, IDs, dates, locations, and tag values unchanged.
- Preserve emojis and emoticons (e.g. ":)", "😀") exactly.
- Preserve separator characters and their spacing in inline lists: "A · B · C" must stay "A · B · C" — never swap "·" for a comma or a slash.
- Keep tone warm and professional, matching the original voice.
- If an input value already appears to be in English, return it unchanged.

OUTPUT FORMAT (strict):
- Return ONLY a JSON object.
- Use EXACTLY the same set of keys as the input — same names, same order, no extra keys, no missing keys.
- Each value must be the translated string (or unchanged if already English).
- No surrounding markdown fences, no commentary.

INPUT:
${JSON.stringify(payload, null, 2)}`
}

// ── helpers ────────────────────────────────────────────────────────────────

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const out = []
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(full)))
    else if (e.isFile()) out.push(full)
  }
  return out
}

function loadDotenv(path) {
  if (!existsSync(path)) return
  const text = readFileSync(path, 'utf8')
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i)
    if (!m) continue
    const [, key, rawVal] = m
    const value = rawVal.replace(/^["']|["']$/g, '')
    if (process.env[key] === undefined) process.env[key] = value
  }
}

// ─── entrypoint ────────────────────────────────────────────────────────────
main().catch((err) => {
  console.error(err)
  process.exit(1)
})
