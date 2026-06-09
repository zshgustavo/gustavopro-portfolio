import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe } from 'lucide-react'

/**
 * Navbar Component
 * 
 * Features:
 * - Fixed navigation that changes style on scroll
 * - Responsive mobile menu
 * - Language switcher (PT/EN)
 * - Smooth scroll navigation to sections
 */
function Navbar({ currentLang, onChangeLang }) {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll to add background to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      {/* Logo - visible only after scroll or on mobile */}
      <div className="navbar-logo" style={{ opacity: isScrolled ? 1 : 0 }}>
        <svg viewBox="0 0 50 50" fill="currentColor" style={{ color: '#fff' }}>
          <text x="3" y="36" fontSize="26" fontWeight="bold" fontFamily="Poppins">GS</text>
        </svg>
      </div>

      {/* Desktop Navigation Menu */}
      <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <a 
          href="#about" 
          className="navbar-link"
          onClick={(e) => { e.preventDefault(); scrollToSection('about') }}
        >
          {t('nav.about')}
        </a>
        <a 
          href="#projects" 
          className="navbar-link"
          onClick={(e) => { e.preventDefault(); scrollToSection('projects') }}
        >
          {t('nav.projects')}
        </a>
        <a 
          href="#events" 
          className="navbar-link"
          onClick={(e) => { e.preventDefault(); scrollToSection('events') }}
        >
          {t('nav.events')}
        </a>
        
        {/* Contact CTA Button */}
        <a 
          href="#contact" 
          className="navbar-cta"
          onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}
        >
          {t('nav.contactMe')}
        </a>

        {/* Language Switcher */}
        <div className="language-switcher">
          <Globe size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
          <button 
            className={`lang-btn ${currentLang === 'pt' ? 'active' : ''}`}
            onClick={() => onChangeLang('pt')}
          >
            PT
          </button>
          <button 
            className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
            onClick={() => onChangeLang('en')}
          >
            EN
          </button>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X size={24} color="#fff" />
        ) : (
          <>
            <span></span>
            <span></span>
            <span></span>
          </>
        )}
      </button>
    </nav>
  )
}

export default Navbar
