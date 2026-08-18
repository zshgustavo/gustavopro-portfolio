import { useTranslation } from 'react-i18next'
import { useContent } from '../hooks/useContent'

/**
 * Certificações — dark section: one bordered slot per provider, name below.
 *
 * Content: /posts/certifications/main-<lang>.md — `title`, `subtitle` and a
 * `certs` list of `{ code, name, img? }`. Provider names are proper nouns and
 * are identical in both languages.
 *
 * `img` is where the official badge (Credly / Google Cloud) goes. While it is
 * empty the slot renders `[code]` in mono — intentional placeholder, not a
 * broken image. See GUIA_CONTEUDO.md.
 */
function Certifications() {
  const { t, i18n } = useTranslation()

  const { content } = useContent('certifications', 'main', i18n.language)

  const certs = Array.isArray(content?.certs) ? content.certs : []

  return (
    <section className="sec--dark" id="certifications">
      <div className="container">
        <p className="sec-label">## {content?.title || t('certs.title')}</p>
        <p className="sec-subtitle">{content?.subtitle || t('certs.subtitle')}</p>

        {certs.length > 0 && (
          <div className="certs-row">
            {certs.map(({ code, name, img }) => (
              <div key={code || name} className="cert-cell">
                <div className="cert-slot">
                  {img ? (
                    <img src={img} alt={`Badge ${name}`} />
                  ) : (
                    <span className="cert-slot-code">[{code}]</span>
                  )}
                </div>
                <p className="cert-name">{name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Certifications
