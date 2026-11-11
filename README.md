# Portefólio

Portefólio de Tomás Nogueira — programador full-stack e designer de UI/UX do Porto, fundador da [CarHelp](https://carhelp.pt).

O portefólio é um pequeno sistema operativo no browser — o **NogueiraOS**: ecrã de arranque e de bloqueio,
barra de menus, dock, ícones e widgets no ambiente de trabalho, e apps que abrem em janelas
(arrastar, redimensionar, minimizar, maximizar, encaixar nas metades do ecrã, fechar).
No telemóvel mostra um ecrã inicial com as apps e as janelas abrem em ecrã inteiro.

## Tecnologias

- **Vite + React 19**
- **Motion** (`motion/react`) — animações das janelas, do dock e dos ecrãs
- **Vercel Analytics + Speed Insights** — só são carregadas quando o site está na Vercel
- **EmailJS + reCAPTCHA invisível** — formulário da app Mail

## Estrutura

- `src/os/` — o "sistema": gestor de janelas (`system.jsx`), janela (`Window.jsx`), dock, barra de menus,
  Spotlight (Ctrl/⌘ K), notificações, ecrãs de arranque e de bloqueio
- `src/apps/` — uma app por ficheiro (Sobre mim, Projetos, CarHelp, Percurso, Competências, Terminal, Mail,
  Colaborar, Currículo, Definições, LEIA-ME)
- `src/os/meta.js` — tamanhos das janelas e ordem das apps no dock
- `public/` — imagens e o CV (`public/assets`, `public/carhelp`, `public/work`)

## Conteúdo e idiomas

Todo o conteúdo está em [`src/data.js`](src/data.js), em português (`pt`) e inglês (`en`);
os textos do próprio sistema (menus, janelas, terminal) estão em [`src/data.os.js`](src/data.os.js).

O site abre em português nos browsers em português e em inglês nos restantes; `?lang=pt` ou `?lang=en` força um idioma.
`?open=projects` (ou outra app) abre essa app logo ao entrar.
As fontes estão incluídas no projeto (Geist, Geist Mono e Instrument Serif, via Fontsource), por isso não há pedidos ao Google Fonts.

## Desenvolver

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # versão final em dist/
npm run preview   # serve a versão final localmente
```

## Publicar (GitHub Pages)

O site é compilado e publicado automaticamente a cada push para o `main`
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) e fica em <https://nogueira-12.github.io/Portfolio/>.

Configuração (uma vez só): no GitHub, **Settings → Pages → Build and deployment → Source: GitHub Actions**.
As GitHub Actions têm de estar ativas na conta.

## Publicar (Vercel, alternativa)

1. Abre <https://vercel.com/new> e importa o repositório `Nogueira-12/Portfolio`.
2. A Vercel deteta o Vite sozinha (as definições também estão no `vercel.json`). Carrega em **Deploy**.
3. No projeto, ativa **Analytics** e **Speed Insights** (separadores no painel).
4. Opcional: adiciona um domínio próprio em **Settings → Domains**.

Se o site mudar de domínio, adiciona o novo domínio na consola do reCAPTCHA (e nas origens permitidas do EmailJS,
se estiverem restritas); caso contrário, o formulário de contacto fica bloqueado.
