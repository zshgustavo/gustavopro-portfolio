import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContent } from '../hooks/useContent'
import SocialIcons from './SocialIcons'
import { Send, CheckCircle } from 'lucide-react'
import { defaultContactContent } from '../data/siteContent'

/**
 * Contact Section Component
 * 
 * Provides a contact form and displays social links.
 * The form can be connected to services like Formspree, Netlify Forms, etc.
 * 
 * Content Structure:
 * - /posts/contact/main.md: Contact section text
 * - /posts/contact/social.md: Social media links
 * 
 * The contact information markdown file should have:
 * ---
 * title: Contact Title
 * subtitle: Subtitle
 * email: your@email.com
 * formEndpoint: https://formspree.io/f/xxxxx (optional)
 * ---
 * Additional text content for the contact section.
 */
function Contact() {
  const { t, i18n } = useTranslation()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // Load contact content based on language
  const lang = i18n.language
  const { content } = useContent('contact', `main-${lang}`, 'main-pt')
  const displayContent = content || defaultContactContent

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // If a form endpoint is configured, submit to it
      const endpoint = displayContent.formEndpoint || 'https://formspree.io/f/YOUR_FORM_ID'
      
      // For demo purposes, just simulate a successful submission
      // Replace with actual form submission logic
      if (endpoint.includes('YOUR_FORM_ID')) {
        // Simulate submission for demo
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSubmitted(true)
        setFormState({ name: '', email: '', message: '' })
      } else {
        // Real form submission
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formState)
        })

        if (response.ok) {
          setIsSubmitted(true)
          setFormState({ name: '', email: '', message: '' })
        } else {
          throw new Error('Form submission failed')
        }
      }
    } catch (err) {
      setError('Houve um erro ao enviar. Tente novamente.')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form after successful submission
  const resetForm = () => {
    setIsSubmitted(false)
    setFormState({ name: '', email: '', message: '' })
  }

  return (
    <section className="contact-section section" id="contact">
      <div className="container">
        <div className="contact-container">
          {/* Left Side - Text and Social Links */}
          <div className="contact-left">
            <h2>{displayContent.title || t('contact.title')}</h2>
            <p className="contact-subtitle">{displayContent.subtitle || t('contact.explore')}</p>
            
            <div className="about-separator"></div>
            
            <p className="contact-text">
              {displayContent.body || t('contact.subtitle')}
            </p>

            {/* Social Links */}
            <div className="contact-socials">
              <SocialIcons variant="dark" />
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="contact-form">
            {isSubmitted ? (
              // Success Message
              <div className="contact-success">
                <CheckCircle 
                  size={60} 
                  color="#041145" 
                  className="success-icon"
                />
                <h3 className="success-title">
                  {i18n.language === 'pt' ? 'Mensagem Enviada!' : 'Message Sent!'}
                </h3>
                <p className="success-text">
                  {i18n.language === 'pt' 
                    ? 'Obrigado pelo contato. Responderei em breve!' 
                    : 'Thank you for reaching out. I\'ll respond soon!'}
                </p>
                <button 
                  onClick={resetForm}
                  className="submit-btn reset-btn"
                >
                  {i18n.language === 'pt' ? 'Enviar outra mensagem' : 'Send another message'}
                </button>
              </div>
            ) : (
              // Contact Form
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">{t('contact.name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder={t('contact.namePlaceholder')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('contact.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder={t('contact.emailPlaceholder')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t('contact.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder={t('contact.messagePlaceholder')}
                    required
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <p className="contact-error">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={`submit-btn submit-btn-flex ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner small-spinner" />
                      {i18n.language === 'pt' ? 'Enviando...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t('contact.submit')}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
