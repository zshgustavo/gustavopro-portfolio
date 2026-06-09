import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUp } from 'lucide-react'

/**
 * BackToTop — floating button shown after the user scrolls past a threshold.
 *
 * Anchored to the top-left, below the fixed navbar. Smoothly scrolls the page
 * back to the top when clicked. Fades in/out based on scroll position.
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
      className={`back-to-top-floating ${visible ? 'is-visible' : ''}`}
      aria-label={t('footer.backToTop')}
      title={t('footer.backToTop')}
    >
      <ArrowUp size={20} />
    </button>
  )
}

export default BackToTop
