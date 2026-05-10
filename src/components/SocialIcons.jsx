import { Github, Linkedin, Globe, Instagram, Music } from 'lucide-react'

/**
 * Social Icons Component
 * 
 * Displays social media icons in this order:
 * LinkedIn, GitHub, Website, Gravatar, GDG Cloud Brasília, Instagram, Last.fm
 * 
 * Variants:
 * - 'light': For use on dark backgrounds (white icons)
 * - 'dark': For use on light backgrounds (dark icons)
 */

// Custom Gravatar Icon
const GravatarIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
)

// Custom GDG Icon
const GDGIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
)

// Custom Last.fm Icon
const LastFmIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.584 17.21l-.88-2.392s-1.43 1.594-3.573 1.594c-1.897 0-3.244-1.649-3.244-4.288 0-3.381 1.704-4.591 3.381-4.591 2.42 0 3.189 1.567 3.849 3.574l.88 2.749c.88 2.666 2.529 4.81 7.285 4.81 3.409 0 5.718-1.044 5.718-3.793 0-2.227-1.265-3.381-3.63-3.931l-1.758-.385c-1.21-.275-1.567-.77-1.567-1.595 0-.934.742-1.484 1.952-1.484 1.32 0 2.034.495 2.144 1.677l2.749-.33c-.22-2.474-1.924-3.492-4.729-3.492-2.474 0-4.893.935-4.893 3.932 0 1.87.907 3.051 3.189 3.601l1.87.44c1.402.33 1.869.907 1.869 1.704 0 1.017-.99 1.43-2.86 1.43-2.776 0-3.93-1.457-4.59-3.464l-.907-2.75c-1.155-3.573-2.997-4.893-6.653-4.893C2.144 5.333 0 7.89 0 12.233c0 4.18 2.144 6.434 5.993 6.434 3.106 0 4.591-1.457 4.591-1.457z"/>
  </svg>
)

function SocialIcons({ variant = 'light' }) {
  // Social links configuration - Edit these URLs
  const socialLinks = {
    linkedin: 'https://linkedin.com/in/gustavozsh',
    github: 'https://github.com/zshgustavo',
    website: 'https://gustavosantos.dev',
    gravatar: 'https://gravatar.com/gustavozsh',
    gdg: 'https://gdg.community.dev/gdg-cloud-brasilia/',
    instagram: 'https://instagram.com/gustavozsh',
    lastfm: 'https://last.fm/user/gustavozsh'
  }

  // Icon configuration in the specified order
  const socialIcons = [
    { 
      id: 'linkedin', 
      Icon: Linkedin, 
      url: socialLinks.linkedin,
      label: 'LinkedIn'
    },
    { 
      id: 'github', 
      Icon: Github, 
      url: socialLinks.github,
      label: 'GitHub'
    },
    { 
      id: 'website', 
      Icon: Globe, 
      url: socialLinks.website,
      label: 'Website'
    },
    { 
      id: 'gravatar', 
      Icon: GravatarIcon, 
      url: socialLinks.gravatar,
      label: 'Gravatar'
    },
    { 
      id: 'gdg', 
      Icon: GDGIcon, 
      url: socialLinks.gdg,
      label: 'GDG Cloud Brasília'
    },
    { 
      id: 'instagram', 
      Icon: Instagram, 
      url: socialLinks.instagram,
      label: 'Instagram'
    },
    { 
      id: 'lastfm', 
      Icon: LastFmIcon, 
      url: socialLinks.lastfm,
      label: 'Last.fm'
    }
  ]

  // Filter out empty links
  const activeSocials = socialIcons.filter(social => social.url)

  return (
    <div className={`social-icons-container ${variant}`}>
      {activeSocials.map(({ id, Icon, url, label }) => (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
          aria-label={label}
          title={label}
        >
          <Icon size={22} />
        </a>
      ))}
    </div>
  )
}

export default SocialIcons
