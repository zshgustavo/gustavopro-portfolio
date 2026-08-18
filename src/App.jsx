import { useTranslation } from 'react-i18next'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'

/**
 * Section order follows the approved Terminal design, alternating dark/light:
 * hero (dark) → sobre (light) → stack (dark) → projetos (light) →
 * certificações (dark) → eventos (light) → contato (dark) → footer.
 */
function App() {
  const { i18n } = useTranslation()

  // Change language and remember the choice (see src/i18n.js).
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="app">
      <Navbar
        currentLang={i18n.language}
        onChangeLang={changeLanguage}
      />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Events />
        <Contact />
      </main>

      <Footer />

      <BackToTop />
    </div>
  )
}

export default App
