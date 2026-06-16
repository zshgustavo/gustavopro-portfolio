# 🚀 Gustavo Santos - Portfolio Pessoal

Portfolio pessoal moderno e responsivo desenvolvido com React, Vite e design Neo-Brutalista. Apresenta projetos, experiências e informações profissionais de forma elegante e impactante.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.2-646cff)

## ✨ Características

- 🎨 **Design Neo-Brutalista** - Interface moderna com alto contraste e elementos geométricos
- 📱 **Totalmente Responsivo** - Adaptado para todos os dispositivos
- ⚡ **Performance Otimizada** - Construído com Vite para carregamento rápido
- 📝 **Content Driven** - Gerenciamento de conteúdo via arquivos Markdown (`gray-matter`)
- 🌐 **Internacionalização** - Suporte a múltiplos idiomas com `i18next` e geração automática de conteúdo
- 🎭 **Animações Suaves** - Transições baseadas em CSS moderno
- 🎯 **SEO Friendly** - Estrutura semântica

## 🛠️ Stack de Tecnologias

### Frontend
- **React 19.2** - Biblioteca UI moderna
- **Vite 7.2** - Build tool e dev server
- **React Router** - Roteamento (para navegação flexível se necessário)
- **i18next** - Tradução e internacionalização
- **gray-matter** - Leitura e extração de metadados dos arquivos Markdown
- **Lucide React** - Ícones modernos e vetoriais

### Ferramentas e Scripts
- **Node.js Script (scripts/translate.mjs)** - Script para auto-tradução de PT para EN via Gemini API

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 22 ou superior recomendada)
- **npm** (gerenciador de pacotes)

## 🚀 Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/zshgustavo/gustavopro-portfolio.git
cd gustavopro-portfolio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração da API do Gemini (Opcional)
Crie um arquivo `.env` na raiz do projeto e configure a sua chave para traduções.

```env
GEMINI_API_KEY=sua-chave-aqui
```

### 4. Execute em modo desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### 5. Build para produção

```bash
npm run build
```

*(O script de build fará o prebuild que inclui a geração das traduções via Gemini se `GEMINI_API_KEY` estiver configurada).*

## 📁 Estrutura do Projeto

```
gustavopro-portfolio/
├── public/                 # Arquivos públicos e assets estáticos
│   ├── images/             # Imagens gerais, heróis e ícones
│   └── posts/              # Conteúdo em Markdown
│       ├── about/          # Textos da seção Sobre mim
│       ├── contact/        # Configuração e textos da seção de Contato
│       ├── events/         # Eventos, workshops e palestras
│       └── projects/       # Projetos do portfólio (ex: project-1.md)
├── scripts/                # Scripts de automatização
│   └── translate.mjs       # Script de tradução automática Gemini
├── src/                    # Código fonte React
│   ├── components/         # Componentes reutilizáveis (Hero, About, Projects, etc)
│   ├── data/               # Arquivos de dados padrão e configurações
│   ├── hooks/              # Custom hooks (como useContent)
│   ├── styles/             # Arquivos de estilização (index.css)
│   ├── App.jsx             # Root component
│   └── i18n.js             # Configuração do i18next
└── package.json            # Dependências e scripts npm
```

## 📝 Gerenciamento de Conteúdo

O conteúdo do portfolio é gerenciado através de arquivos Markdown localizados em `public/posts/`.

### Estrutura de um Post (Exemplo: Projeto)

```markdown
---
title: "Título do Projeto"
description: "Breve descrição do projeto"
thumbnail: "/images/projects/exemplo.png"
codeUrl: "https://github.com/exemplo"
siteUrl: "https://exemplo.com"
featured: true
tags: ["react", "javascript"]
---

Conteúdo longo opcional sobre o projeto.
```

### 🌐 Tradução automática (PT → EN)

A versão em inglês de cada arquivo Markdown é gerada por IA em tempo de build.
Você escreve **apenas** o arquivo `*-pt.md`; o script `scripts/translate.mjs`
chama a API do Google Gemini e cria/atualiza o `*-en.md` correspondente.

## 🤝 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Gustavo Santos**
- Senior Data Engineer | Senior Cloud Engineer
- 10 anos de experiência em SQL Avançado, Spark, Python, Arquitetura de Dados e Cloud
- Certificações: AWS, Google Cloud, Microsoft Azure
- GDG Organizer e Palestrante Internacional

### 🔗 Links

- GitHub: [@zshgustavo](https://github.com/zshgustavo)
- LinkedIn: [Gustavo Santos](https://linkedin.com/in/gustavozsh)
- Portfolio: [gustavopro-portfolio](https://github.com/zshgustavo/gustavopro-portfolio)

---

<div align="center">
  Feito com ❤️ por Gustavo Santos
</div>
