import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useContent } from '../hooks/useContent'
import SocialIcons from './SocialIcons'

/**
 * Contato — dark section closing the page: `$ contato --iniciar` command
 * label, big title, short markdown body and the social tiles.
 *
 * Dark (not light as in the mock) because the Depoimentos section between
 * Eventos and Contato is not implemented yet — without it, two light sections
 * would sit back to back, breaking the dark/light alternation rule of the
 * brand guide. Flip to `.sec--light` when a dark section lands before it.
 *
 * Content: /posts/contact/main-<lang>.md.
 */
function Contact() {
  const { t, i18n } = useTranslation()

  const { content } = useContent('contact', 'main', i18n.language)

  return (
    <section className="contact sec--dark" id="contact">
      <div className="container">
        <p className="contact-command">{t('contact.command')}</p>
        <h2>{content?.title || t('contact.title')}</h2>

        <div className="contact-text">
          {content?.body && <ReactMarkdown>{content.body}</ReactMarkdown>}
        </div>

        <div className="contact-socials">
          <SocialIcons iconSize={21} />
        </div>
      </div>
    </section>
  )
}

export default Contact
