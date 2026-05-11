import { useTranslation } from 'react-i18next'
import { useContentList } from '../hooks/useContent'
import { ExternalLink, Github } from 'lucide-react'

/**
 * Projects Section Component
 * 
 * Displays a grid of project cards with thumbnails, titles, and links.
 * Content is loaded dynamically from markdown files in /posts/projects/
 * 
 * Content Structure:
 * - /posts/projects/index.json: Lists all project files to load
 * - /posts/projects/project-name.md: Individual project details
 * 
 * Each project markdown file should have:
 * ---
 * title: Project Name
 * description: Short description
 * thumbnail: /images/projects/project.png
 * codeUrl: https://github.com/...
 * siteUrl: https://...
 * featured: true
 * tags: [react, javascript]
 * ---
 * Optional longer description in markdown body.
 */
function Projects() {
  const { t, i18n } = useTranslation()

  // Load projects list (per current language)
  const { items: projects, isLoading } = useContentList('projects', i18n.language)

  // Default sample projects for initial setup
  const defaultProjects = [
    {
      id: 1,
      title: 'Projeto Exemplo 1',
      description: 'Descrição do primeiro projeto. Edite em /posts/projects/',
      thumbnail: '/images/projects/project1.png',
      codeUrl: 'https://github.com',
      siteUrl: 'https://example.com',
      featured: true,
      tags: ['react', 'javascript']
    },
    {
      id: 2,
      title: 'Projeto Exemplo 2',
      description: 'Descrição do segundo projeto. Adicione seus projetos!',
      thumbnail: '/images/projects/project2.png',
      codeUrl: 'https://github.com',
      siteUrl: '',
      featured: false,
      tags: ['nodejs', 'mongodb']
    },
    {
      id: 3,
      title: 'Projeto Exemplo 3',
      description: 'Mais um projeto de exemplo para demonstração.',
      thumbnail: '/images/projects/project3.png',
      codeUrl: 'https://github.com',
      siteUrl: 'https://example.com',
      featured: true,
      tags: ['typescript', 'react']
    }
  ]

  const displayProjects = projects.length > 0 ? projects : defaultProjects

  // Show every project listed in posts/projects/index.json.
  // (The `featured` flag in frontmatter stays available for future use,
  // e.g. highlighting a "featured" badge or sorting.)
  const filteredProjects = displayProjects

  return (
    <section className="projects-section section" id="projects">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2>{t('projects.title')}</h2>
          <p>{t('projects.subtitle')}</p>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex-center" style={{ padding: '4rem' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Individual Project Card Component
 * 
 * Renders a single project with thumbnail, title, description, and action links.
 */
function ProjectCard({ project, t }) {
  const { title, description, thumbnail, codeUrl, siteUrl, tags } = project

  return (
    <article className="project-card">
      {/* Thumbnail */}
      <div className="project-thumbnail">
        <img 
          src={thumbnail || '/images/projects/placeholder.png'}
          alt={title}
          onError={(e) => {
            // Fallback to placeholder
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect fill="%23041145" width="400" height="250"/><text x="50%" y="50%" fill="white" text-anchor="middle" font-family="sans-serif" font-size="20">📁 Projeto</text></svg>'
          }}
        />
      </div>

      {/* Project Info */}
      <div className="project-info">
        <h3>
          {(siteUrl || codeUrl) ? (
            <a
              href={siteUrl || codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-title-link"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p>{description}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="project-tags">
            {tags.map((tag, i) => (
              <span key={i} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Links */}
        <div className="project-links">
          {codeUrl && (
            <a 
              href={codeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link"
            >
              <Github size={14} />
              {t('projects.viewCode')}
            </a>
          )}
          {siteUrl && (
            <a 
              href={siteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link"
            >
              <ExternalLink size={14} />
              {t('projects.viewSite')}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default Projects
