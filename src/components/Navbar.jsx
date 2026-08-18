import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Nav — Terminal direction: `~/gustavo-santos` brand, mono links with a `./`
 * prefix, contact link in accent, PT | EN switcher. Sticky with a 1px bottom
 * border; collapses into a hamburger below 1080px.
 */

const LINKS = [
  { id: 'about', key: 'nav.about' },
  { id: 'skills', key: 'nav.stack' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'certifications', key: 'nav.certifications' },
  { id: 'events', key: 'nav.events' },
  { id: 'contact', key: 'nav.contact', cta: true },
]

function Navbar({ currentLang, onChangeLang }) {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <nav className="nav">
      <span className="nav-brand">~/gustavo-santos</span>

      <div className={`nav-menu ${isMenuOpen ? 'is-open' : ''}`}>
        {LINKS.map(({ id, key, cta }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-link ${cta ? 'nav-link--cta' : ''}`}
            onClick={(e) => scrollToSection(e, id)}
          >
            ./{t(key)}
          </a>
        ))}

        <div className="nav-lang">
          <button
            aria-pressed={currentLang === 'pt'}
            onClick={() => onChangeLang('pt')}
          >
            PT
          </button>
          <span>|</span>
          <button
            aria-pressed={currentLang === 'en'}
            onClick={() => onChangeLang('en')}
          >
            EN
          </button>
        </div>
      </div>

      <button
        className={`nav-toggle ${isMenuOpen ? 'is-open' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  )
}

export default Navbar
