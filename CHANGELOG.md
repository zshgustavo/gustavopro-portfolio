# Changelog

Histórico de mudanças relevantes deste projeto.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota versionamento por data (`YYYY-MM-DD`).

## [Unreleased]

Mudanças aqui ficam pendentes até o próximo commit.

### Adicionado
- Metadados Open Graph, Twitter Card e JSON-LD `Person`, usando a bio, a função e a foto já existentes no Hero.
- URL canônica, `robots.txt` e `sitemap.xml` para a rota única do portfólio.

### Alterado
- Título, descrição e metadados sociais acompanham o idioma carregado (PT/EN), assim como o atributo `<html lang>` já acompanhava.

---

## [2026-08-18] — Links sociais viram conteúdo

### Alterado
- A lista de redes sociais (URL, rótulo e ordem) sai do array hardcoded em `src/components/SocialIcons.jsx` e vai para `socials` em **`public/posts/hero/main-<lang>.md`**. Remover um item o esconde; reordenar a lista reordena a tela.
- `SocialIcons` passa a receber a lista via prop. **Só a arte dos ícones fica no código** (`ICONS`): os paths SVG são strings enormes e imutáveis, que ninguém edita ao trocar um link.
- A seção **Contato reaproveita a mesma lista** do Hero, em vez de manter uma segunda cópia das mesmas seis URLs. São os links do site, não de uma seção.

### Adicionado
- Aviso no console quando um `id` de `socials` não tem ícone registrado, apontando onde adicionar o path. Antes de existir a lista em markdown esse erro era impossível; agora um typo no conteúdo derrubaria o link **em silêncio**, que é justamente a classe de falha apontada no review.

### Nota
- Os `label` não entram na tradução: são nomes próprios (LinkedIn, GitHub, Last.fm…), idênticos nos dois idiomas. `TRANSLATABLE_LIST_FIELDS` é indexado pela chave de topo, então `socials[].label` não é afetado pela regra de `stats[].label`.

---

## [2026-08-18] — Certificações vira seção de conteúdo

Última seção que ainda vivia em código. Com ela, **todas as 7 seções do site** são editáveis por markdown em `public/posts/`.

### Adicionado
- **`public/posts/certifications/`** — `title`, `subtitle` e uma lista `certs` de `{ code, name, img? }`, saindo do array hardcoded em `src/components/Certifications.jsx`.
- O campo **`img`** passa a ser conteúdo: colar a URL do badge oficial (Credly / Google Cloud) no markdown já exibe a imagem, sem tocar em `.jsx`. Sem URL, a célula mostra `[code]` em mono — placeholder proposital.

### Alterado
- `Certifications.jsx` lê de `/posts/certifications/main-<lang>.md`; `certs.title` e `certs.subtitle` no i18n viram apenas fallback.

### Nota
- Nenhuma mudança no `scripts/translate.mjs` foi necessária: os nomes dos provedores são nomes próprios e idênticos nos dois idiomas, então só `title` e `subtitle` entram no payload de tradução — ambos já cobertos por `TRANSLATABLE_KEYS`.

---

## [2026-08-18] — Stack vira seção de conteúdo

### Adicionado
- **`public/posts/stack/`** — as 4 categorias da stack (Dados, Orquestração, Cloud, Práticas) saem do `src/i18n.js` e viram conteúdo editável em `main-pt.md` / `main-en.md`, com `title` e uma lista `groups` de `{ cat, items }`.
- `groups: ['cat', 'items']` no `TRANSLATABLE_LIST_FIELDS` do `scripts/translate.mjs` — os 4 grupos são achatados como `frontmatter.groups.N.cat` / `.items` e traduzidos.
- Regra nova no prompt de tradução: preservar o separador `·` e seu espaçamento em listas inline, para o modelo não trocar por vírgula.

### Corrigido
- **`<html lang>` não acompanhava o idioma no carregamento inicial.** O listener de `languageChanged` era registrado *depois* do `i18n.init()`, então perdia o evento emitido pelo próprio init: o documento ficava no `pt-BR` estático do `index.html` até o visitante trocar de idioma à mão. Agora o valor também é aplicado uma vez para o idioma resolvido no init. Regressão introduzida no redesign (`a0975b3`) e que passou despercebida porque a verificação anterior rodou *depois* de uma troca manual.

### Alterado
- `Skills.jsx` lê de `/posts/stack/main-<lang>.md`; `skills.title` no i18n vira apenas fallback.

---

## [2026-08-18] — Hero vira uma seção de conteúdo

### Adicionado
- **`public/posts/hero/`** — o topo do site vira uma seção autocontida: `main-pt.md` / `main-en.md` com `name`, `role`, `description`, `photo` e `stats`, e a **foto (`profile.jpg`) na mesma pasta**. Editar o Hero deixa de exigir mexer em código.
- Suporte a **prose dentro de arrays** no `scripts/translate.mjs` (`TRANSLATABLE_LIST_FIELDS`): campos como `stats[].label` são achatados como `frontmatter.stats.0.label` e traduzidos. Sem isso, editar "anos" no PT regeneraria o EN com o texto em português — regressão silenciosa.

### Alterado
- `Hero.jsx` lê tudo de `/posts/hero/main-<lang>.md`, incluindo o caminho da foto (antes hardcoded em `/images/profile.jpg`) e as stats (antes em `i18n.js`).
- `hero.role` no i18n vira apenas fallback.

### Removido
- `public/posts/about/hero-pt.md` e `hero-en.md` — substituídos por `posts/hero/main-*.md`.
- `public/images/profile.jpg` — movido para `public/posts/hero/profile.jpg` (git preservou o histórico como rename).

---

## [2026-08-18] — Redesign completo: direção "Terminal"

Layout e design refeitos a partir da proposta criada no Claude Design (Brand Guide + telas), na direção "Terminal": estética de engenharia, cantos retos, bordas de 1px (sem raio e sem sombra), rótulos em monoespaçada e seções alternando fundo escuro e claro.

### Adicionado
- **Design system novo** em `src/styles/index.css`: paleta escura (`#0A0E12`/`#0E1319`/accent `#7DC6FF`) e clara (`#E9EDF2`/`#FFFFFF`/accent `#17669F`), tipografia **Space Grotesk** (display/texto) + **JetBrains Mono** (rótulos, nav, tags, datas), container 1240px.
- **Seção Stack** (`src/components/Skills.jsx`) — grade 2×2 de células "coladas" (gap 1px): Dados, Orquestração, Cloud, Práticas. Conteúdo em `i18n.js` (`skills.groups`).
- **Seção Certificações** (`src/components/Certifications.jsx`) — 6 células nomeadas (Google Cloud, Azure, AWS, OCI, IBM, Astronomer) com slot reservado para os badges oficiais; até lá, renderiza a sigla em mono.
- Stats do Hero (`10+ anos · 5 clouds · GDG organizer`) via `hero.stats` no i18n.
- `description` no frontmatter do hero (parágrafo sob o nome).
- `<html lang>` agora acompanha o idioma ativo (pt-BR / en).

### Alterado
- **Nav**: `~/gustavo-santos` como marca, links mono com prefixo `./`, contato em accent, PT | EN com `aria-pressed`; sticky com borda inferior; hamburger abaixo de 1080px.
- **Hero**: eyebrow `// cargo` em mono, nome empilhado a 80px, foto com moldura accent de 1px a -12px, tiles sociais quadrados.
- **Sobre**: rótulo `## sobre mim`, uma imagem + bio completa em markdown (o colágio de certificações saiu — substituído pela seção própria).
- **Projetos**: 2 colunas, thumbnail 2:1, tags em linha mono (`edtech · fluência · idiomas` — curadas na proposta), links de texto `ver código →` / `ver site →`. Descrições encurtadas conforme o design.
- **Eventos**: 3 colunas, thumbnail 16:10 com badge `palestrante`/`coordenado` sobreposto, data curta (`mai 2026`), link `ver fotos →`; ordem do `index.json` agora é cronológica reversa.
- **Contato**: rótulo `$ contato --iniciar`, título "Vamos construir algo com dados", corpo em markdown e tiles sociais. Ficou **escuro** (o mock o tinha claro após a seção de depoimentos, que não foi implementada — sem ela, dois fundos claros colariam; ver nota em `Contact.jsx`).
- **Footer**: linha única em mono. **BackToTop**: quadrado, canto inferior direito.
- Ícones sociais agora usam os **logos oficiais preenchidos** (SVG `currentColor`), em tiles de 1px de borda.

### Removido
- **Badge do LinkedIn** e a injeção do script `platform.linkedin.com` — o design substitui por contato via redes.
- **`lucide-react`** — nenhum componente restante usa a biblioteca (ícones agora são SVG próprios); build caiu de 1874 para 215 módulos.
- Fontes Poppins e Playfair Display.

### Não implementado (decisão)
- **Seção Depoimentos** do mock — continha apenas texto placeholder ("recomendação selecionada do seu LinkedIn aparece aqui"); entra quando houver recomendações reais selecionadas.

---

## [2026-08-17] — Review técnico e saneamento

### Adicionado
- **`docs/REVIEW.md`** — review técnico completo do projeto: análise por pasta, script de tradução e arquivos de configuração, com 34 achados classificados por severidade e um backlog do que ficou fora de escopo.
- **`src/lib/frontmatter.js`** — parser de frontmatter único, compartilhado entre o runtime e o script de tradução. Usa `js-yaml` com `CORE_SCHEMA` (mantém datas como string, que é o que `Events.formatDate` espera).
- **`scripts/translations.lock.json`** — manifesto com o hash SHA-256 de cada `*-pt.md`, versionado. Substitui a comparação de `mtime`.
- **`npm run translate:check`** — verifica se as traduções estão em dia sem chamar a API; sai com código 1 se algo estiver desatualizado.
- **`.env.example`** — documenta `GEMINI_API_KEY` e `GEMINI_MODEL`.
- Persistência do idioma escolhido em `localStorage`, com detecção do idioma do navegador na primeira visita.

### Corrigido
- **Tradução não-determinística**: a decisão de retraduzir usava `mtime`, que o git não preserva — em clone novo (CI, Docker) o resultado era aleatório. Agora é por hash de conteúdo, normalizado para LF.
- **`npm run build` quebrava sem `GEMINI_API_KEY`**: o script fazia `exit(1)`. Agora avisa quais arquivos estão desatualizados e mantém os `-en.md` commitados.
- **Chave de API na query string** trocada pelo header `x-goog-api-key`; mensagens de erro passam por redação para não ecoar o segredo.
- **Parser de frontmatter**: o parser artesanal ignorava silenciosamente chaves com hífen e todo YAML aninhado, e "parseava" arrays por acidente (um `JSON.parse` que sempre falhava e caía no `catch`).
- **500ms de atraso deliberado no primeiro paint** removidos do `App.jsx` (eram um spinner simulado, sem nada real sendo aguardado).
- Retry com backoff exponencial e timeout nas chamadas ao Gemini — antes um 429 transitório derrubava o build.
- A resposta do modelo passa a ser validada contra as chaves enviadas; antes, uma chave faltante fazia o texto em português ser gravado silenciosamente no arquivo em inglês.
- Texto da seção **Contato** ainda dizia "através do formulário ao lado", descrevendo o formulário removido em `d4fa63f` — estava visível em produção.
- Corpo do markdown da seção Contato passa a ser renderizado com `ReactMarkdown`, como já acontecia em Sobre.

### Alterado
- `useContent` passa a receber `(section, base, lang)` e resolver o fallback de idioma internamente, reusando o padrão de candidatos que `useContentList` já tinha. Sobre, Hero e Contato faziam **dois** fetches cada (e dois do mesmo arquivo quando o idioma era PT); agora fazem um.
- Ambos os hooks passaram a usar `AbortController`, evitando que uma resposta antiga sobrescreva a nova ao trocar de idioma rapidamente.
- O script de tradução usa `matter.stringify()` no lugar do serializador manual, que não fazia escaping — um valor traduzido com `:` ou quebra de linha corrompia o frontmatter.

### Removido
- `react-router-dom` das dependências — não havia nenhum uso no projeto (a navegação é por scroll suave).
- Aliases `@`, `@posts` e `@images` e `assetsInclude` do `vite.config.js` — todos sem uso, e dois deles apontando para caminhos absolutos inválidos.
- 14 chaves órfãs de i18n (× 2 idiomas), resquício do formulário de contato e do filtro "Todos / Destaques".
- ~60 linhas de CSS do formulário removido (`.contact-form`, `.form-group`, `.submit-btn`).
- `defaultProjects` e `defaultAbout` — conteúdo de exemplo ("Projeto Exemplo 1") que apareceria em produção caso o `index.json` falhasse.
- `public/posts/contact/social.md` — arquivo morto, não lido por nenhum componente e ilegível pelo parser (YAML aninhado).
- Import não usado de `SocialIcons` no `App.jsx`.

### Documentação
- `README.md`: corrigido "Vite 7" → Vite 8, removido React Router da stack (nunca foi usado), documentado o novo comportamento da tradução.
- `GUIA_CONTEUDO.md`: unificado o path do Cloudinary (`gustavopro-portfolio/…`), adicionada a seção "Como o script decide o que traduzir".
- `samples/README.md`: alinhado com o guia — projetos usam a OG image do GitHub, não upload no Cloudinary.
- `package.json`: `license` passou de `ISC` (que contradizia o `LICENSE.md`) para `UNLICENSED`, com `private: true`, `author` e `engines.node`.

---

## [2026-06-05] — Revamp das seções Sobre, Projetos e Eventos

### Adicionado
- Bio completa em PT/EN na seção **Sobre Mim**, com formatação consistente (negrito em stacks, provedores, certificações, empresas, comunidades).
- 6 eventos reais com data, local, descrição e álbum:
  Feira de Carreiras UCB 2º Edição, GDG Summit Lima 2025, TDC Summit IA,
  Google DevFest Cerrado (10 anos), Google I/O Extended, Campus Party CPBR16.
- 4 projetos reais: **FluentOps**, **DataWiki - Specification Generator**, **HoraGram** e o analisador de custos de cloud.
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
