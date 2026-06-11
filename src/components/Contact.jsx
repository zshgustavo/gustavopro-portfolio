import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useContent } from '../hooks/useContent'
import SocialIcons from './SocialIcons'

/**
 * Contact Section Component
 *
 * Left side: title, subtitle, contact text and social icons.
 * Right side: official LinkedIn public profile badge.
 *
 * Implementation notes:
 *  - The badge markup is rendered via `dangerouslySetInnerHTML` so React's
 *    virtual DOM does not fight with the LinkedIn script when it swaps the
 *    inner content for the official iframe.
 *  - The LinkedIn script (`platform.linkedin.com/badges/js/profile.js`) is
 *    injected once on mount and re-injected when the language changes so the
 *    badge re-parses with the new locale.
 */
function Contact() {
  const { t, i18n } = useTranslation()

  const lang = i18n.language
  const { content: contactContent } = useContent('contact', `main-${lang}`)
  const { content: fallbackContent } = useContent('contact', 'main-pt')
  const content = contactContent || fallbackContent

  const badgeLocale = lang === 'pt' ? 'pt_BR' : 'en_US'

  const badgeHtml = `
    <div class="badge-base LI-profile-badge"
         data-locale="${badgeLocale}"
         data-size="large"
         data-theme="light"
         data-type="HORIZONTAL"
         data-vanity="gustavribeiro"
         data-version="v1">
      <a class="badge-base__link LI-simple-link"
         href="https://br.linkedin.com/in/gustavribeiro?trk=profile-badge"
         target="_blank"
         rel="noopener noreferrer">
        Gustavo Ribeiro dos Santos
      </a>
    </div>
  `

  useEffect(() => {
    // Give React a tick to commit the badge markup, then drop any existing
    // LinkedIn script and re-inject it so its IIFE re-runs and processes
    // the freshly-mounted badge with the current locale.
    const t = setTimeout(() => {
      const existing = document.getElementById('linkedin-badge-script')
      if (existing) existing.remove()

      const script = document.createElement('script')
      script.id = 'linkedin-badge-script'
      script.src = 'https://platform.linkedin.com/badges/js/profile.js'
      script.async = true
      script.defer = true
      script.type = 'text/javascript'
      document.body.appendChild(script)
    }, 100)

    return () => clearTimeout(t)
  }, [lang])

  return (
    <section className="contact-section section" id="contact">
      <div className="container">
        <div className="contact-container">
          {/* Left Side - Text and Social Links */}
          <div className="contact-left">
            <h2>{content?.title || t('contact.title')}</h2>
            <p className="contact-subtitle">{t('contact.explore')}</p>

            <div className="about-separator"></div>

            <p className="contact-text">
              {content?.body || t('contact.subtitle')}
            </p>

            <div className="contact-socials">
              <SocialIcons variant="dark" />
            </div>
          </div>

          {/* Right Side - LinkedIn Profile Badge */}
          <div
            key={badgeLocale}
            className="contact-linkedin"
            dangerouslySetInnerHTML={{ __html: badgeHtml }}
          />
        </div>
      </div>
    </section>
  )
}

export default Contact
