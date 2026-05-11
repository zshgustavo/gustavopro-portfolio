# samples/

Templates de frontmatter para adicionar novos conteúdos sem precisar consultar a estrutura toda vez.

## Adicionar um novo evento

1. Copie `event-template.md` para `public/posts/events/event-N-pt.md` (use o próximo `N` livre).
2. Preencha `title`, `description`, `date` (formato `YYYY-MM`), `location`, `type` (`speaker` ou `coordinated`).
3. Substitua `<slug-do-evento>` no `thumbnail` por um slug em kebab-case sem acento (ex.: `gdg-summit-lima-2025`).
4. Suba o `cover.jpg` na pasta correspondente do Cloudinary (`portfolio/events/<slug-do-evento>/`).
5. Quando tiver o álbum pronto (Cloudinary, Google Photos, etc.), cole a URL em `albumUrl: `.
6. Adicione `"event-N"` ao array em `public/posts/events/index.json` na posição em que deve aparecer.
7. Rode `npm run translate` — o `event-N-en.md` é gerado automaticamente.

## Adicionar um novo projeto

1. Copie `project-template.md` para `public/posts/projects/project-N-pt.md`.
2. Preencha `title`, `description`, `tags`, `codeUrl` e `siteUrl` (este último opcional — pode ficar vazio).
3. Substitua `<slug-do-projeto>` no `thumbnail` por um slug em kebab-case (ex.: `cloud-cost-agent`).
4. Suba o `cover.png` em `portfolio/projects/<slug-do-projeto>/` no Cloudinary.
5. `featured: true` marca o projeto para destaque (campo reservado para uso futuro — todos os projetos do `index.json` são exibidos).
6. Adicione `"project-N"` ao array em `public/posts/projects/index.json`.
7. `npm run translate` gera o `project-N-en.md`.

## Convenções

- **Slugs**: kebab-case, sem acentos, sem espaços. Ex.: `feira-carreiras-ucb-2026`.
- **Datas**: `YYYY-MM` (mês/ano — o componente renderiza apenas mês e ano).
- **URLs do Cloudinary**: sempre passe pelas transformações `w_<largura>,q_auto,f_auto` para entrega otimizada (WebP/AVIF automático).
- **Apenas o `*-pt.md` é fonte da verdade.** O `*-en.md` é gerado pelo script de tradução (`npm run translate`).
