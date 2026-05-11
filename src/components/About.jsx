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
  
  // Load about content based on current language
  const lang = i18n.language
  const { content: aboutContent, isLoading } = useContent('about', `main-${lang}`)
  
  // Fallback to default language if translation doesn't exist
  const { content: fallbackContent } = useContent('about', 'main-pt')
  
  const content = aboutContent || fallbackContent

  // Default content if no markdown file exists yet
  const defaultAbout = {
    title: t('about.title'),
    subtitle: t('about.trajectory'),
    body: `Aqui você pode escrever sobre sua trajetória profissional, experiências e objetivos. 
    
Para editar este conteúdo, crie ou modifique o arquivo \`/posts/about/main-pt.md\` ou \`/posts/about/main-en.md\` para a versão em inglês.

Use markdown para formatar seu texto com **negrito**, *itálico*, e muito mais.`,
    image: '/images/about.jpg'
  }

  const displayContent = content || defaultAbout

  return (
    <section className="about-section section section-light" id="about">
      <div className="container">
        <div className="about-container">
          {/* Left Side - Image */}
          <div className="about-left">
            <div className="about-image-wrapper">
              <img 
                src="/images/about.png"
                alt={t('about.title')}
                className="about-photo"
                onError={(e) => {
                  // Fallback gradient if image doesn't load
                  e.target.style.display = 'none'
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #E8E8E8 0%, #041145 100%)'
                  e.target.parentElement.style.minHeight = '400px'
                }}
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="about-right">
            <h2>{displayContent.title || t('about.title')}</h2>

            <div className="about-separator"></div>

            <div className="about-content">
              {isLoading ? (
                <p>{t('common.loading')}</p>
              ) : (
                <ReactMarkdown>
                  {displayContent.body}
                </ReactMarkdown>
              )}
            </div>

            {displayContent.readMoreLink && (
              <a href={displayContent.readMoreLink} className="read-more-btn">
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
