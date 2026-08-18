import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * UI labels live here; page CONTENT lives in `public/posts/` as markdown, one
 * file per language. Two mechanisms on purpose: labels are code, prose is not.
 *
 * The "Terminal" design renders section labels lowercase with a mono `##`
 * prefix — the prefix lives in the JSX, lowercase comes from CSS, so the
 * values here stay natural-cased where it matters.
 *
 * `hero.stats` and `skills.groups` are structured arrays consumed with
 * `t(key, { returnObjects: true })`.
 */
const resources = {
  pt: {
    translation: {
      nav: {
        about: 'sobre',
        stack: 'stack',
        projects: 'projetos',
        certifications: 'certificações',
        events: 'eventos',
        contact: 'contato'
      },
      // Fallback only — name, role, description, stats and photo live in
      // /posts/hero/main-<lang>.md.
      hero: {
        role: 'Engenheiro de Dados & Cloud Sênior'
      },
      about: {
        title: 'sobre mim'
      },
      skills: {
        title: 'stack',
        groups: [
          { cat: 'Dados', items: 'SQL Avançado · Spark · DBT · BigQuery · Databricks' },
          { cat: 'Orquestração', items: 'Apache Airflow · Astronomer · Data Factory' },
          { cat: 'Cloud', items: 'Google Cloud · Azure · AWS · OCI · IBM Cloud' },
          { cat: 'Práticas', items: 'DataOps · SRE · Data Mesh · Lakehouse · ML/AI' }
        ]
      },
      projects: {
        title: 'projetos',
        subtitle: 'Alguns dos projetos em que participei',
        viewCode: 'ver código',
        viewSite: 'ver site'
      },
      certs: {
        title: 'certificações',
        subtitle: 'Especialista multi-cloud certificado'
      },
      events: {
        title: 'eventos',
        subtitle: 'Eventos que coordenei ou palestrei',
        viewPhotos: 'ver fotos',
        coordinated: 'coordenado',
        speaker: 'palestrante'
      },
      contact: {
        command: '$ contato --iniciar',
        title: 'Vamos construir algo com dados'
      },
      footer: {
        rights: 'todos os direitos reservados',
        backToTop: 'voltar ao topo'
      },
      common: {
        loading: 'carregando…'
      }
    }
  },
  en: {
    translation: {
      nav: {
        about: 'about',
        stack: 'stack',
        projects: 'projects',
        certifications: 'certifications',
        events: 'events',
        contact: 'contact'
      },
      // Fallback only — name, role, description, stats and photo live in
      // /posts/hero/main-<lang>.md.
      hero: {
        role: 'Senior Data & Cloud Engineer'
      },
      about: {
        title: 'about me'
      },
      skills: {
        title: 'stack',
        groups: [
          { cat: 'Data', items: 'Advanced SQL · Spark · DBT · BigQuery · Databricks' },
          { cat: 'Orchestration', items: 'Apache Airflow · Astronomer · Data Factory' },
          { cat: 'Cloud', items: 'Google Cloud · Azure · AWS · OCI · IBM Cloud' },
          { cat: 'Practices', items: 'DataOps · SRE · Data Mesh · Lakehouse · ML/AI' }
        ]
      },
      projects: {
        title: 'projects',
        subtitle: 'Some of the projects I participated in',
        viewCode: 'view code',
        viewSite: 'view site'
      },
      certs: {
        title: 'certifications',
        subtitle: 'Certified multi-cloud specialist'
      },
      events: {
        title: 'events',
        subtitle: 'Events I coordinated or spoke at',
        viewPhotos: 'view photos',
        coordinated: 'coordinated',
        speaker: 'speaker'
      },
      contact: {
        command: '$ contact --start',
        title: "Let's build something with data"
      },
      footer: {
        rights: 'all rights reserved',
        backToTop: 'back to top'
      },
      common: {
        loading: 'loading…'
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

// Remember the choice so a reload doesn't reset the visitor to Portuguese,
// and keep <html lang> in sync for screen readers and search engines.
i18n.on('languageChanged', (lng) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // Storage unavailable — the language still applies for this session.
  }
  document.documentElement.lang = lng === 'pt' ? 'pt-BR' : 'en';
});

export default i18n;
