# Portfólio — Gustavo Santos

Código-fonte do meu portfólio pessoal: uma single-page application com seções de bio, projetos, eventos e contato, bilíngue (PT/EN) e com gerenciamento de conteúdo via Markdown.

Versão em produção: [gustavosantospro.com - portfolio](https://gustavosantospro.com/)

## Stack

**Front-end**
- [React 19](https://react.dev) — biblioteca de UI
- [Vite 8](https://vitejs.dev) — build tool e dev server
- [i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com) — internacionalização (PT/EN)
- [react-markdown](https://github.com/remarkjs/react-markdown) — renderização do conteúdo dos posts
- CSS puro com variáveis customizadas — design "Terminal" (Space Grotesk + JetBrains Mono, seções alternando escuro/claro, bordas 1px)

Página única com navegação por scroll suave — sem roteador. O design system está documentado no Brand Guide criado com o [Claude Design](https://claude.ai).

**Conteúdo & infraestrutura**
- Markdown com frontmatter YAML como CMS leve (`public/posts/`)
- [js-yaml](https://github.com/nodeca/js-yaml) — parser de frontmatter, compartilhado entre o runtime e o script de tradução (`src/lib/frontmatter.js`)
- [gray-matter](https://github.com/jonschlinkert/gray-matter) — leitura/escrita dos posts no script de tradução, apontado para o mesmo schema YAML
- [Cloudinary](https://cloudinary.com) — hospedagem e otimização de imagens (entrega WebP/AVIF automática via CDN)

## IAs no fluxo de desenvolvimento

- **[Google Gemini](https://ai.google.dev)** (`gemini-3.1-flash-lite`) — tradução automática PT → EN (`scripts/translate.mjs`). Cada arquivo `*-pt.md` é traduzido em lote, preservando markdown, nomes próprios e termos técnicos. O que já foi traduzido é rastreado por hash em `scripts/translations.lock.json`, então só o conteúdo que mudou de fato é reenviado — e **o build não depende da chave de API**: sem ela, os `-en.md` commitados são usados como estão.
- **[Claude](https://www.anthropic.com/claude)** (Anthropic) — pair programming na arquitetura, refactors, parser, pipeline de i18n e geração de componentes.

## Documentação interna

- [`GUIA_CONTEUDO.md`](./GUIA_CONTEUDO.md) — como adicionar/editar eventos, projetos e a bio.
- [`docs/REVIEW.md`](./docs/REVIEW.md) — review técnico do projeto: achados, severidade e backlog.
- [`claude/estado-do-repo-2026-08-27.md`](./claude/estado-do-repo-2026-08-27.md) — estado mais recente, validações e próxima frente recomendada.
- [`samples/`](./samples) — templates de frontmatter prontos para copiar.

## Rodando localmente

```bash
npm install
npm run dev
```

Para gerar traduções, copie `.env.example` para `.env` e preencha `GEMINI_API_KEY`.

## Licença

Uso pessoal e educacional — código aberto para estudo e inspiração, **proibida cópia ou redistribuição**. Veja [`LICENSE.md`](./LICENSE.md) para os termos completos.

---

<div align="center">

© 2026 Gustavo Ribeiro dos Santos


[LinkedIn](https://linkedin.com/in/gustavribeiro) · [GitHub](https://github.com/zshgustavo)

</div>
