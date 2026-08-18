import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * BackToTop — floating square button (1px border, no radius, per the system)
 * shown after the user scrolls past a threshold. Bottom-right.
 */
function BackToTop({ threshold = 400 }) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      aria-label={t('footer.backToTop')}
      title={t('footer.backToTop')}
    >
      ↑
    </button>
  )
}

export default BackToTop
