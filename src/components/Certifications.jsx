import { useTranslation } from 'react-i18next'

/**
 * Certificações — dark section: one bordered slot per provider, name below.
 * Provider names are proper nouns and stay untranslated.
 *
 * The design reserves each slot for the official badge image (Credly / Google
 * Cloud). Until a badge URL is filled in, the slot renders the provider code
 * in mono — intentional, not a broken image.
 */

const CERTS = [
  { id: 'gcp', code: 'gcp', name: 'Google Cloud', img: null },
  { id: 'azure', code: 'az', name: 'Microsoft Azure', img: null },
  { id: 'aws', code: 'aws', name: 'AWS', img: null },
  { id: 'oci', code: 'oci', name: 'Oracle OCI', img: null },
  { id: 'ibm', code: 'ibm', name: 'IBM Cloud', img: null },
  { id: 'astronomer', code: 'astro', name: 'Astronomer (Airflow)', img: null },
]

function Certifications() {
  const { t } = useTranslation()

  return (
    <section className="sec--dark" id="certifications">
      <div className="container">
        <p className="sec-label">## {t('certs.title')}</p>
        <p className="sec-subtitle">{t('certs.subtitle')}</p>

        <div className="certs-row">
          {CERTS.map(({ id, code, name, img }) => (
            <div key={id} className="cert-cell">
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
      </div>
    </section>
  )
}

export default Certifications
