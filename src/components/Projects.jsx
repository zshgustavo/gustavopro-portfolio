import { useTranslation } from 'react-i18next'
import { useContentList } from '../hooks/useContent'

/**
 * Projetos — light section: 2-column cards, 2:1 thumbnail, mono tag line,
 * text action links (`ver código →` / `ver site →`).
 *
 * Content: /posts/projects/index.json + project-N-<lang>.md.
 */
function Projects() {
  const { t, i18n } = useTranslation()

  const { items: projects, isLoading } = useContentList('projects', i18n.language)

  return (
    <section className="sec--light" id="projects">
      <div className="container">
        <p className="sec-label">## {t('projects.title')}</p>
        <p className="sec-subtitle">{t('projects.subtitle')}</p>

        {isLoading ? (
          <p className="loading">$ {t('common.loading')}</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.id || index} project={project} t={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, t }) {
  const { title, description, thumbnail, codeUrl, siteUrl, tags } = project
  const mainUrl = siteUrl || codeUrl

  return (
    <article className="project-card">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      )}

      <div className="project-body">
        {Array.isArray(tags) && tags.length > 0 && (
          <p className="project-tags">{tags.join(' · ')}</p>
        )}

        <h3>
          {mainUrl ? (
            <a href={mainUrl} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>

        {description && <p className="project-desc">{description}</p>}

        <div className="project-links">
          {codeUrl && (
            <a
              href={codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-link"
            >
              {t('projects.viewCode')} →
            </a>
          )}
          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-link"
            >
              {t('projects.viewSite')} →
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default Projects
