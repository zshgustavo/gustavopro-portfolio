import { useTranslation } from 'react-i18next'
import SocialIcons from './SocialIcons'
import { useContent } from '../hooks/useContent'

/**
 * Hero — Terminal direction: `// role` eyebrow in mono, stacked 80px name,
 * short description, mono stats row, and the portrait with a 1px accent frame
 * offset -12px. Social tiles close the section.
 *
 * `name`, `role` and `description` come from /posts/about/hero-<lang>.md;
 * the stats row comes from i18n (`hero.stats`).
 */
function Hero() {
  const { t, i18n } = useTranslation()

  const { content } = useContent('about', 'hero', i18n.language)

  const name = content?.name || 'Gustavo Santos'
  const role = content?.role || t('hero.role')
  const description = content?.description
  const stats = t('hero.stats', { returnObjects: true })

  return (
    <header className="hero sec--dark" id="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <p className="hero-eyebrow">{'// '}{role}</p>
            <h1 className="hero-name">
              {name.split(' ').map((word) => (
                <span key={word}>
                  {word}
                  <br />
                </span>
              ))}
            </h1>
            {description && <p className="hero-desc">{description}</p>}
            {Array.isArray(stats) && stats.length > 0 && (
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

          <div className="hero-photo">
            <img
              src="/images/profile.jpg"
              alt={name}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        </div>

        <div className="hero-socials">
          <SocialIcons />
        </div>
      </div>
    </header>
  )
}

export default Hero
