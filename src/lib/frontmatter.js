import yaml from 'js-yaml'

/**
 * Frontmatter parsing — the single source of truth for how this project reads
 * markdown, on BOTH sides of the build.
 *
 * The browser uses `parseFrontmatter()` below. The build-time translator
 * (scripts/translate.mjs) feeds the exact same options into gray-matter via
 * `YAML_SCHEMA` / `YAML_DUMP_OPTIONS`, so a file written by the translator is
 * guaranteed to parse identically here. Historically these were two different
 * parsers (gray-matter vs. a hand-rolled regex), which is why the translator
 * used to need its own flat serializer.
 *
 * CORE_SCHEMA is deliberate: it resolves null/bool/int/float/str but NOT
 * timestamps. A `date: 2025-08-01` therefore stays a string instead of becoming
 * a Date object, which is what `Events.formatDate` expects to regex against.
 */
export const YAML_SCHEMA = yaml.CORE_SCHEMA

/**
 * Dump options used when writing markdown back out (translator only).
 * - `lineWidth: -1` disables line wrapping, which would otherwise split long
 *   descriptions across lines and change their meaning.
 * - `flowLevel: 1` keeps nested collections inline (`tags: [a, b]`), matching
 *   the style of the hand-written `-pt.md` sources so diffs stay readable.
 */
export const YAML_DUMP_OPTIONS = {
  schema: YAML_SCHEMA,
  lineWidth: -1,
  flowLevel: 1,
}

// Leading `---`, the block, then a closing `---`. Tolerates CRLF so Windows
// checkouts keep working regardless of .gitattributes normalization.
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/

/**
 * Parse a markdown string with optional YAML frontmatter.
 *
 * @param {string} raw - Raw markdown file contents.
 * @returns {Object} Frontmatter keys spread at the top level, plus `body`.
 */
export function parseFrontmatter(raw) {
  // Strip optional UTF-8 BOM that some editors add on save.
  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw

  const match = text.match(FRONTMATTER_RE)
  if (!match) return { body: text.trim() }

  const body = text.slice(match[0].length).trim()

  let data
  try {
    data = yaml.load(match[1], { schema: YAML_SCHEMA })
  } catch (err) {
    // A malformed frontmatter block should degrade to "no metadata" rather
    // than take the whole section down.
    console.warn('Invalid frontmatter, ignoring metadata:', err.message)
    return { body }
  }

  // A frontmatter block of only comments parses to null/undefined.
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { body }

  return { ...data, body }
}

/**
 * Normalize an i18next language code to the suffix used in content filenames.
 * `pt-BR` → `pt`, so language detection can't produce a `main-pt-BR.md` 404.
 *
 * @param {string} [lang]
 * @returns {string}
 */
export function normalizeLang(lang) {
  return (lang || 'pt').split('-')[0].toLowerCase()
}
