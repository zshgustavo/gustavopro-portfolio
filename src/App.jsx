import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial loading for smooth animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Function to change language
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    )
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
    </div>
  )
}

export default App
