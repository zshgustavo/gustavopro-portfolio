import { useTranslation } from 'react-i18next'
import { ArrowUp } from 'lucide-react'
import SocialIcons from './SocialIcons'

/**
 * Footer Component
 * 
 * The site footer that appears at the bottom of every page.
 * Features:
 * - Back to top button
 * - Social media icons
 * - Copyright notice
 * 
 * The footer uses a dark theme to match the template design.
 */
function Footer() {
  const { t } = useTranslation()

  // Scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get current year for copyright
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Back to Top Button */}
          <button 
            className="back-to-top"
            onClick={scrollToTop}
            aria-label={t('footer.backToTop')}
          >
            <ArrowUp size={18} />
            {t('footer.backToTop')}
          </button>

          {/* Social Icons */}
          <div className="footer-socials">
            <SocialIcons variant="light" />
          </div>

          {/* Copyright */}
          <p className="footer-copyright">
            © {currentYear} Portfolio. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
