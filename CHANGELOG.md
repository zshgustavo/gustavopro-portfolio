# Changelog

Histórico de mudanças relevantes deste projeto.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota versionamento por data (`YYYY-MM-DD`).

## [Unreleased]

Mudanças aqui ficam pendentes até o próximo commit.

---

## [2026-06-05] — Revamp das seções Sobre, Projetos e Eventos

### Adicionado
- Bio completa em PT/EN na seção **Sobre Mim**, com formatação consistente (negrito em stacks, provedores, certificações, empresas, comunidades).
- 6 eventos reais com data, local, descrição e álbum:
  Feira de Carreiras UCB 2º Edição, GDG Summit Lima 2025, TDC Summit IA,
  Google DevFest Cerrado (10 anos), Google I/O Extended, Campus Party CPBR16.
- 3 projetos reais: **FluentOps**, **DataWiki - Specification Generator**, **HoraGram**.
- Botão **"Ver mais"** nos cards de evento, apontando para álbum externo (Cloudinary Collection ou Google Photos) via novo campo `albumUrl` no frontmatter.
- Tradução `events.viewMore` (PT: "Ver mais" / EN: "See more").
- **`GUIA_CONTEUDO.md`** — guia interno passo-a-passo para adicionar/editar eventos, projetos e bio.
- **`samples/`** com templates de frontmatter para evento, projeto, e um README de uso.
- **`LICENSE.md`** — licença custom de uso pessoal e educacional (proibida cópia/redistribuição), bilíngue PT/EN.
- **`README.md`** reescrito em versão concisa apresentando stack e IAs utilizadas (Gemini para tradução, Claude para desenvolvimento).
- **`.gitattributes`** forçando line endings LF em todos os arquivos de texto.

### Alterado
- Cards de **Projetos**:
  - Removido filtro "Todos / Destaques"; agora exibe todos os projetos do `index.json`.
  - Título do card virou link para o site/repo do projeto.
  - Background dos cards alterado para `#11142a` com borda translúcida e hover com elevação + sombra.
  - Tags redesenhadas em chips brancos com transparência (antes eram azul-escuro sobre preto, ilegíveis).
  - Botões "Ver Código" / "Ver Site" com texto branco sobre fundo claro, hover invertendo para branco sólido.
  - Thumbnails servidas via Cloudinary com transformação uniforme `w_1280,h_640,c_fill,q_auto,f_auto`.
- Cards de **Eventos**:
  - Data formatada como **mês/ano** (ex.: "agosto de 2025") em vez de "1 de agosto de 2025".
  - Galeria de fotos local substituída pelo botão "Ver mais" externo.
  - Slugs e folder paths no Cloudinary alinhados ao nome do projeto (`gustavopro-portfolio/`).
- Cobertura de tradução: i18n keys de eventos agora incluem `viewMore`.
- Parser de markdown (`useContent.js`) agora ignora **BOM** e aceita line endings **CRLF**.
- Todos os arquivos em `public/posts/**/*.md` normalizados para LF.

### Corrigido
- **Bug de timezone** que shiftava as datas de eventos um mês para trás em fusos negativos (ex.: `new Date('2025-08')` virava 31/julho em UTC-3). Substituído pela construção em horário local com `new Date(year, monthIndex, 1)`.
- Parser não enxergava o frontmatter quando o arquivo estava em CRLF — frontmatter inteiro vazava como texto do body. Agora a regex aceita `\r?\n`.
- Truncamentos intermitentes de arquivos no disco (linter/save) resolvidos via reescrita por bash heredoc quando necessário.

### Removido
- Modal de galeria local de eventos (com carrossel de fotos hospedadas em `/images/events/`).
- Filtro "Todos / Destaques" da seção Projetos.
- 3 projetos placeholder herdados do template (`Projeto Exemplo 1/2/3`).
- Subtítulo "EXPLORE" da seção **Sobre Mim** (era hardcoded em `About.jsx`).

---

## [2026-05-10] — Versão inicial pública

### Adicionado
- Pipeline de **tradução automática PT → EN** via Google Gemini (`scripts/translate.mjs`).
- `.env.example` documentando `GEMINI_API_KEY` e `GEMINI_MODEL`.
- Scripts npm: `translate`, `translate:force`, `prebuild` (encadeado ao `build`).
- Convenção de fonte única: edita-se apenas `*-pt.md`; `*-en.md` é gerado pelo script.
- Hooks `useContent` e `useContentList` agora aceitam parâmetro de idioma com fallback PT → sem sufixo.
- Configuração inicial do repositório no GitHub (`zshgustavo/gustavopro-portfolio`).

### Alterado
- Estrutura de arquivos de conteúdo:
  - `event-N.md` → `event-N-pt.md`
  - `project-N.md` → `project-N-pt.md`
  - `hero.md` → `hero-pt.md`
- `useContentList` passa a fazer fetch de `<base>-<lang>.md` com fallbacks.
- Componentes `Hero`, `Events` e `Projects` passam `i18n.language` no carregamento.
- **Username GitHub** atualizado: `gustavozsh` → `zshgustavo` (refletido no README, SocialIcons, e nas URLs dos projetos).

[Unreleased]: https://github.com/zshgustavo/gustavopro-portfolio/compare/main...HEAD
