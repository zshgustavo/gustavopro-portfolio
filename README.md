# Portfólio — Gustavo Santos

Código-fonte do meu portfólio pessoal: uma single-page application com seções de bio, projetos, eventos e contato, bilíngue (PT/EN) e com gerenciamento de conteúdo via Markdown.

Versão em produção: [xxxx.dev](https://xxxxxxxxx.dev)

## Stack

**Front-end**
- [React 19](https://react.dev) — biblioteca de UI
- [Vite 7](https://vitejs.dev) — build tool e dev server
- [React Router](https://reactrouter.com) — roteamento client-side
- [i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com) — internacionalização (PT/EN)
- [react-markdown](https://github.com/remarkjs/react-markdown) — renderização do conteúdo dos posts
- [Lucide Icons](https://lucide.dev) — biblioteca de ícones
- CSS puro com variáveis customizadas

**Conteúdo & infraestrutura**
- Markdown com frontmatter YAML como CMS leve (`public/posts/`)
- [Cloudinary](https://cloudinary.com) — hospedagem e otimização de imagens (entrega WebP/AVIF automática via CDN)
- [gray-matter](https://github.com/jonschlinkert/gray-matter) — parser de frontmatter no script de tradução
- Deploy: GitHub + integração CI/CD

## IAs no fluxo de desenvolvimento

- **[Google Gemini](https://ai.google.dev)** (`gemini-3.1-flash-lite`) — tradução automática PT → EN em tempo de build (`scripts/translate.mjs`). Cada arquivo `*-pt.md` é traduzido em lote, preservando markdown, nomes próprios e termos técnicos.
- **[Claude](https://www.anthropic.com/claude)** (Anthropic) — pair programming na arquitetura, refactors, parser, pipeline de i18n e geração de componentes.

## Documentação interna

- [`GUIA_CONTEUDO.md`](./GUIA_CONTEUDO.md) — como adicionar/editar eventos, projetos e a bio.
- [`samples/`](./samples) — templates de frontmatter prontos para copiar.

## Licença

Uso pessoal e educacional — código aberto para estudo e inspiração, **proibida cópia ou redistribuição**. Veja [`LICENSE.md`](./LICENSE.md) para os termos completos.

---

<div style="text-align: center;">

© 2026 Gustavo Ribeiro dos Santos


[LinkedIn](https://linkedin.com/in/gustavribeiro) · [GitHub](https://github.com/zshgustavo)

---
