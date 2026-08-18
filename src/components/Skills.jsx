import { useTranslation } from 'react-i18next'
import { useContent } from '../hooks/useContent'

/**
 * Stack — dark section: grid of cells "glued" by a 1px gap over the divider
 * color. Each cell is a category with its tools in mono.
 *
 * Content: /posts/stack/main-<lang>.md — `title` plus a `groups` list of
 * `{ cat, items }`. The grid is 2 columns, so an even number of groups keeps
 * the block rectangular. See GUIA_CONTEUDO.md.
 */
function Skills() {
  const { t, i18n } = useTranslation()

  const { content } = useContent('stack', 'main', i18n.language)

  const groups = Array.isArray(content?.groups) ? content.groups : []

  return (
    <section className="sec--dark" id="skills">
      <div className="container">
        <p className="sec-label sec-label--solo">## {content?.title || t('skills.title')}</p>

        {groups.length > 0 && (
          <div className="skills-grid">
            {groups.map(({ cat, items }) => (
              <div key={cat} className="skills-cell">
                <h3>{cat}</h3>
                <p>{items}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Skills
