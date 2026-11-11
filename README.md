# Portfolio

Portfolio web — Tomás Nogueira. Full-stack developer & UI/UX designer from Porto, founder of [CarHelp](https://carhelp.pt).

## Stack

O portefólio é um pequeno sistema operativo no browser — **NogueiraOS**: ecrã de arranque e de bloqueio,
barra de menus, dock, ícones e widgets no ambiente de trabalho, e apps que abrem em janelas
(arrastar, redimensionar, minimizar, maximizar, encaixar nas metades do ecrã, fechar).
No telemóvel mostra um ecrã inicial com as apps e as janelas abrem em ecrã inteiro.

- **Vite + React 19**
- **Motion** (`motion/react`) — animações das janelas, dock e ecrãs
- **Vercel Analytics + Speed Insights**
- **EmailJS + invisible reCAPTCHA** — formulário da app Mail

Estrutura:

- `src/os/` — o "sistema": gestor de janelas (`system.jsx`), janela (`Window.jsx`), dock, barra de menus,
  Spotlight (Ctrl/⌘ K), notificações, ecrãs de arranque/bloqueio
- `src/apps/` — uma app por ficheiro (Sobre mim, Projetos, CarHelp, Percurso, Competências, Terminal, Mail,
  Colaborar, Currículo, Definições, LEIA-ME)
- `src/os/meta.js` — tamanhos das janelas e ordem do dock

`?open=projects` (ou outra app) abre essa app logo ao entrar.

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build locally
```

All the content lives in [`src/data.js`](src/data.js), in Portuguese (`pt`) and English (`en`);
the texts of the system itself (menus, windows, terminal) are in [`src/data.os.js`](src/data.os.js).
The site opens in Portuguese for Portuguese browsers and in English otherwise; `?lang=en` or `?lang=pt` forces a language.
Fonts are self-hosted (Geist, Geist Mono and Instrument Serif via Fontsource), so there are no requests to Google Fonts.
Images are in `public/` (`public/assets`, `public/carhelp`, `public/work`).

## Deploy (GitHub Pages)

O site é compilado e publicado automaticamente a cada push para o `main`
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) e fica em <https://nogueira-12.github.io/Portfolio/>.

Configuração (uma vez só): no GitHub, **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Deploy (Vercel, alternativa)

1. Go to <https://vercel.com/new> and import the GitHub repo `Nogueira-12/Portfolio`.
2. Vercel detects Vite automatically (settings are also in `vercel.json`). Click **Deploy**.
3. In the project, enable **Analytics** and **Speed Insights** (tabs in the dashboard).
4. Optional: add a custom domain under **Settings → Domains**.

After changing domain, add it to the reCAPTCHA admin console (and to EmailJS allowed origins, if restricted),
otherwise the contact form will be blocked.
