import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useContent } from '../hooks/useContent'

/**
 * Sobre — light section: `## sobre mim` label, photo on the left, full bio
 * rendered from markdown on the right. `strong` in the markdown maps to the
 * ink-colored emphasis of the design (see `.about-body strong`).
 *
 * Content: /posts/about/main-<lang>.md (PT fallback handled by the hook).
 */
function About() {
  const { t, i18n } = useTranslation()

  const { content, isLoading } = useContent('about', 'main', i18n.language)

  return (
    <section className="sec--light" id="about">
      <div className="container">
        <p className="sec-label sec-label--solo">## {content?.title || t('about.title')}</p>

        <div className="about-grid">
          <img
            src="/images/about.png"
            alt={content?.title || t('about.title')}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />

          <div className="about-body">
            {isLoading ? (
              <p className="loading">$ {t('common.loading')}</p>
            ) : (
              content?.body && <ReactMarkdown>{content.body}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
