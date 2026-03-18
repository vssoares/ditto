# Ditto

> *Do inglês informal: "de novo, o mesmo" — repetição que vira fluência.*

Aprenda inglês com frases geradas por inteligência artificial e fixadas pelo método de **repetição espaçada** (algoritmo SM-2). Quanto mais você usa, mais inteligente o app fica — priorizando automaticamente as frases que você ainda não domina.

---

## Funcionalidades

- **Geração com IA** — frases reais e naturais geradas pela OpenAI (GPT-4o-mini), com tradução em PT-BR e dicas de gramática
- **Repetição espaçada (SM-2)** — algoritmo que agenda revisões no momento certo, evitando esquecimento
- **Flashcards interativos** — vire o card para ver a tradução, avalie seu desempenho com 4 níveis
- **Biblioteca** — todas as suas frases salvas, com filtros por status de revisão
- **Tópicos e níveis** — escolha entre 8 tópicos (cotidiano, trabalho, viagem...) e 3 níveis (A1 a C2)
- **Atalhos de teclado** — `Espaço` para virar, `1-4` para avaliar
- **100% local** — sua API Key e frases ficam apenas no seu computador

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Desktop | [Electron](https://www.electronjs.org/) |

| Interface | [React 18](https://react.dev/) + [Tailwind CSS 3](https://tailwindcss.com/) |
| Build | [Vite](https://vitejs.dev/) |
| IA | [OpenAI API](https://platform.openai.com/) (GPT-4o-mini) |
| Repetição espaçada | SM-2 (implementação própria) |
| Persistência | `localStorage` via camada de abstração |

---

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Uma [OpenAI API Key](https://platform.openai.com/api-keys)

### Instalação

```bash
# Clone ou baixe o projeto
cd "GERADOR INGLES"

# Instale as dependências
npm install

# Inicie em modo de desenvolvimento
npm run dev
```

O app Electron abrirá automaticamente após o servidor Vite subir.

### Configuração da API Key

Na primeira vez que abrir, o app solicitará sua OpenAI API Key. Você também pode acessá-la a qualquer momento pelo ícone **⚙** na barra lateral.

A chave é salva **apenas localmente** no seu computador (via `localStorage`).

---

## Como usar

1. **Gerar frases** — escolha um tópico, nível e quantidade, clique em *Gerar Frases*
2. **Estudar** — os flashcards aparecem um por um
   - Clique no card (ou pressione `Espaço`) para ver a tradução
   - Avalie seu desempenho: `1` De novo · `2` Difícil · `3` Ok · `4` Fácil
3. **Revisar** — acesse a **Biblioteca** para ver todas as frases salvas e revisar as que estão vencidas

---

## Estrutura do projeto

```
repeto/
├── electron/
│   ├── main.js          # Processo principal — janela + IPC + integração OpenAI
│   └── preload.js       # Bridge segura entre Electron e React
├── src/
│   ├── components/
│   │   ├── ui/          # Componentes genéricos reutilizáveis (Button, Card, Modal...)
│   │   ├── GeneratorScreen.jsx
│   │   ├── StudyScreen.jsx
│   │   ├── LibraryScreen.jsx
│   │   ├── SettingsModal.jsx
│   │   └── TitleBar.jsx
│   ├── utils/
│   │   ├── spaceRepetition.js  # Algoritmo SM-2
│   │   ├── storage.js          # Abstração do localStorage
│   │   └── types.js            # Typedefs JSDoc compartilhados
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## Componentes UI genéricos

Todos em `src/components/ui/` — importáveis via barrel export:

```js
import { Button, Card, Modal, Badge, Label, ... } from './ui'
```

| Componente | Uso |
|---|---|
| `Button` | Variantes: `primary`, `secondary`, `ghost`, `danger` |
| `Label` | Label de seção estilo monospace |
| `Badge` | Keywords, ratings coloridos, status |
| `Card` | Container superfície com variantes de borda |
| `SelectOption` | Botão de seleção exclusiva (tópico, nível, quantidade) |
| `Modal` | Overlay + painel central (fecha com Esc) |
| `TextInput` | Input com label, hint, erro e toggle show/hide |
| `FilterPill` | Grupo de filtros em pílula |
| `StatCard` | Card de métrica com valor em destaque |
| `EmptyState` | Estado vazio para listas |
| `Spinner` | Indicador de carregamento circular |
| `ProgressBar` | Barra de progresso horizontal |
| `ErrorBanner` | Banner de erro/alerta inline |

---

## Build para distribuição

```bash
npm run build
```

O instalador será gerado em `dist-electron/`.

---

## Licença

MIT
