import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources for Portuguese and English
const resources = {
  pt: {
    translation: {
      // Navigation
      nav: {
        about: 'Sobre',
        projects: 'Projetos',
        events: 'Eventos',
        contact: 'Contato',
        contactMe: 'CONTATO'
      },
      // Hero Section
      hero: {
        greeting: 'Olá, eu sou',
        role: 'Engenheiro de Dados e Cloud Sênior'
      },
      // About Section
      about: {
        title: 'SOBRE MIM',
        explore: 'EXPLORE',
        readMore: 'LEIA MAIS',
        trajectory: 'TRAJETÓRIA',
        experience: 'EXPERIÊNCIA'
      },
      // Projects Section
      projects: {
        title: 'PROJETOS',
        subtitle: 'Alguns dos projetos em que participei',
        viewCode: 'Ver Código',
        viewSite: 'Ver Site',
        all: 'TODOS',
        featured: 'DESTAQUES'
      },
      // Events Section
      events: {
        title: 'EVENTOS',
        subtitle: 'Eventos que coordenei ou palestrei',
        viewPhotos: 'Ver Fotos',
        viewMore: 'Ver mais',
        coordinated: 'Coordenado',
        speaker: 'Palestrante'
      },
      // Contact Section
      contact: {
        title: 'CONTATO',
        subtitle: 'Entre em contato comigo',
        explore: 'EXPLORE',
        name: 'Nome',
        email: 'E-mail',
        message: 'Mensagem',
        submit: 'ENVIAR',
        namePlaceholder: 'Seu nome',
        emailPlaceholder: 'zshgustavo@gmail.com',
        messagePlaceholder: 'Sua mensagem...'
      },
      // Footer
      footer: {
        backToTop: 'VOLTAR AO TOPO',
        rights: 'Todos os direitos reservados.'
      },
      // Common
      common: {
        loading: 'Carregando...',
        error: 'Erro ao carregar conteúdo'
      }
    }
  },
  en: {
    translation: {
      // Navigation
      nav: {
        about: 'About',
        projects: 'Projects',
        events: 'Events',
        contact: 'Contact',
        contactMe: 'CONTACT ME'
      },
      // Hero Section
      hero: {
        greeting: 'Hi, I am',
        role: 'Senior Data & Cloud Engineer'
      },
      // About Section
      about: {
        title: 'ABOUT ME',
        explore: 'EXPLORE',
        readMore: 'READ MORE',
        trajectory: 'TRAJECTORY',
        experience: 'EXPERIENCE'
      },
      // Projects Section
      projects: {
        title: 'PROJECTS',
        subtitle: 'Some of the projects I participated in',
        viewCode: 'View Code',
        viewSite: 'View Site',
        all: 'ALL',
        featured: 'FEATURED'
      },
      // Events Section
      events: {
        title: 'EVENTS',
        subtitle: 'Events I coordinated or spoke at',
        viewPhotos: 'View Photos',
        viewMore: 'See more',
        coordinated: 'Coordinated',
        speaker: 'Speaker'
      },
      // Contact Section
      contact: {
        title: 'CONTACT',
        subtitle: 'Get in touch with me',
        explore: 'EXPLORE',
        name: 'Name',
        email: 'Email',
        message: 'Message',
        submit: 'SUBMIT',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'your@email.com',
        messagePlaceholder: 'Your message...'
      },
      // Footer
      footer: {
        backToTop: 'BACK TO TOP',
        rights: 'All rights reserved.'
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error loading content'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // Default language is Portuguese
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
