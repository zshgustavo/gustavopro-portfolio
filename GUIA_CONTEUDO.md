# Guia de Conteúdo

Como adicionar, editar e organizar conteúdo deste portfólio (eventos, projetos, sobre).

> **TL;DR** — Você só edita arquivos `*-pt.md`. Os `*-en.md` são gerados automaticamente pelo Google Gemini quando você roda `npm run translate`. Imagens ficam no Cloudinary (`portfolio/<tipo>/<slug>/`) e o site as consome via URL otimizada.

---

## Estrutura

```
public/posts/
├── about/
│   ├── hero-pt.md        # Nome e cargo (linha superior do Hero)
│   ├── main-pt.md        # Bio completa da seção "Sobre"
│   └── main-en.md        # Gerado automaticamente
├── events/
│   ├── index.json        # Ordem dos cards exibidos
│   ├── event-N-pt.md     # Fonte de cada evento
│   └── event-N-en.md     # Gerado automaticamente
└── projects/
    ├── index.json
    ├── project-N-pt.md
    └── project-N-en.md

samples/                  # Templates prontos para copiar
├── event-template.md
├── project-template.md
└── README.md
```

Tudo dentro de `public/posts/` é estático e servido pelo Vite no caminho `/posts/...`.

---

## Adicionar um novo evento

1. **Copie o template:**
   ```powershell
   Copy-Item samples\event-template.md public\posts\events\event-7-pt.md
   ```
   (Use o próximo `N` livre — se já existem `event-1` a `event-6`, o novo é `event-7`.)

2. **Preencha o frontmatter** em `event-7-pt.md`:
   ```yaml
   ---
   id: 7
   title: Nome do Evento
   description: Uma ou duas frases curtas descrevendo o evento.
   date: 2026-03                            # formato YYYY-MM
   location: Cidade, UF
   type: speaker                            # ou "coordinated"
   thumbnail: https://res.cloudinary.com/dawnv7igk/image/upload/w_800,q_auto,f_auto,c_fill,ar_4:3/portfolio/events/nome-do-evento/cover.jpg
   albumUrl: https://...                    # link do álbum externo (opcional)
   ---
   ```

3. **Suba o `cover.jpg`** no Cloudinary em `portfolio/events/<slug>/cover.jpg`.
   - Slug: kebab-case, sem acento, sem espaço. Ex.: `tdc-summit-ia-2025`.

4. **Adicione ao `index.json`** na posição desejada:
   ```json
   {
     "files": ["event-1", "event-2", "event-3", "event-4", "event-5", "event-6", "event-7"]
   }
   ```

5. **Traduza** rodando:
   ```powershell
   npm run translate
   ```
   Isso gera `event-7-en.md` via Gemini.

6. **Verifique** com `npm run dev` e cole o `albumUrl` quando o álbum estiver pronto.

---

## Adicionar um novo projeto

Mesmo fluxo dos eventos, com o template `samples/project-template.md`. Campos próprios:

```yaml
---
id: 4
title: Nome do Projeto
description: Resumo curto.
thumbnail: https://res.cloudinary.com/dawnv7igk/image/upload/w_800,q_auto,f_auto,c_fill,ar_4:3/portfolio/projects/nome-do-projeto/cover.png
codeUrl: https://github.com/zshgustavo/nome-do-repo
siteUrl: https://...                        # opcional
featured: true                              # campo livre (todos do index.json aparecem)
tags: [tag1, tag2, tag3]
---

Descrição longa em markdown (opcional, mas recomendado).

## Funcionalidades

- Item 1
- Item 2
```

Depois adiciona ao `public/posts/projects/index.json` e roda `npm run translate`.

---

## Editar a seção "Sobre"

- **Texto da bio:** `public/posts/about/main-pt.md` (body do markdown). Rode `npm run translate` para regenerar o EN.
- **Nome e cargo do Hero:** `public/posts/about/hero-pt.md`. Frontmatter `name` e `role`.
- **Imagem da bio:** substitua `public/images/about.png` localmente (ou troque para uma URL do Cloudinary se preferir).

---

## Convenções

| Campo | Formato | Exemplo |
|---|---|---|
| Slug | kebab-case, sem acento | `gdg-summit-lima-2025` |
| Data de evento | `YYYY-MM` | `2025-08` (renderiza "agosto de 2025") |
| `type` de evento | `speaker` ou `coordinated` | controla o badge do card |
| Tags de projeto | array inline | `[ia, cloud, python]` |
| URLs do Cloudinary | sempre com `q_auto,f_auto` | entrega WebP/AVIF automaticamente |

**Transformações recomendadas no Cloudinary:**

| Uso | String de transformação |
|---|---|
| Thumbnail de card | `w_800,q_auto,f_auto,c_fill,ar_4:3` |
| Foto grande de galeria | `w_1600,q_auto,f_auto` |
| Foto do About | `w_900,q_auto,f_auto` |

---

## Comandos úteis

```powershell
npm run dev              # servidor local em http://localhost:5173
npm run translate        # gera EN a partir dos PT mais novos (incremental)
npm run translate:force  # força regeneração de todos os EN
npm run build            # build de produção (roda translate antes via prebuild)
```

---

## Problemas comuns

**"Os cards aparecem com `Invalid Date` ou sem título"**
Provavelmente o arquivo foi salvo com line endings CRLF. Verifique em `Get-Content public\posts\events\event-N-pt.md | Format-Hex | Select -First 3` se há `0D 0A`. O `.gitattributes` na raiz força LF; rode `git add --renormalize .` se precisar limpar.

**"A versão EN ficou desatualizada após eu editar o PT"**
Rode `npm run translate`. Se o EN ainda parecer cacheado, `npm run translate:force`.

**"Mudei o arquivo mas o dev server não reflete"**
Hard refresh no navegador (Ctrl+Shift+R) ou reinicie `npm run dev`.

**"Adicionei um evento ao `index.json` mas ele não aparece"**
Confirme que o arquivo se chama exatamente `event-<N>-pt.md` (mesmo número que está no `index.json`).
