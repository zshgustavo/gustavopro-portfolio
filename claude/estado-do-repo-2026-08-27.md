# Estado do repositório — 2026-08-27

## Base

- Branch base: `main`
- Commit base: `a2774d2`
- Branch da rodada: `feat/seo-basico`
- Produção: <https://gustavosantospro.com/>

## Frente concluída nesta rodada

SEO básico da SPA, sem alterar React, Vite, o CMS em Markdown ou a estratégia de deploy:

- canonical da única rota pública;
- metadados Open Graph e Twitter Card;
- JSON-LD `Person` com dados já publicados no Hero;
- título, descrição e metadados sociais sincronizados com PT/EN;
- `robots.txt` e sitemap com somente a raiz, porque o site não usa router.

A foto quadrada já existente no Hero é usada com `twitter:card=summary`. Não foi criada uma arte social separada nesta rodada.

## Validação

- `npm run build`: aprovado; 216 módulos transformados.
- JSON-LD: parseado como JSON válido no HTML gerado.
- `robots.txt` e `sitemap.xml`: presentes no `dist/`.
- Bundle JS: 412.628 → 413.563 bytes (`+935 B`; gzip 129,71 → 130,05 kB).
- Bundle CSS: 9.941 bytes (sem alteração).

## Próxima frente recomendada

Implementar cache em memória no carregamento de Markdown para impedir novos requests ao alternar PT → EN → PT, preservando `AbortController`, fallback de idioma e a arquitetura atual.

Fora dessa próxima frente: pré-compilar Markdown, modularizar CSS, adicionar ferramentas de teste/lint ou redefinir deploy.
