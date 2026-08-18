import { useTranslation } from 'react-i18next'

/**
 * Footer — single mono line: © year · name · rights.
 */
function Footer() {
  const { t } = useTranslation()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>© {currentYear} gustavo santos · {t('footer.rights')}</p>
    </footer>
  )
}

export default Footer
