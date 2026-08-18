import { useTranslation } from 'react-i18next'

/**
 * Stack — dark section: 2-column grid of cells "glued" by a 1px gap over the
 * divider color. Each cell is a category with its tools in mono.
 *
 * Content: i18n `skills.groups` (structured UI content, tiny and stable —
 * deliberately not markdown).
 */
function Skills() {
  const { t } = useTranslation()

  const groups = t('skills.groups', { returnObjects: true })

  return (
    <section className="sec--dark" id="skills">
      <div className="container">
        <p className="sec-label sec-label--solo">## {t('skills.title')}</p>

        <div className="skills-grid">
          {Array.isArray(groups) &&
            groups.map(({ cat, items }) => (
              <div key={cat} className="skills-cell">
                <h3>{cat}</h3>
                <p>{items}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
