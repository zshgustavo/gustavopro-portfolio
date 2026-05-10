import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContentList } from '../hooks/useContent'
import { Calendar, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Events Section Component
 * 
 * Displays events that the site owner has coordinated or spoken at.
 * Includes a photo gallery modal for viewing event photos.
 * 
 * Content Structure:
 * - /posts/events/index.json: Lists all event files to load
 * - /posts/events/event-name.md: Individual event details
 * 
 * Each event markdown file should have:
 * ---
 * title: Event Name
 * description: Short description
 * date: 2024-01-15
 * location: São Paulo, SP
 * type: coordinated | speaker
 * thumbnail: /images/events/event.jpg
 * photos: [/images/events/event-1.jpg, /images/events/event-2.jpg]
 * ---
 * Optional longer description in markdown body.
 */
function Events() {
  const { t, i18n } = useTranslation()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  
  // Load events list (per current language)
  const { items: events, isLoading } = useContentList('events', i18n.language)

  // Default sample events for initial setup
  const defaultEvents = [
    {
      id: 1,
      title: 'Evento de Exemplo 1',
      description: 'Descrição do primeiro evento. Edite em /posts/events/',
      date: '2024-06-15',
      location: 'São Paulo, SP',
      type: 'coordinated',
      thumbnail: '/images/events/event1.jpg',
      photos: ['/images/events/event1-1.jpg', '/images/events/event1-2.jpg']
    },
    {
      id: 2,
      title: 'Palestra Tech Conference',
      description: 'Uma palestra sobre desenvolvimento web moderno.',
      date: '2024-03-20',
      location: 'Rio de Janeiro, RJ',
      type: 'speaker',
      thumbnail: '/images/events/event2.jpg',
      photos: ['/images/events/event2-1.jpg']
    },
    {
      id: 3,
      title: 'Workshop de React',
      description: 'Workshop prático de React para iniciantes.',
      date: '2024-01-10',
      location: 'Online',
      type: 'speaker',
      thumbnail: '/images/events/event3.jpg',
      photos: []
    }
  ]

  const displayEvents = events.length > 0 ? events : defaultEvents

  // Format date based on language
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Photo gallery navigation
  const openGallery = (event) => {
    if (event.photos && event.photos.length > 0) {
      setSelectedEvent(event)
      setCurrentPhotoIndex(0)
    }
  }

  const closeGallery = () => {
    setSelectedEvent(null)
    setCurrentPhotoIndex(0)
  }

  const nextPhoto = () => {
    if (selectedEvent) {
      setCurrentPhotoIndex((prev) => 
        prev < selectedEvent.photos.length - 1 ? prev + 1 : 0
      )
    }
  }

  const prevPhoto = () => {
    if (selectedEvent) {
      setCurrentPhotoIndex((prev) => 
        prev > 0 ? prev - 1 : selectedEvent.photos.length - 1
      )
    }
  }

  return (
    <section className="events-section section" id="events">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2>{t('events.title')}</h2>
          <p>{t('events.subtitle')}</p>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex-center" style={{ padding: '4rem' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="events-grid">
            {displayEvents.map((event, index) => (
              <EventCard 
                key={event.id || index} 
                event={event} 
                t={t}
                formatDate={formatDate}
                onViewPhotos={() => openGallery(event)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Photo Gallery Modal */}
      {selectedEvent && (
        <div 
          className={`modal-overlay ${selectedEvent ? 'active' : ''}`}
          onClick={closeGallery}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeGallery}>
              <X size={24} />
            </button>
            
            {/* Navigation arrows */}
            {selectedEvent.photos.length > 1 && (
              <>
                <button 
                  onClick={prevPhoto}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff'
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextPhoto}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff'
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <img 
              src={selectedEvent.photos[currentPhotoIndex]}
              alt={`${selectedEvent.title} - Foto ${currentPhotoIndex + 1}`}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23333" width="400" height="300"/><text x="50%" y="50%" fill="white" text-anchor="middle" font-family="sans-serif">Imagem não encontrada</text></svg>'
              }}
            />

            {/* Photo counter */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#fff',
              fontSize: '0.9rem',
              background: 'rgba(0,0,0,0.5)',
              padding: '0.5rem 1rem',
              borderRadius: '20px'
            }}>
              {currentPhotoIndex + 1} / {selectedEvent.photos.length}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/**
 * Individual Event Card Component
 * 
 * Renders a single event with thumbnail, title, description, and photo gallery access.
 */
function EventCard({ event, t, formatDate, onViewPhotos }) {
  const { title, description, date, location, type, thumbnail, photos } = event

  return (
    <article className="event-card">
      {/* Thumbnail */}
      <div className="event-thumbnail">
        <img 
          src={thumbnail || '/images/events/placeholder.jpg'}
          alt={title}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect fill="%23041145" width="400" height="250"/><text x="50%" y="50%" fill="white" text-anchor="middle" font-family="sans-serif" font-size="20">🎤 Evento</text></svg>'
          }}
        />
        {/* Event Type Badge */}
        <span className="event-badge">
          {type === 'coordinated' ? t('events.coordinated') : t('events.speaker')}
        </span>
      </div>

      {/* Event Info */}
      <div className="event-info">
        {/* Date and Location */}
        <div className="event-date" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} />
            {formatDate(date)}
          </span>
          {location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} />
              {location}
            </span>
          )}
        </div>

        <h3>{title}</h3>
        <p>{description}</p>

        {/* Photo Gallery Thumbnails */}
        {photos && photos.length > 0 && (
          <div className="event-gallery">
            {photos.slice(0, 4).map((photo, index) => (
              <div 
                key={index}
                className="gallery-thumb"
                onClick={onViewPhotos}
                style={index === 3 && photos.length > 4 ? {
                  position: 'relative'
                } : {}}
              >
                <img 
                  src={photo}
                  alt={`${title} - Foto ${index + 1}`}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><rect fill="%23ccc" width="50" height="50"/></svg>'
                  }}
                />
                {/* Show +X more indicator on last thumbnail */}
                {index === 3 && photos.length > 4 && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    +{photos.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View Photos Button */}
        {photos && photos.length > 0 && (
          <button 
            onClick={onViewPhotos}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#041145',
              background: 'rgba(4, 17, 69, 0.1)',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: '0.3s ease'
            }}
          >
            {t('events.viewPhotos')} ({photos.length})
          </button>
        )}
      </div>
    </article>
  )
}

export default Events
