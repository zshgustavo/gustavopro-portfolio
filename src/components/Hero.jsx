import { useTranslation } from 'react-i18next'
import SocialIcons from './SocialIcons'
import { useContent } from '../hooks/useContent'

/**
 * Hero — Terminal direction: `// role` eyebrow in mono, stacked name at 80px,
 * short description, mono stats row, and the portrait with a 1px accent frame
 * offset -12px. Social tiles close the section.
 *
 * Everything in this section is content, editable without touching code:
 * /posts/hero/main-<lang>.md carries the name, role, description, stats, the
 * photo path and the social links — and the photo file itself lives next to
 * them in /posts/hero/. See GUIA_CONTEUDO.md.
 */
function Hero() {
  const { t, i18n } = useTranslation()

  const { content } = useContent('hero', 'main', i18n.language)

  const name = content?.name || ''
  const role = content?.role || t('hero.role')
  const description = content?.description
  const photo = content?.photo
  const stats = Array.isArray(content?.stats) ? content.stats : []

  return (
    <header className="hero sec--dark" id="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <p className="hero-eyebrow">{'// '}{role}</p>

            <h1 className="hero-name">
              {name.split(' ').filter(Boolean).map((word) => (
                <span key={word}>
                  {word}
                  <br />
                </span>
              ))}
            </h1>

            {description && <p className="hero-desc">{description}</p>}

            {stats.length > 0 && (
              <div className="hero-stats">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <span className="hero-stat-value">{value}</span>
                    <br />
                    <span className="hero-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {photo && (
            <div className="hero-photo">
              <img
                src={photo}
                alt={name}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        <div className="hero-socials">
          <SocialIcons socials={content?.socials} />
        </div>
      </div>
    </header>
  )
}

export default Hero
