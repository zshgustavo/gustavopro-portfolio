import { useTranslation } from 'react-i18next'
import { useContentList } from '../hooks/useContent'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'

/**
 * Events Section Component
 *
 * Displays events coordinated or spoken at. Each card has a short summary
 * and (optionally) a "See more" button that opens an external photo album
 * (e.g. Cloudinary collection, Google Photos, etc.) provided via the
 * `albumUrl` frontmatter field.
 *
 * Content Structure:
 * - /posts/events/index.json: ordered list of event base names
 * - /posts/events/<base>-<lang>.md: localized event details
 *
 * Frontmatter shape:
 *   ---
 *   id: 1
 *   title: GDG Summit Lima 2025
 *   description: Short summary in one or two sentences.
 *   date: 2025-08             # YYYY-MM (rendered as "August 2025" / "agosto de 2025")
 *   location: Lima, Peru
 *   type: speaker | coordinated
 *   thumbnail: https://res.cloudinary.com/.../cover.jpg
 *   albumUrl: https://...      # optional — renders the "See more" button
 *   ---
 */
function Events() {
  const { t, i18n } = useTranslation()

  const { items: events, isLoading } = useContentList('events', i18n.language)

  // Format date as "month year" (no day) — events are typically scoped to a month.
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString(
      i18n.language === 'pt' ? 'pt-BR' : 'en-US',
      { year: 'numeric', month: 'long' },
    )
  }

  return (
    <section className="events-section section" id="events">
      <div className="container">
        <div className="section-header">
          <h2>{t('events.title')}</h2>
          <p>{t('events.subtitle')}</p>
        </div>

        {isLoading ? (
          <div className="flex-center" style={{ padding: '4rem' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event, index) => (
              <EventCard
                key={event.id || index}
                event={event}
                t={t}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function EventCard({ event, t, formatDate }) {
  const {
    title,
    description,
    date,
    location,
    type,
    thumbnail,
    albumUrl,
  } = event

  return (
    <article className="event-card">
      <div className="event-thumbnail">
        <img
          src={thumbnail || '/images/events/placeholder.jpg'}
          alt={title}
          onError={(e) => {
            e.target.src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect fill="%23041145" width="400" height="250"/><text x="50%" y="50%" fill="white" text-anchor="middle" font-family="sans-serif" font-size="20">🎤 Evento</text></svg>'
          }}
        />
        <span className="event-badge">
          {type === 'coordinated' ? t('events.coordinated') : t('events.speaker')}
        </span>
      </div>

      <div className="event-info">
        <div className="event-date">
          <span className="event-meta">
            <Calendar size={14} />
            {formatDate(date)}
          </span>
          {location && (
            <span className="event-meta">
              <MapPin size={14} />
              {location}
            </span>
          )}
        </div>

        <h3>{title}</h3>
        {description && <p>{description}</p>}

        {albumUrl && (
          <a
            href={albumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="event-album-link"
          >
            {t('events.viewMore')}
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  )
}

export default Events
