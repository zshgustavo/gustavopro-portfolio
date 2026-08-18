import { useTranslation } from 'react-i18next'
import { useContentList } from '../hooks/useContent'

/**
 * Eventos — light section: 3-column cards, 16:10 thumbnail with the type
 * badge overlaid top-right, `date · location` in mono, `ver fotos →` link.
 *
 * Content: /posts/events/index.json + event-N-<lang>.md.
 */
function Events() {
  const { t, i18n } = useTranslation()

  const { items: events, isLoading } = useContentList('events', i18n.language)

  // Short "mon year" form per the design ("mai 2026" / "May 2026").
  // Parse YYYY-MM explicitly in LOCAL time — `new Date('2025-08')` would be
  // read as UTC midnight and shift a month in negative-offset timezones.
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(dateString)
    const date = match
      ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3] || 1))
      : new Date(dateString)
    if (Number.isNaN(date.getTime())) return ''
    const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US'
    const month = date.toLocaleDateString(locale, { month: 'short' }).replace('.', '')
    return `${month} ${date.getFullYear()}`
  }

  return (
    <section className="sec--light" id="events">
      <div className="container">
        <p className="sec-label">## {t('events.title')}</p>
        <p className="sec-subtitle">{t('events.subtitle')}</p>

        {isLoading ? (
          <p className="loading">$ {t('common.loading')}</p>
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
  const { title, description, date, location, type, thumbnail, albumUrl } = event

  return (
    <article className="event-card">
      <div className="event-thumb">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}
        <span className="event-badge">
          {type === 'coordinated' ? t('events.coordinated') : t('events.speaker')}
        </span>
      </div>

      <div className="event-body">
        <p className="event-meta">
          {formatDate(date)}
          {location ? ` · ${location}` : ''}
        </p>

        <h3>{title}</h3>
        {description && <p className="event-desc">{description}</p>}

        {albumUrl && (
          <a
            href={albumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-link"
          >
            {t('events.viewPhotos')} →
          </a>
        )}
      </div>
    </article>
  )
}

export default Events
