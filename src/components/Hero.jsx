import { useTranslation } from 'react-i18next'
import SocialIcons from './SocialIcons'
import { useContent } from '../hooks/useContent'

/**
 * Hero Section Component
 * 
 * This is the main landing section that visitors see first.
 * Features a split layout with:
 * - Left side: Gray background with name and title
 * - Right side: Dark background with profile image
 * - Social icons overlay
 * 
 * Content is loaded from the 'about' markdown files for dynamic updates.
 */
function Hero() {
  const { t, i18n } = useTranslation()

  // Load hero content from markdown (per language, with PT fallback)
  const lang = i18n.language
  const { content: heroLang } = useContent('about', `hero-${lang}`)
  const { content: heroPt } = useContent('about', 'hero-pt')
  const heroContent = heroLang || heroPt

  // Default values if no content file exists yet
  const name = heroContent?.name || 'Seu Nome'
  const role = heroContent?.role || t('hero.role')

  return (
    <section className="hero" id="hero">
      {/* Left Side - Introduction */}
      <div className="hero-left">
        {/* Logo in top-left corner */}
        <div className="hero-logo">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stylized monogram logo similar to template */}
            <path 
              d="M15 45V15h8l12 18V15h8v30h-8L23 27v18h-8z" 
              fill="#000"
              stroke="#000"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="hero-content animate-fade-in-up">
          <p className="hero-greeting">{t('hero.greeting')}</p>
          <h1 className="hero-name">{name}</h1>
          <p className="hero-role">{role}</p>
        </div>

        {/* Social Icons - Left side bottom */}
        <div className="hero-socials" style={{ position: 'absolute', bottom: '2rem', left: '4rem' }}>
          <SocialIcons variant="light" />
        </div>
      </div>

      {/* Right Side - Photo */}
      <div className="hero-right">
        {/* Profile Image with B&W to Color hover effect */}
        <div className="hero-image-wrapper">
          <img 
            src="/images/profile.jpg" 
            alt={name}
            className="hero-image"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.target.style.display = 'none'
            }}
          />
          {/* Bottom right corner accent */}
          <span className="corner-accent bottom-right"></span>
        </div>
      </div>
    </section>
  )
}

export default Hero
