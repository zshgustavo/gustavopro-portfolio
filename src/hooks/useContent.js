import { useEffect, useState } from 'react'
import matter from 'gray-matter'

/**
 * useContent Hook
 * 
 * A custom React hook for loading content from the markdown-based CMS.
 * This hook enables content management via simple markdown files,
 * allowing you to update website content without modifying React code.
 * 
 * How it works:
 * 1. Content is stored in the /posts folder as markdown files
 * 2. Each section (about, projects, events, contact) has its own subfolder
 * 3. Markdown files use frontmatter (YAML) for structured data
 * 4. The body of the markdown is available as the 'body' property
 * 
 * Example usage:
 *   const { content, isLoading, error } = useContent('about', 'hero')
 *   // This loads /posts/about/hero.md
 * 
 * @param {string} section - The section folder name (e.g., 'about', 'projects')
 * @param {string} filename - The markdown file name without extension
 * @returns {Object} { content, isLoading, error }
 */
export function useContent(section, filename, fallbackFilename) {
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const parsed = await fetchMarkdown(section, filename)

        if (parsed) {
          setContent(parsed)
          return
        }

        if (fallbackFilename && fallbackFilename !== filename) {
          setContent(await fetchMarkdown(section, fallbackFilename))
          return
        }

        setContent(null)
      } catch (err) {
        setError(err)
        setContent(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [section, filename])

  return { content, isLoading, error }
}

/**
 * useContentList Hook
 *
 * Loads multiple content files from a section folder, with i18n support.
 *
 * Index format (index.json):
 *   { "files": ["event-1", "event-2"] }   // base names without -lang.md
 *   or legacy: { "files": ["event-1.md"] } // also supported
 *
 * For each entry, the hook tries `<base>-<lang>.md` first and falls back to
 * `<base>-pt.md`, then `<base>.md` so partial translations don't break the UI.
 *
 * @param {string} section - The section folder name
 * @param {string} [lang='pt'] - Language code (pt | en)
 * @returns {Object} { items, isLoading, error }
 */
export function useContentList(section, lang = 'pt') {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadContentList = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const indexResponse = await fetch(`/posts/${section}/index.json`)

        if (!indexResponse.ok) {
          setItems([])
          setIsLoading(false)
          return
        }

        const index = await indexResponse.json()

        const loadedItems = await Promise.all(
          index.files.map(async (entry) => {
            const base = entry.replace(/\.md$/, '').replace(/-(pt|en)$/, '')
            const candidates = [...new Set([`${base}-${lang}.md`, `${base}-pt.md`, `${base}.md`])]
            for (const filename of candidates) {
              try {
                const parsed = await fetchMarkdown(section, filename.replace(/\.md$/, ''))
                if (parsed) return parsed
              } catch {
                continue
              }
            }
            return null
          })
        )

        setItems(loadedItems.filter(Boolean))
      } catch (err) {
        setError(err)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadContentList()
  }, [section, lang])

  return { items, isLoading, error }
}

/**
 * Parse Markdown with Frontmatter
 * 
 * Parses a markdown string that contains YAML frontmatter.
 * The frontmatter is delimited by '---' at the beginning of the file.
 * 
 * Example markdown file:
 * ---
 * title: My Project
 * date: 2024-01-15
 * thumbnail: /images/project.png
 * ---
 * This is the body content in **markdown**.
 * 
 * @param {string} text - The raw markdown text
 * @returns {Object} Parsed object with frontmatter fields and body
 */
async function fetchMarkdown(section, filename) {
  const response = await fetch(`/posts/${section}/${filename}.md`)

  if (!response.ok) {
    return null
  }

  const text = await response.text()
  return parseMarkdown(text)
}

function parseMarkdown(text) {
  const { data, content } = matter(text)

  return {
    ...data,
    body: content.trim(),
  }
}

export default useContent
