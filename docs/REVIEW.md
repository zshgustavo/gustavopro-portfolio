# Review do Projeto

Revisão técnica completa do portfólio: estrutura de pastas, script de tradução e arquivos de configuração.

**Data:** 2026-08-17
**Commit base:** `5f4e76a`
**Escopo:** todo o repositório, exceto `node_modules/` e histórico do git.

> **Status desta revisão.** Os achados abaixo descrevem o estado encontrado no
> commit base. A primeira rodada de saneamento já foi aplicada e cobriu os 4
> achados 🔴, os 7 🟠 e a maior parte dos 🟡 — o detalhe do que mudou está no
> [`CHANGELOG.md`](../CHANGELOG.md). A infra de Docker/Cloud Run descrita em
> [4.6](#46-dockerfile--nginxconf--dockerignore) e [2.7](#27-claude) foi **removida**
> — o deploy será redefinido. Continua **em aberto** apenas o item
> [7](#7-backlog-fora-de-escopo).

---

## Sumário

- [1. Mapa do projeto](#1-mapa-do-projeto)
- [2. Análise por pasta](#2-análise-por-pasta)
- [3. Script de tradução](#3-script-de-tradução)
- [4. Arquivos de configuração](#4-arquivos-de-configuração)
- [5. Documentação vs. realidade](#5-documentação-vs-realidade)
- [6. Índice de achados](#6-índice-de-achados)
- [7. Backlog fora de escopo](#7-backlog-fora-de-escopo)

**Legenda de severidade:**

| Tipo | Significado |
|---|---|
| 🔴 `bug` | Comportamento incorreto ou não-determinístico hoje |
| 🟠 `risco` | Funciona, mas falha em condição previsível (deploy, segredo, erro de rede) |
| 🟡 `dívida` | Correto, mas duplicado, morto ou difícil de manter |
| ⚪ `cosmético` | Inconsistência sem impacto funcional |

---

## 1. Mapa do projeto

```
/
├─ .claude/            skill + evals de deploy (órfãos — workflow apagado em abf3bae)
├─ docs/               este documento
├─ public/
│  ├─ images/          3 imagens, todas referenciadas
│  └─ posts/           CMS em markdown — about/, contact/, events/, projects/
├─ samples/            templates de frontmatter (documentação, não entra no build)
├─ scripts/
│  └─ translate.mjs    tradução PT→EN via Gemini, roda no prebuild
└─ src/
   ├─ components/      9 componentes .jsx, estrutura flat
   ├─ hooks/           useContent.js — 2 hooks + parser de markdown
   ├─ styles/          index.css — 1355 linhas, arquivo único
   ├─ App.jsx  main.jsx  i18n.js
```

### A fronteira build-time / runtime

Entender essa divisão é o que explica quase todos os achados deste documento:

| | Build-time (Node) | Runtime (browser) |
|---|---|---|
| **Quem roda** | `scripts/translate.mjs` via `prebuild` | `src/hooks/useContent.js` |
| **Parser YAML** | `gray-matter` (YAML real) | parser artesanal com regex |
| **Como lê o conteúdo** | `fs.readFile` | `fetch('/posts/...')` |
| **Escreve** | `<base>-en.md` | — |

Os dois lados leem os **mesmos arquivos** com **motores diferentes**. O lado do build tem que se rebaixar ao formato que o lado do runtime consegue ler — é por isso que existe um serializador manual em `translate.mjs:227-252` em vez de usar o `matter.stringify()` que o `gray-matter` já oferece. Essa assimetria é a dívida estrutural central do projeto.

---

## 2. Análise por pasta

### 2.1 `src/components/`

Nove componentes flat, entre 39 e 185 linhas. O tamanho é saudável e a divisão por seção é clara. Não há necessidade de subpastas nesta escala — a estrutura flat é adequada e não é um problema.

Dois padrões inconsistentes, porém:

- `ProjectCard` e `EventCard` moram dentro dos arquivos das seções (`Projects.jsx:109`, `Events.jsx:84`), enquanto `SocialIcons` e `BackToTop` são arquivos próprios. A regra implícita parece ser "componente reutilizado vira arquivo", o que é defensável — vale apenas registrar a convenção.

**🟡 Fonte da verdade duplicada para links sociais**
`SocialIcons.jsx:38-45` traz os links hardcoded em JS:

```js
linkedin: 'https://www.linkedin.com/in/gustavribeiro',
github: 'https://github.com/zshgustavo',
...
```

Enquanto `public/posts/contact/social.md` traz os **mesmos** links (mais `twitter`, `instagram` e `youtube`) num arquivo que **nenhum componente lê**. Duas fontes da verdade, uma delas morta e desatualizada.

**🟠 Conteúdo de exemplo pode chegar a produção**
`Projects.jsx:34-65` define 32 linhas de `defaultProjects` com títulos como `'Projeto Exemplo 1'` e descrições do tipo `'Descrição do primeiro projeto. Edite em /posts/projects/'`. Esse array é exibido sempre que `projects.length === 0` (`Projects.jsx:67`), ou seja, **se o `index.json` falhar em produção o visitante vê conteúdo placeholder** em vez de nada. `Events.jsx` não tem esse fallback — a inconsistência mostra que o array é resíduo de scaffolding, não uma decisão.

O mesmo vale para `About.jsx:31-40`, cujo `defaultAbout` contém texto de instrução para o próprio dono do site: *"Para editar este conteúdo, crie ou modifique o arquivo `/posts/about/main-pt.md`"*.

**🟡 Fetch duplicado em três componentes**
`About.jsx:23-26`, `Hero.jsx:21-22` e `Contact.jsx:24-25` chamam `useContent` **duas vezes** para simular fallback de idioma:

```js
const { content: aboutContent, isLoading } = useContent('about', `main-${lang}`)
const { content: fallbackContent } = useContent('about', 'main-pt')
const content = aboutContent || fallbackContent
```

Isso dispara dois requests sempre — e quando `lang === 'pt'`, **busca o mesmo arquivo duas vezes**. A solução já existe dentro do próprio `useContent.js`: `useContentList` (linhas 106-110) percorre uma lista de candidatos com um request por vez até acertar. O padrão bom está no arquivo, só não foi aplicado ao hook irmão.

**⚪ Renderização inconsistente do body**
`About.jsx:86` renderiza o corpo do markdown com `<ReactMarkdown>`. `Contact.jsx:79` renderiza `content?.body` como **texto puro** dentro de um `<p>`. Se alguém escrever `**negrito**` em `contact/main-pt.md`, os asteriscos aparecem literais na tela.

**⚪ Acessibilidade e detalhes menores**
- `Hero.jsx:57` posiciona os ícones sociais com `style` inline (`position: absolute`) em vez de classe CSS, quebrando o padrão do resto do projeto.
- `Navbar.jsx:83-94` — os botões PT/EN não têm `aria-pressed`, então leitores de tela não anunciam qual idioma está ativo.
- `Contact.jsx:47-65` usa `setTimeout(…, 100)` para dar "um tick" ao React antes de injetar o script do LinkedIn. Funciona, mas é frágil por natureza; sob `StrictMode` em dev o efeito roda duas vezes e o script é injetado, removido e reinjetado.

### 2.2 `src/hooks/`

Um único arquivo com três responsabilidades: `useContent`, `useContentList` e `parseMarkdown`. As duas primeiras são hooks; a terceira é lógica pura de parsing que não tem nada a ver com React e deveria viver em `src/lib/`.

**🔴 O parser artesanal tem limites silenciosos**
`parseMarkdown` (`useContent.js:159-229`) é um parser YAML feito à mão. A linha crítica é a 188:

```js
const keyValueMatch = line.match(/^(\w+):\s*(.*)$/)
```

Consequências concretas, todas falhando **em silêncio**:

1. `\w` não casa hífen ou ponto — uma chave `read-more:` ou `og.image:` é ignorada sem aviso.
2. A regex exige começo de linha, então qualquer YAML **aninhado** (linhas indentadas) é descartado. É exatamente por isso que `public/posts/contact/social.md` nunca funcionou.
3. Arrays passam por `JSON.parse('[EdTech, TreineSeuIngles]')` (linha 206), que **sempre lança** — não é JSON válido, faltam aspas. O `catch` da linha 207 salva com um `split(',')`. Funciona por acidente, não por desenho.
4. Não há escape. Se uma tradução do Gemini gerar um `title` com quebra de linha, o frontmatter quebra e o resto das chaves se perde.

**🟡 O `.gitattributes` é um sintoma**
O arquivo `.gitattributes` na raiz é bem-feito e documenta o próprio motivo: *"Force LF line endings on text files so the in-browser markdown parser keeps working on Windows checkouts (parser regex relies on \n)"*. Forçar LF é boa prática de qualquer forma — mas hoje ele existe como **contorno** de uma limitação do parser, não como higiene. (O parser, aliás, já tolera CRLF desde `useContent.js:164`; o `.gitattributes` é cinto e suspensório.)

**🟡 Sem cancelamento e sem cache**
Nenhum dos hooks usa `AbortController`. Alternar idioma rapidamente pode fazer a resposta antiga chegar depois da nova e sobrescrever o estado. Também não há cache: toda troca de idioma refaz todos os fetches, mesmo de conteúdo já carregado antes.

**⚪ Log enganoso**
`useContent.js:51` loga `Content file not found` dentro de um `catch` que captura **qualquer** erro — inclusive falha de rede ou de parsing. O 404 real é tratado antes, na linha 38, e nem passa por ali.

### 2.3 `src/styles/`

Arquivo único de 1355 linhas. O sistema de design é bom: `:root` (linhas 8-51) define 25+ tokens de cor, tipografia, espaçamento, transição e raio, e o resto do arquivo os usa com disciplina — quase não há valor mágico.

**🟡 ~60 linhas de CSS morto**
O formulário de contato foi removido no commit `d4fa63f` (*"replace contact form with linkedin profile badge"*), mas o CSS ficou:

| Linhas | Seletores |
|---|---|
| `1046-1051` | `.contact-form` |
| `1068-1119` | `.form-group`, `.form-group label`, `.form-group input/textarea`, `:focus`, `.submit-btn`, `.submit-btn:hover` |
| `1352-1354` | `.contact-form` dentro da media query de 480px |

⚠️ **Atenção ao remover:** o bloco **não é contíguo**. As linhas `1053-1066` (`.contact-linkedin` e `.contact-linkedin .badge-base`) estão **no meio** e são o CSS ativo do badge do LinkedIn — devem ser preservadas.

**🟡 Media queries espalhadas**
Existem quatro pontos de breakpoint em lugares distintos do arquivo: linha 204 (`768px`), 1278 (`1024px`), 1322 (`768px`) e 1343 (`480px`). Ajustar o responsivo de uma seção exige caçar em dois ou três lugares.

### 2.4 `public/posts/`

O desenho do CMS é bom: markdown com frontmatter, `index.json` controlando ordem, sufixo de idioma no nome do arquivo, e a convenção clara de que **só o `-pt.md` é fonte da verdade**. Escala bem para o volume atual (10 arquivos de conteúdo + 2 índices).

**🟡 `contact/social.md` é código morto**
Não é lido por nenhum componente e, mesmo que fosse, o parser não conseguiria interpretá-lo (YAML aninhado — ver 2.2). Além disso está desatualizado em relação a `SocialIcons.jsx`: lista `twitter`, `instagram` e `youtube` que não aparecem no site, e não lista `gravatar`, `gdg` nem `lastfm`, que aparecem.

**🟠 Conteúdo descreve uma UI que não existe mais**
`public/posts/contact/main-pt.md` (e o `-en.md` correspondente) ainda contém:

```yaml
formEndpoint: https://formspree.io/f/YOUR_FORM_ID
```

e o corpo diz *"Entre em contato comigo através do **formulário ao lado** ou pelas redes sociais"*. O formulário foi substituído pelo badge do LinkedIn em `d4fa63f`. **Esse texto está visível em produção hoje**, na seção de contato (`Contact.jsx:79`), instruindo o visitante a usar algo que não está na tela.

**⚪ Frontmatter não lido**
- `about/main-pt.md` declara `image: /images/about.png`, mas `About.jsx:52` hardcoda o caminho. A chave nunca é consultada.
- `about/hero-pt.md` tem corpo `"Personalize este arquivo com seu nome e cargo/funç"` — truncado no meio da palavra e nunca renderizado (o `Hero` só lê `name` e `role`).
- `projects/*.md` declaram `featured: true`, campo que `Projects.jsx:69-72` documenta explicitamente como reservado para uso futuro.

**⚪ Assimetria de índice**
`events/` e `projects/` têm `index.json`; `about/` e `contact/` não. É coerente (as duas primeiras são listas, as outras são singletons), mas vale documentar a regra.

### 2.5 `scripts/`

Ver [seção 3](#3-script-de-tradução) — é o componente com mais achados do projeto.

### 2.6 `samples/`

Três arquivos de template. O conteúdo é bom, mas **o mesmo fluxo está documentado em três lugares**: `README.md` (visão geral), `GUIA_CONTEUDO.md` (passo a passo completo) e `samples/README.md` (passo a passo de novo). Os três já divergem em detalhes — ver [seção 5](#5-documentação-vs-realidade).

### 2.7 `.claude/`

**🟡 Skill órfã**
`.claude/skills/deploy-to-cloud-run/` e `.claude/evals/deploy-to-cloud-run/` descrevem a criação de `.github/workflows/deploy-to-cloud-run.yml` — arquivo que **foi apagado** no commit `abf3bae` (*"[DELETE] deploy to cloud run workflow"*). Não existe pasta `.github/` no repositório.

Pior: o `SKILL.md` instrui a criar um Dockerfile baseado em `http-server`:

```dockerfile
FROM node:20-alpine
RUN npm install -g http-server
CMD ["http-server", "dist", "-p", "8080", "--gzip", "-c-1"]
```

enquanto o `Dockerfile` real do repositório usa **nginx**. Seguir a skill hoje produziria uma configuração diferente da que está em uso.

---

## 3. Script de tradução

`scripts/translate.mjs` — 272 linhas. O desenho geral é sólido: tradução em lote por arquivo (uma chamada de API por arquivo, não por campo), lista explícita de chaves traduzíveis, prompt bem construído com glossário de nomes próprios e `responseMimeType: 'application/json'` para forçar saída estruturada. Os problemas estão na infraestrutura em volta, não na lógica de tradução.

### 3.1 🔴 A detecção de mudança é não-determinística

```js
// translate.mjs:149-154
async function isStale(ptPath, enPath) {
  if (FORCE) return true
  if (!existsSync(enPath)) return true
  const [ptStat, enStat] = await Promise.all([stat(ptPath), stat(enPath)])
  return ptStat.mtimeMs > enStat.mtimeMs
}
```

`mtime` funciona na máquina de quem edita, mas **git não preserva mtime**. Em qualquer clone novo — CI, container, máquina nova — todos os arquivos recebem o timestamp do checkout, com diferenças na casa dos milissegundos e em ordem arbitrária. O resultado de `pt.mtimeMs > en.mtimeMs` vira sorteio: pode retraduzir os 10 arquivos (custo de API desnecessário) ou nenhum.

No `Dockerfile`, o `COPY . .` reproduz exatamente esse cenário a cada build.

### 3.2 🔴 `npm run build` quebra sem `GEMINI_API_KEY`

```js
// translate.mjs:103-106
if (!API_KEY && !DRY_RUN) {
  console.error(`✗ Missing GEMINI_API_KEY. Required to translate: ${rel}`)
  process.exit(1)
}
```

Combinado com o `prebuild` no `package.json`, isso significa que **o build de produção depende de um segredo e de conectividade com a API do Google** — mesmo quando todos os arquivos `-en.md` já estão commitados no repositório e perfeitamente utilizáveis.

Junto com o achado 3.1, o modo de falha é: clone novo → mtime marca arquivos como stale → sem chave → `exit 1` → build morre. E como o gatilho é o mtime, **falha de forma intermitente**, que é o pior tipo.

O `Dockerfile:6` passa `ARG GEMINI_API_KEY`; se o build não fornecer o argumento, a variável fica vazia e cai exatamente nesse caminho.

### 3.3 🟠 Chave de API na query string

```js
// translate.mjs:159-160
const url =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`
```

Query strings vazam em log de proxy, telemetria de rede e mensagens de erro. A API do Gemini aceita o header `x-goog-api-key`, que não tem esse problema.

Agrava: a linha 176 monta a mensagem de erro com `body.slice(0, 400)` da resposta, e respostas de erro do Google frequentemente ecoam a URL da requisição — ou seja, a chave pode acabar no stdout do build.

### 3.4 🟠 O segredo entra na camada do Docker

```dockerfile
# Dockerfile:6-7
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY
```

`ENV` grava o valor nos metadados da camada, recuperável via `docker history` ou a partir de qualquer cache de build do estágio. O estágio final é `FROM nginx:alpine`, então a **imagem publicada** não carrega o segredo — o risco fica no estágio de build e no cache do builder, não na imagem final. Ainda assim, o padrão correto seria um secret mount (`RUN --mount=type=secret`), ou — melhor ainda — não precisar de chave nenhuma no build (ver 3.2).

### 3.5 🟠 Sem retry, sem timeout, sem concorrência

O laço da linha 67 é sequencial e o `fetch` da linha 162 não tem `AbortSignal` nem retry. Um único 429 (rate limit) ou 503 transitório derruba o arquivo, incrementa `errors`, e o script termina em `exit(1)` na linha 133 — derrubando o build inteiro por um soluço de rede. Com 10 arquivos já é lento; com 30 fica frágil.

### 3.6 🟠 A resposta do modelo não é validada contra o pedido

```js
// translate.mjs:194-197
if (typeof parsed !== 'object' || parsed === null) {
  throw new Error('Gemini response is not a JSON object')
}
return parsed
```

Valida que é um objeto, e só. Depois, nas linhas 110-118, cada chave é copiada **apenas se veio**:

```js
if (typeof translated[flat] === 'string') { newData[key] = translated[flat] }
```

Se o modelo omitir `description`, o arquivo `-en.md` é escrito com a `description` **em português**, sem nenhum aviso. O prompt pede explicitamente as mesmas chaves (linha 214), mas nada verifica se foi obedecido.

### 3.7 🟡 Serializador manual sem escaping

`serializeMarkdown` / `serializeKv` / `formatScalar` (linhas 227-252) reimplementam à mão o que `matter.stringify()` já faz — e sem escaping. Um valor traduzido contendo `\n`, ou começando com `[` ou `{`, produz frontmatter corrompido.

Esse código só existe porque o parser do runtime não entende YAML de verdade (ver 2.2). Resolver o parser resolve isto de graça.

### 3.8 ⚪ Saída com linhas em branco extras

```js
lines.push('---', '')          // linha 232
...
lines.push('', trimmedBody, '') // linha 235
```

Produz `---\n\n\n<body>`. Visível em `public/posts/about/hero-en.md`, que tem duas linhas em branco após o frontmatter, contra uma no `-pt.md`. Ruído em diff, nada além disso.

### 3.9 ⚪ `loadDotenv` caseiro

Linhas 254-266. Não trata prefixo `export`, valores multi-linha nem `#` inline. Cobre o caso de uso atual (duas variáveis simples) e não vale substituir por dependência — vale apenas documentar a limitação.

### 3.10 🟡 Sem modo de verificação

Não há como perguntar *"as traduções estão em dia?"* sem chamar a API. O `--dry-run` chega perto, mas não sai com código de erro. Um flag `--check` que falhe quando houver `-pt.md` mais novo que seu par permitiria travar isso em CI ou pre-commit.

---

## 4. Arquivos de configuração

### 4.1 `package.json`

**🟡 `react-router-dom` não é usado**
Está em `dependencies` (v7.15.0 no lock). Busca no `src/` por `react-router`, `BrowserRouter`, `useNavigate` e `Route`: **zero ocorrências**. O site é uma página única com scroll suave (`Navbar.jsx:30-36` usa `scrollIntoView`), sem rotas.

Como nada a importa, o Vite faz tree-shaking e ela **não entra no bundle** — o custo não é peso de página, é manutenção: é uma dependência a auditar, atualizar e revisar em PR do Dependabot para sempre, sem contrapartida.

**🟡 `gray-matter` na categoria errada**
Está em `dependencies`, mas só é importada por `scripts/translate.mjs`, que roda em Node no build. Pertence a `devDependencies`.

**⚪ Metadados incoerentes**
- `"license": "ISC"` — o `LICENSE.md` do repositório é uma licença custom que **proíbe explicitamente cópia e redistribuição**. Declarar ISC no manifesto diz o oposto do arquivo de licença.
- `"author": ""` vazio.
- Sem `"private": true` — não há intenção de publicar no npm.
- Sem `engines.node`, apesar de o `Dockerfile` fixar `node:20-alpine`.

### 4.2 `vite.config.js`

O arquivo tem 15 linhas e **8 delas são configuração inerte**:

```js
assetsInclude: ['**/*.md'],        // nenhum .md é importado por JS
resolve: {
  alias: {
    '@': '/src',                   // 0 usos
    '@posts': '/posts',            // 0 usos, e caminho inválido
    '@images': '/public/images'    // 0 usos, e caminho inválido
  }
}
```

- `assetsInclude` só importa para arquivos importados por JS. Aqui todo markdown é lido em runtime via `fetch()` de `public/`, caminho que nunca passa pelo pipeline de assets do Vite.
- Os três aliases têm zero ocorrências em `src/`.
- `'@posts': '/posts'` e `'@images': '/public/images'` são caminhos **absolutos do sistema de arquivos**. Se alguém os usasse, no Windows resolveriam para `C:\posts` e `C:\public\images`. Configuração morta que, se despertasse, quebraria.

Sobra `plugins: [react()]`, que é a configuração correta e suficiente para este projeto.

### 4.3 `index.html`

**🟡 `lang` fixo**
`<html lang="pt-BR">` nunca muda. Ao alternar para inglês, o documento continua se declarando em português — leitores de tela usam pronúncia errada e buscadores indexam com o idioma errado.

**🟡 Sem Open Graph / Twitter Card**
Há `description`, `keywords` e `author`, mas **nenhuma** meta `og:` ou `twitter:`. Consequência prática: compartilhar `gustavosantospro.com` no LinkedIn, X ou WhatsApp não gera cartão com título, descrição e imagem — aparece só a URL crua. Para um portfólio, cujo canal principal de distribuição é justamente o compartilhamento em rede social, é a lacuna de SEO mais cara do projeto. (Vale notar a ironia: os projetos listados no site usam OG image do GitHub como thumbnail, enquanto o próprio site não tem uma.)

**⚪ Faltam também**
`robots.txt`, `sitemap.xml`, `theme-color` e `apple-touch-icon`. O `<title>` e a `description` são fixos em português, sem variante EN.

Positivo: `preconnect` para `fonts.googleapis.com`/`fonts.gstatic.com` está correto, e a fonte usa `&display=swap`.

### 4.4 `src/i18n.js`

**🟡 14 chaves órfãs**
Cruzando as chaves declaradas com os `t('...')` efetivamente usados em `src/`:

`nav.contact` · `about.explore` · `about.experience` · `projects.all` · `projects.featured` · `events.viewPhotos` · `contact.name` · `contact.email` · `contact.message` · `contact.submit` · `contact.namePlaceholder` · `contact.emailPlaceholder` · `contact.messagePlaceholder` · `common.error`

São 14 chaves × 2 idiomas = 28 linhas mortas. A maioria é resquício do formulário removido em `d4fa63f`; `projects.all`/`projects.featured` sobraram do filtro "Todos / Destaques" removido segundo o `CHANGELOG.md`.

**🟡 Idioma não persiste**
```js
lng: 'pt',            // linha 144
fallbackLng: 'en',
```

Não há `LanguageDetector`. Um visitante que troca para inglês e recarrega a página volta para português — e não há como enviar um link já em inglês.

**🟠 Código de idioma não é normalizado**
`i18n.language` é usado **diretamente** para montar nomes de arquivo: `` useContent('about', `main-${lang}`) ``. Hoje `lng` é fixo em `'pt'`, então funciona. No momento em que entrar detecção de navegador, `i18n.language` passa a ser `'pt-BR'` ou `'en-US'`, e o hook vai buscar `main-pt-BR.md` — 404 silencioso, caindo no fallback. A correção (`lang.split('-')[0]`) deve entrar **junto** com a persistência, não depois.

**⚪ Dois mecanismos de i18n**
Rótulos de UI vivem em objeto JS; conteúdo vive em markdown por idioma. A separação é razoável (rótulo é código, conteúdo é conteúdo), mas não está documentada em lugar nenhum.

### 4.5 `src/App.jsx`

**🔴 Meio segundo de atraso deliberado no primeiro paint**

```js
// App.jsx:17-25
const [isLoading, setIsLoading] = useState(true)
useEffect(() => {
  const timer = setTimeout(() => setIsLoading(false), 500)
  return () => clearTimeout(timer)
}, [])
```

Comentado como *"Simulate initial loading for smooth animations"*. Enquanto isso, o app renderiza só um spinner (linhas 32-38). Não há nada real sendo aguardado — é meio segundo somado ao LCP de todo visitante, de propósito.

**⚪ Import não usado**
`const { t, i18n } = useTranslation()` na linha 16 — `t` nunca é usado no componente.

### 4.6 `Dockerfile` / `nginx.conf` / `.dockerignore`

O `nginx.conf` é a peça mais bem-resolvida da infra: fallback de SPA correto, `no-cache` para HTML/JSON/MD (o conteúdo atualiza na hora) e `1y immutable` para os assets hasheados do Vite e para mídia. A estratégia de cache está certa.

Achados:
- **🟠** `ARG`/`ENV GEMINI_API_KEY` — ver 3.4.
- **⚪** `.dockerignore` não exclui `.claude/`, `samples/`, `docs/`, `CHANGELOG.md`, `GUIA_CONTEUDO.md`. Contexto de build maior que o necessário.
- **⚪** `nginx.conf` não habilita gzip nem envia headers de segurança (`X-Content-Type-Options`, `Referrer-Policy`).
- **🟡** Toda essa infra pode estar órfã — ver 2.7 e a nota de decisão abaixo.

> **⚠️ Verificação pendente:** o workflow de deploy foi apagado (`abf3bae`) mas `Dockerfile`, `nginx.conf` e a skill continuam no repositório. Antes de remover qualquer um deles, é preciso confirmar como `gustavosantospro.com` é publicado hoje. Se houver um Cloud Build trigger apontando para este repositório, **o `Dockerfile` é a receita de build em uso** e removê-lo derruba o deploy.

### 4.7 `.gitignore` e `.gitattributes`

`.gitignore` está adequado. `.gitattributes` é bem-feito e documenta o próprio motivo — ver a nota em 2.2 sobre ele ser hoje um contorno de parser.

**⚪ Falta `.env.example`**
Não existe. `GEMINI_API_KEY` e `GEMINI_MODEL` só são mencionados no cabeçalho de comentário de `translate.mjs:13-14`. Quem clonar o repositório não tem como saber o que configurar sem ler o código do script.

---

## 5. Documentação vs. realidade

| Documento | Afirma | Realidade |
|---|---|---|
| `README.md` | "Vite 7" | `vite@8.0.16` |
| `README.md` | "React Router — roteamento client-side" | Nenhum roteamento; SPA de scroll único |
| `README.md` | "Deploy: GitHub + integração CI/CD" | Sem `.github/`; workflow apagado em `abf3bae` |
| `SKILL.md` | Dockerfile com `http-server` | Dockerfile real usa nginx |
| `SKILL.md` | Cria `.github/workflows/deploy-to-cloud-run.yml` | Arquivo não existe |
| `GUIA_CONTEUDO.md` | `portfolio/events/<slug>/cover.jpg` (passo 3) | Outro trecho usa `gustavopro-portfolio/events/<slug>/` |
| `GUIA_CONTEUDO.md` | Estrutura mostra `about/main-en.md` mas omite `hero-en.md` | `hero-en.md` existe |
| `CHANGELOG.md` | "3 projetos reais" | 4 em `projects/index.json` |
| `contact/main-pt.md` | "através do formulário ao lado" | Formulário removido em `d4fa63f`; hoje é badge do LinkedIn |

O caso de `contact/main-pt.md` é o único desta tabela **visível ao visitante em produção** — os demais afetam apenas quem for mexer no código.

---

## 6. Índice de achados

| # | Arquivo | Achado | Tipo |
|---|---|---|---|
| 1 | `scripts/translate.mjs:149` | `isStale()` por `mtime` — não-determinístico em clone novo | 🔴 bug |
| 2 | `scripts/translate.mjs:103` | `npm run build` quebra sem `GEMINI_API_KEY` | 🔴 bug |
| 3 | `src/hooks/useContent.js:188` | Regex ignora chaves com hífen e todo YAML aninhado | 🔴 bug |
| 4 | `src/App.jsx:17-25` | 500ms de atraso deliberado no primeiro paint | 🔴 bug |
| 5 | `scripts/translate.mjs:160` | API key na query string | 🟠 risco |
| 6 | `Dockerfile:6-7` | Segredo gravado na camada do estágio de build | 🟠 risco |
| 7 | `scripts/translate.mjs:67,162` | Sem retry, timeout ou tratamento de 429 | 🟠 risco |
| 8 | `scripts/translate.mjs:194` | Resposta do modelo não validada contra as chaves pedidas | 🟠 risco |
| 9 | `src/components/Projects.jsx:34-65` | Conteúdo placeholder visível se `index.json` falhar | 🟠 risco |
| 10 | `public/posts/contact/main-*.md` | Texto em produção descreve formulário inexistente | 🟠 risco |
| 11 | `src/i18n.js` (uso de `i18n.language`) | Código de idioma não normalizado (`pt-BR` → 404) | 🟠 risco |
| 12 | `scripts/translate.mjs:227-252` | Serializador manual sem escaping | 🟡 dívida |
| 13 | `scripts/translate.mjs` | Sem modo `--check` para CI | 🟡 dívida |
| 14 | `package.json` | `react-router-dom` sem nenhum uso | 🟡 dívida |
| 15 | `package.json` | `gray-matter` em `dependencies` (é de build) | 🟡 dívida |
| 16 | `vite.config.js:8-14` | `assetsInclude` + 3 aliases mortos (2 com caminho inválido) | 🟡 dívida |
| 17 | `src/i18n.js` | 14 chaves órfãs × 2 idiomas | 🟡 dívida |
| 18 | `src/i18n.js:144` | Idioma não persiste entre recarregamentos | 🟡 dívida |
| 19 | `src/styles/index.css:1046-1051, 1068-1119, 1352-1354` | CSS do formulário removido (bloco não-contíguo) | 🟡 dívida |
| 20 | `public/posts/contact/social.md` | Arquivo morto e ilegível pelo parser | 🟡 dívida |
| 21 | `src/components/SocialIcons.jsx:38-45` | Links duplicados entre JS e markdown | 🟡 dívida |
| 22 | `About.jsx:23-26`, `Hero.jsx:21-22`, `Contact.jsx:24-25` | Fetch duplicado por fallback manual de idioma | 🟡 dívida |
| 23 | `src/hooks/useContent.js` | Sem `AbortController` — race na troca de idioma | 🟡 dívida |
| 24 | `src/components/About.jsx:31-40` | `defaultAbout` com texto de instrução interna | 🟡 dívida |
| 25 | `.claude/skills/deploy-to-cloud-run/` | Skill referencia workflow apagado e Dockerfile divergente | 🟡 dívida |
| 26 | `index.html` | Sem Open Graph / Twitter Card | 🟡 dívida |
| 27 | `index.html:2` | `lang="pt-BR"` fixo mesmo em inglês | 🟡 dívida |
| 28 | `src/styles/index.css` | 4 media queries espalhadas pelo arquivo | 🟡 dívida |
| 29 | `src/components/Contact.jsx:79` | `body` como texto puro; `About.jsx:86` usa ReactMarkdown | ⚪ cosmético |
| 30 | `package.json` | `license: ISC` contradiz `LICENSE.md` | ⚪ cosmético |
| 31 | `scripts/translate.mjs:232-235` | Linhas em branco extras na saída | ⚪ cosmético |
| 32 | `src/App.jsx:16` | `t` importado e não usado | ⚪ cosmético |
| 33 | Raiz | Sem `.env.example` | ⚪ cosmético |
| 34 | `README.md`, `GUIA_CONTEUDO.md`, `CHANGELOG.md`, `SKILL.md` | 9 divergências (ver seção 5) | ⚪ cosmético |

**Distribuição:** 4 🔴 · 7 🟠 · 18 🟡 · 6 ⚪

---

## 7. Backlog fora de escopo

Registrado deliberadamente para uma rodada futura:

- **TypeScript, ESLint/Prettier, Vitest** — não há tipagem, lint nem teste no projeto. Decisão consciente de escopo: a rodada atual é limpeza e robustez, sem trocar a stack.
- **Modularizar o CSS** — quebrar as 1355 linhas de `index.css` por seção e consolidar os 4 breakpoints.
- **SEO** — Open Graph, Twitter Card, `<html lang>` dinâmico, `robots.txt`, `sitemap.xml` (achados 26 e 27).
- **Pré-compilar o conteúdo** — gerar um JSON único em build a partir dos markdown, eliminando o parser do runtime e os N requests. É a solução estruturalmente mais limpa, mas muda a arquitetura de carregamento e merece rodada própria.
- **Cache no cliente** — memoizar conteúdo já carregado para que trocar idioma de ida e volta não refaça todos os fetches.
- **Endurecer o nginx** — gzip e headers de segurança, **caso** a verificação da seção 4.6 confirme que o Docker segue em uso.
