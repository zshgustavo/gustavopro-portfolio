import { useEffect } from 'react'

const SITE_URL = 'https://gustavosantospro.com/'

function setMeta(selector, content) {
  const element = document.head.querySelector(selector)
  if (element && content) element.setAttribute('content', content)
}

/**
 * Keep browser and social metadata aligned with the loaded hero language.
 * The Portuguese defaults remain in index.html for crawlers that do not run
 * JavaScript; this hook updates them after an explicit or detected EN switch.
 */
export function usePageMetadata({ name, role, description, photo, lang }) {
  useEffect(() => {
    if (!name || !role || !description) return

    const title = `${name} | ${role}`
    const locale = lang === 'en' ? 'en_US' : 'pt_BR'
    const image = photo ? new URL(photo, SITE_URL).href : null

    document.title = title
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:locale"]', locale)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:image"]', image)
    setMeta('meta[property="og:image:alt"]', name)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    setMeta('meta[name="twitter:image"]', image)
    setMeta('meta[name="twitter:image:alt"]', name)

    const schema = document.getElementById('person-schema')
    if (schema) {
      try {
        const person = JSON.parse(schema.textContent)
        schema.textContent = JSON.stringify({
          ...person,
          name,
          image: image || person.image,
          jobTitle: role,
          description,
        })
      } catch {
        // Static structured data remains valid if a third party rewrites it.
      }
    }
  }, [name, role, description, photo, lang])
}
