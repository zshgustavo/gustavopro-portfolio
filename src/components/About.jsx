import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useContent } from '../hooks/useContent'
import { ArrowRight } from 'lucide-react'

/**
 * About Section Component
 * 
 * Displays information about the site owner's trajectory and experience.
 * Content is loaded dynamically from markdown files in /posts/about/
 * 
 * Content Structure:
 * - /posts/about/main.md: Main about content with biography
 * - /posts/about/hero.md: Hero section data (name, role)
 * 
 * The markdown body is rendered using ReactMarkdown for rich formatting.
 */
function About() {
  const { t, i18n } = useTranslation()

  // The hook falls back across languages internally (main-<lang> → main-pt).
  const { content, isLoading } = useContent('about', 'main', i18n.language)

  return (
    <section className="about-section section section-light" id="about">
      <div className="container">
        <div className="about-container">
          {/* Left Side - Images */}
          <div className="about-left">
            <div className="about-image-wrapper">
              <img
                src="/images/about.png"
                alt={t('about.title')}
                className="about-photo"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #E8E8E8 0%, #041145 100%)'
                  e.target.parentElement.style.minHeight = '400px'
                }}
              />
            </div>
            <div className="about-image-wrapper about-image-wrapper--transparent">
              <img
                src="https://res.cloudinary.com/dawnv7igk/image/upload/w_800,q_auto,f_auto/Design_sem_nome_tesskt.png"
                alt="Certificações"
                className="about-photo"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #041145 0%, #E8E8E8 100%)'
                  e.target.parentElement.style.minHeight = '400px'
                }}
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="about-right">
            <h2>{content?.title || t('about.title')}</h2>

            <div className="about-separator"></div>

            <div className="about-content">
              {isLoading ? (
                <p>{t('common.loading')}</p>
              ) : (
                content?.body && <ReactMarkdown>{content.body}</ReactMarkdown>
              )}
            </div>

            {content?.readMoreLink && (
              <a href={content.readMoreLink} className="read-more-btn">
                {t('about.readMore')}
                <ArrowRight size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
