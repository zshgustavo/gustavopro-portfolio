import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * UI labels live here; page CONTENT lives in `public/posts/` as markdown, one
 * file per language. Two mechanisms on purpose: labels are code, prose is not.
 *
 * Only keys actually rendered by a component belong in here — orphaned keys
 * survive refactors invisibly and rot.
 */
const resources = {
  pt: {
    translation: {
      nav: {
        about: 'Sobre',
        projects: 'Projetos',
        events: 'Eventos',
        contactMe: 'CONTATO'
      },
      hero: {
        greeting: 'Olá, eu sou',
        role: 'Engenheiro de Dados e Cloud Sênior'
      },
      about: {
        title: 'SOBRE MIM',
        readMore: 'LEIA MAIS'
      },
      projects: {
        title: 'PROJETOS',
        subtitle: 'Alguns dos projetos em que participei',
        viewCode: 'Ver Código',
        viewSite: 'Ver Site'
      },
      events: {
        title: 'EVENTOS',
        subtitle: 'Eventos que coordenei ou palestrei',
        viewMore: 'Ver mais',
        coordinated: 'Coordenado',
        speaker: 'Palestrante'
      },
      contact: {
        title: 'CONTATO',
        subtitle: 'Entre em contato comigo',
        explore: 'EXPLORE'
      },
      footer: {
        backToTop: 'VOLTAR AO TOPO',
        rights: 'Todos os direitos reservados.'
      },
      common: {
        loading: 'Carregando...'
      }
    }
  },
  en: {
    translation: {
      nav: {
        about: 'About',
        projects: 'Projects',
        events: 'Events',
        contactMe: 'CONTACT ME'
      },
      hero: {
        greeting: 'Hi, I am',
        role: 'Senior Data & Cloud Engineer'
      },
      about: {
        title: 'ABOUT ME',
        readMore: 'READ MORE'
      },
      projects: {
        title: 'PROJECTS',
        subtitle: 'Some of the projects I participated in',
        viewCode: 'View Code',
        viewSite: 'View Site'
      },
      events: {
        title: 'EVENTS',
        subtitle: 'Events I coordinated or spoke at',
        viewMore: 'See more',
        coordinated: 'Coordinated',
        speaker: 'Speaker'
      },
      contact: {
        title: 'CONTACT',
        subtitle: 'Get in touch with me',
        explore: 'EXPLORE'
      },
      footer: {
        backToTop: 'BACK TO TOP',
        rights: 'All rights reserved.'
      },
      common: {
        loading: 'Loading...'
      }
    }
  }
};

const STORAGE_KEY = 'portfolio.lang';
const SUPPORTED_LANGUAGES = ['pt', 'en'];
const DEFAULT_LANGUAGE = 'pt';

/**
 * Resolve the starting language: a previous explicit choice wins, then the
 * browser preference, then Portuguese.
 *
 * Kept dependency-free on purpose — i18next-browser-languagedetector would add
 * a package for ~10 lines. localStorage access is guarded because it throws in
 * private mode and when cookies are disabled.
 */
function detectInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;
  } catch {
    // Storage unavailable — fall through to browser preference.
  }

  const browserLang = window.navigator?.language?.split('-')[0]?.toLowerCase();
  return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : DEFAULT_LANGUAGE;
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    // Collapses regional codes (pt-BR → pt) so `i18n.language` stays usable as
    // a content-filename suffix.
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

// Remember the choice so a reload doesn't reset the visitor to Portuguese.
i18n.on('languageChanged', (lng) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // Storage unavailable — the language still applies for this session.
  }
});

export default i18n;
