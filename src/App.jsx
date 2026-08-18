import { useTranslation } from 'react-i18next'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'

function App() {
  const { i18n } = useTranslation()

  // Change language and remember the choice (see src/i18n.js).
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="app">
      {/* Navigation with language switcher */}
      <Navbar
        currentLang={i18n.language}
        onChangeLang={changeLanguage}
      />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <About />
        <Projects />
        <Events />
        <Contact />
      </main>

      {/* Footer with social icons */}
      <Footer />

      {/* Floating back-to-top button, top-left, shown after scroll */}
      <BackToTop />
    </div>
  )
}

export default App
