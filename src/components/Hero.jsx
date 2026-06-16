import { useTranslation } from 'react-i18next'
import { defaultHeroContent } from '../data/siteContent'
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

  const lang = i18n.language
  const { content: heroContent } = useContent('about', `hero-${lang}`, 'hero-pt')

  const name = heroContent?.name || defaultHeroContent.name
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
        <div className="hero-socials">
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
