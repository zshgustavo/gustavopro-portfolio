#!/usr/bin/env node
/**
 * translate.mjs — Build-time PT → EN translator using Google Gemini.
 *
 * Walks public/posts/ for every `<base>-pt.md` file and generates the matching
 * `<base>-en.md` whenever the EN file is missing or older than its PT source.
 *
 * Usage:
 *   node scripts/translate.mjs            # incremental (only stale files)
 *   node scripts/translate.mjs --force    # regenerate all
 *   node scripts/translate.mjs --dry-run  # show what would change, no API call
 *
 * Required env: GEMINI_API_KEY (loaded from .env at the project root).
 * Optional env: GEMINI_MODEL (default: gemini-3.1-flash-lite)
 */

import {
  readdir,
  readFile,
  writeFile,
  stat,
} from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

// ── paths ───────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const POSTS_DIR = resolve(ROOT, 'public/posts')

// ── flags ───────────────────────────────────────────────────────────────────
const FORCE = process.argv.includes('--force')
const DRY_RUN = process.argv.includes('--dry-run')

// ── env loader (no external dependency) ─────────────────────────────────────
loadDotenv(resolve(ROOT, '.env'))

const API_KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'

if (!API_KEY && !DRY_RUN) {
  console.error('✗ Missing GEMINI_API_KEY. Add it to .env at the project root.')
  process.exit(1)
}

// ── frontmatter keys eligible for translation ──────────────────────────────
// Everything else (id, date, urls, paths, tags, photos, type, etc.) stays as-is.
const TRANSLATABLE_KEYS = ['title', 'subtitle', 'description', 'role']

// ───────────────────────────────────────────────────────────────────────────
async function main() {
  const allFiles = await walk(POSTS_DIR)
  const ptFiles = allFiles.filter((f) => f.endsWith('-pt.md'))

  if (ptFiles.length === 0) {
    console.log('No *-pt.md files found under public/posts/. Nothing to do.')
    return
  }

  console.log(
    `Found ${ptFiles.length} Portuguese source file(s).` +
      (FORCE ? ' (force mode)' : '') +
      (DRY_RUN ? ' (dry run)' : ''),
  )

  let processed = 0
  let skipped = 0
  let errors = 0

  for (const ptPath of ptFiles) {
    const enPath = ptPath.replace(/-pt\.md$/, '-en.md')
    const rel = ptPath.slice(ROOT.length + 1)

    try {
      if (!(await isStale(ptPath, enPath))) {
        console.log(`✓ up-to-date  ${rel}`)
        skipped++
        continue
      }

      const raw = await readFile(ptPath, 'utf8')
      const { data, content } = matter(raw)

      const payload = {}
      for (const key of TRANSLATABLE_KEYS) {
        const v = data[key]
        if (typeof v === 'string' && v.trim().length > 0) {
          payload[`frontmatter.${key}`] = v
        }
      }
      if (content.trim().length > 0) payload.body = content

      if (Object.keys(payload).length === 0) {
        console.log(`✓ no text    ${rel}`)
        skipped++
        continue
      }

      console.log(`→ translating ${rel}`)
      if (DRY_RUN) {
        console.log('  (dry run — would call Gemini for these keys:', Object.keys(payload), ')')
        processed++
        continue
      }

      const translated = await translateBatch(payload)

      const newData = { ...data }
      for (const key of TRANSLATABLE_KEYS) {
        const flat = `frontmatter.${key}`
        if (typeof translated[flat] === 'string') {
          newData[key] = translated[flat]
        }
      }
      const newBody =
        typeof translated.body === 'string' ? translated.body : content

      const output = serializeMarkdown(newData, newBody)
      await writeFile(enPath, output, 'utf8')
      console.log(`  wrote ${enPath.slice(ROOT.length + 1)}`)
      processed++
    } catch (err) {
      console.error(`✗ error on ${rel}: ${err.message}`)
      errors++
    }
  }

  console.log(
    `\nDone. translated=${processed} up-to-date=${skipped} errors=${errors}`,
  )
  if (errors > 0) process.exit(1)
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

async function isStale(ptPath, enPath) {
  if (FORCE) return true
  if (!existsSync(enPath)) return true
  const [ptStat, enStat] = await Promise.all([stat(ptPath), stat(enPath)])
  return ptStat.mtimeMs > enStat.mtimeMs
}

async function translateBatch(payload) {
  const prompt = buildPrompt(payload)

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Gemini API ${res.status}: ${body.slice(0, 400)}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Empty response from Gemini')
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (e) {
    throw new Error(
      `Gemini returned non-JSON: ${text.slice(0, 200)}…`,
    )
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Gemini response is not a JSON object')
  }
  return parsed
}

function buildPrompt(payload) {
  return `You are a professional bilingual translator working on a developer portfolio.
Translate the STRING VALUES in the JSON below from Brazilian Portuguese into natural, professional English.

ABSOLUTE RULES:
- Preserve markdown EXACTLY in body fields: headings (##), bold (**), italics (*), bullets (-), numbered lists, links [text](url), inline code \`x\`, code fences. Do not add or remove formatting.
- Keep proper nouns, brand names, product names, and technical jargon unchanged. Examples: Google Cloud, Microsoft Azure, AWS, OCI, IBM Cloud, Apache Airflow, Astronomer, Databricks, DBT, BigQuery, Data Factory, Spark, Python, SQL, Apache, GDG Cloud Brasília, Google I/O, Google Cloud Next, GDG Summit, Ford, C6 Bank, CI&T, Cognizant, Sentry, Github, Oracle, Cisco, CrewAI, Manus, MCP, EC2, S3, Compute Engine, Cloud Storage, Tailwind CSS, React.
- Keep certifications, acronyms, URLs, file paths, IDs, dates, locations, and tag values unchanged.
- Preserve emojis and emoticons (e.g. ":)", "😀") exactly.
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

/**
 * Serialize frontmatter + body in the same flat format the rest of the project
 * uses (inline arrays, plain key: value), so the in-browser parser keeps working
 * and diffs stay clean.
 */
function serializeMarkdown(data, body) {
  const lines = ['---']
  for (const [k, v] of Object.entries(data)) {
    lines.push(serializeKv(k, v))
  }
  lines.push('---', '')
  const trimmedBody = body.replace(/^\n+/, '').replace(/\s+$/, '')
  if (trimmedBody.length > 0) {
    lines.push('', trimmedBody, '')
  }
  return lines.join('\n')
}

function serializeKv(key, value) {
  if (Array.isArray(value)) {
    return `${key}: [${value.map(formatScalar).join(', ')}]`
  }
  if (value === null || value === undefined) return `${key}: `
  return `${key}: ${formatScalar(value)}`
}

function formatScalar(v) {
  if (typeof v === 'string') return v
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v)
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

