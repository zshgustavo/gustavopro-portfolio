const createSvgPlaceholder = (emoji, label, background = '#041145') =>
  `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">
      <rect fill="${background}" width="400" height="250"/>
      <text x="50%" y="50%" fill="white" text-anchor="middle" font-family="sans-serif" font-size="20">
        ${emoji} ${label}
      </text>
    </svg>
  `)}`

export const socialLinks = {
  linkedin: 'https://linkedin.com/in/gustavozsh',
  github: 'https://github.com/zshgustavo',
  website: 'https://gustavosantos.dev',
  gravatar: 'https://gravatar.com/gustavozsh',
  gdg: 'https://gdg.community.dev/gdg-cloud-brasilia/',
  instagram: 'https://instagram.com/gustavozsh',
  lastfm: 'https://last.fm/user/gustavozsh',
}

export const defaultHeroContent = {
  name: 'Seu Nome',
  role: 'Senior Data & Cloud Engineer',
}

export const defaultAboutContent = {
  title: 'SOBRE MIM',
  subtitle: 'TRAJETÓRIA',
  image: '/images/about.png',
  body: `Aqui você pode escrever sobre sua trajetória profissional, experiências e objetivos.

Para editar este conteúdo, crie ou modifique o arquivo \`/posts/about/main-pt.md\` ou \`/posts/about/main-en.md\` para a versão em inglês.

Use markdown para formatar seu texto com **negrito**, *itálico*, e muito mais.`,
}

export const defaultContactContent = {
  title: 'CONTATO',
  subtitle: 'EXPLORE',
  body: 'Tem algum projeto em mente ou gostaria de conversar sobre tecnologia? Entre em contato comigo através do formulário ao lado ou pelas redes sociais.\n\nResponderei o mais breve possível!',
  formEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
}

export const defaultProjects = [
  {
    id: 1,
    title: 'Projeto Exemplo 1',
    description: 'Descrição do primeiro projeto. Edite em /posts/projects/',
    thumbnail: createSvgPlaceholder('📁', 'Projeto'),
    codeUrl: 'https://github.com',
    siteUrl: 'https://example.com',
    featured: true,
    tags: ['react', 'javascript'],
  },
  {
    id: 2,
    title: 'Projeto Exemplo 2',
    description: 'Descrição do segundo projeto. Adicione seus projetos!',
    thumbnail: createSvgPlaceholder('📁', 'Projeto'),
    codeUrl: 'https://github.com',
    siteUrl: '',
    featured: false,
    tags: ['nodejs', 'mongodb'],
  },
  {
    id: 3,
    title: 'Projeto Exemplo 3',
    description: 'Mais um projeto de exemplo para demonstração.',
    thumbnail: createSvgPlaceholder('📁', 'Projeto'),
    codeUrl: 'https://github.com',
    siteUrl: 'https://example.com',
    featured: true,
    tags: ['typescript', 'react'],
  },
]

export const defaultEvents = [
  {
    id: 1,
    title: 'Evento de Exemplo 1',
    description: 'Descrição do primeiro evento. Edite em /posts/events/',
    date: '2024-06-15',
    location: 'São Paulo, SP',
    type: 'coordinated',
    thumbnail: createSvgPlaceholder('🎤', 'Evento'),
    photos: [createSvgPlaceholder('🎤', 'Evento'), createSvgPlaceholder('🎤', 'Evento')],
  },
  {
    id: 2,
    title: 'Palestra Tech Conference',
    description: 'Uma palestra sobre desenvolvimento web moderno.',
    date: '2024-03-20',
    location: 'Rio de Janeiro, RJ',
    type: 'speaker',
    thumbnail: createSvgPlaceholder('🎤', 'Evento'),
    photos: [createSvgPlaceholder('🎤', 'Evento')],
  },
  {
    id: 3,
    title: 'Workshop de React',
    description: 'Workshop prático de React para iniciantes.',
    date: '2024-01-10',
    location: 'Online',
    type: 'speaker',
    thumbnail: createSvgPlaceholder('🎤', 'Evento'),
    photos: [],
  },
]

