import { OS_TEXT } from './data.os.js';

// Everything the site says lives here, in English (en) and European Portuguese (pt).
// Shared data (links, images) is defined once, above the texts.
// Rule: no visible text is written directly in the components, so both versions stay complete.

export const PROFILE = {
  name: 'Tomás Nogueira',
  email: 'tomassn2008@gmail.com',
  whatsapp: '+351 934 474 997',
  whatsappLink: 'https://wa.me/351934474997',
  cv: 'assets/Tomas_Nogueira_CV.pdf',
  photo: 'assets/profile_picture.jpg',
};

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Nogueira-12' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tomás-nogueira-33b347402/' },
  { label: 'Instagram', href: 'https://www.instagram.com/nogueira.__.12/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Nogueira_12' },
];

export const SECTIONS = ['carhelp', 'work', 'about', 'experience', 'collaborate', 'contact'];

export const CARHELP = {
  url: 'https://carhelp.pt',
  icon: 'carhelp/app-icon.png',
  steps: ['analise', 'garagem', 'inicio'],
};

/* app screenshots exist in Portuguese (/carhelp) and English (/carhelp/en), like on carhelp.pt */
export const appMedia = (lang, file) => `carhelp/${lang === 'en' ? 'en/' : ''}${file}`;

const PROJECTS_BASE = (lang) => [
  { id: 'carhelp-app', title: 'CarHelp', year: '2026', status: 'soon', cover: { type: 'phone', img: appMedia(lang, 'phone-analise.webp'), tone: 'blue' }, links: ['https://carhelp.pt'] },
  { id: 'carhelp-web', title: 'CarHelp', year: '2026', status: 'live', cover: { type: 'shot', img: lang === 'en' ? 'work/carhelp-web-en.jpg' : 'work/carhelp-web.jpg', tone: 'violet' }, links: [lang === 'en' ? 'https://carhelp.pt/en/' : 'https://carhelp.pt'] },
  { id: 'scuola-edile', title: 'Scuola Edile', year: '2026', status: 'live', cover: { type: 'shot', img: 'work/scuola-edile.jpg', tone: 'warm' }, links: ['https://formedilarezzo.it'] },
  { id: 'sportx', title: 'SportX', year: '2026', status: 'done', video: 'CwC7mgQaUEw', cover: { type: 'banner', tone: 'orange' }, links: ['https://youtu.be/CwC7mgQaUEw'] },
];

const EXPERIENCE_BASE = [
  { company: 'CarHelp', logo: 'carhelp/app-icon.png', current: true },
  { company: 'iS — Intelligent Solutions', logo: 'assets/is-logo.svg', current: true },
  { company: 'Semanto — Agenzia di Comunicazione', logo: 'assets/LOGO-SEMANTO-white-sx.png', current: true },
  { company: 'Gigatel — Serviços e Equipamentos', logo: 'assets/gigatel-logo.png', current: false },
];

export const STATS = [
  { value: 3, suffix: '+' },
  { value: 20, suffix: '/20' },
  { value: 18, suffix: '/20' },
  { value: 2, suffix: '' },
];

const STACK_BASE = [
  ['C++', 'PHP', 'JavaScript', 'HTML5', 'CSS3', 'MySQL', 'PostgreSQL'],
  ['Dart', 'Flutter', 'VS Code', 'WSL'],
  ['Ruby on Rails', 'Git', 'GitHub', 'WordPress'],
];

const COLLAB_BASE = [
  { key: 'product', icon: 'spark' },
  { key: 'design', icon: 'layers' },
  { key: 'apps', icon: 'phone' },
  { key: 'open', icon: 'code' },
];

export const CLIENTS = [
  // `raw: true` keeps the logo's own shapes (it has filled boxes that turn into a white block when inverted)
  { name: 'Formedil — Scuola Edile Arezzo', logo: 'assets/formedil-logo.png', href: 'https://formedilarezzo.it', raw: true },
  { name: 'Gigatel', logo: 'assets/gigatel-logo.png', href: 'https://gigatel.com/' },
  { name: 'iS — Intelligent Solutions', logo: 'assets/is-logo.svg', href: 'https://www.is-intelligentsolutions.com/' },
  { name: 'Semanto', logo: 'assets/LOGO-SEMANTO-white-sx.png', href: 'https://semanto.it/' },
  { name: 'Agrupamento de Escolas da Maia', logo: 'assets/LogoAEMAIA.png', href: 'https://www.aemaia.pt/index.php/agrupamento/escolas/escola-secundaria-da-maia' },
];

// EmailJS + invisible reCAPTCHA v2 (same keys as the previous site).
// If the site moves to a new domain, add it to the reCAPTCHA admin console
// (and to EmailJS' allowed origins, if restricted).
export const CONTACT_KEYS = {
  publicKey: '7liaQ6dkpbd-A4teC',
  serviceId: 'service_dgogagc',
  templateToOwner: 'template_bgankpl',
  templateAutoreply: 'template_de35efc',
  recaptchaSiteKey: '6Ldbzw4tAAAAAOkanBDv4hYDgoss3GnqdxdnJbO5',
};

/* ───────────────────────────── English ───────────────────────────── */
const en = {
  meta: {
    title: 'Tomás Nogueira — Full-Stack Developer & Founder of CarHelp',
    description: 'Tomás Nogueira — full-stack developer and UI/UX designer from Porto, Portugal. Founder of CarHelp, the app that tells you if a car repair quote is fair.',
  },
  loader: { words: ['Hello', 'Welcome', 'Hi there', 'Hello'], foot: 'Tomás Nogueira — Portfolio ©2026' },
  cursor: { top: 'Top', scroll: 'Scroll', open: 'Open', copy: 'Copy', visit: 'Visit' },
  nav: {
    role: 'Full-Stack Developer',
    home: 'Home', carhelp: 'CarHelp', work: 'Work', about: 'About', experience: 'Experience', collaborate: 'Collaborate', contact: 'Contact',
    talk: 'Let’s talk', menu: 'Menu', close: 'Close', top: 'Back to top', commandAria: 'Open command menu', skip: 'Skip to content', lang: 'Language', mainAria: 'Main navigation',
  },
  cmd: {
    navigate: 'Navigate', actions: 'Actions', social: 'Social', go: 'Go to',
    copyEmail: 'Copy email address', cv: 'Download CV (PDF)', carhelp: 'Open carhelp.pt', whatsapp: 'Message on WhatsApp', open: 'Open',
    switchLang: 'Ver em português',
    placeholder: 'Type a command or search…', empty: 'Nothing found.', hintNav: '↑↓ navigate', hintSelect: '↵ select', hintToggle: '⌘K toggle', aria: 'Command menu', searchAria: 'Search commands',
  },
  toast: { email: 'Email copied to clipboard' },
  hero: {
    status: 'Open to paid collaborations',
    shapes: ['TN — that’s me', 'CarHelp — my product', '</> — full-stack', '♥ — built with care', '∞ — always learning', '◎ — the world, from Porto'],
    hint: 'move your cursor through it',
    badge: 'DEVELOPER • DESIGNER • FOUNDER • ',
    badgeAria: 'Scroll to CarHelp',
    lede: 'Full-stack developer & UI/UX designer, 18. I build products people actually *use* — right now that’s *CarHelp,* launching on Google Play.',
    cta1: 'Explore CarHelp',
    cta2: 'See my work',
    scroll: 'Scroll',
  },
  ticker: { main: ['Full-stack', 'UI/UX', 'Product', 'Web', 'Mobile', 'AI & ML'], aria: 'What I do', side: ['Open to paid collaborations', 'CarHelp', 'Launching soon', 'Google Play', 'Porto'] },
  carhelp: {
    eyebrow: 'Featured — my own product',
    lede: 'The app that tells you if a car repair quote is *fair* — before you pay.',
    live: 'Website live — carhelp.pt',
    soon: 'Android app — launching soon on Google Play',
    steps: [
      { label: 'Quote analysis', title: 'Is this quote fair?', text: 'Snap a photo of a workshop quote. CarHelp reads it line by line — parts, labour, fees, VAT — and gives a clear verdict in under a minute: fair, expensive or suspicious, with the normal price range and what to ask the mechanic.' },
      { label: 'Your garage', title: 'Your car, under control.', text: 'Several cars, mileage, yearly spend and cost per km. Reminders for servicing, inspection (IPO), insurance and IUC tax — by date or by kilometres — so nothing slips.' },
      { label: 'Diagnostics & AI', title: 'Understand your car without being a mechanic.', text: 'Photograph a dashboard warning light, record a strange noise or look up an OBD code and get likely causes and typical costs — plus an AI assistant that knows your car and its history.' },
    ],
    facts: [
      { value: '<1', unit: 'min', label: 'to analyse a repair quote' },
      { value: '4', unit: '', label: 'reminder types — service, IPO, insurance, IUC' },
      { value: '0', unit: '€', label: 'workshop commissions. On the driver’s side.' },
      { value: 'PT', unit: '/EN', label: 'bilingual from day one' },
    ],
    visit: 'Visit carhelp.pt',
    caseStudy: 'Read the case study',
    gplaySmall: 'Coming soon on',
    gplayAria: 'Google Play — coming soon',
    screen: 'CarHelp screen',
  },
  work: { title: 'Selected work', note: (n) => `${n} projects`, open: 'Open' },
  projects: {
    'carhelp-app': {
      subtitle: 'Android App',
      statusLabel: 'Launching soon · Google Play',
      chip: 'Coming soon',
      tags: ['Android', 'AI', 'UI/UX', 'Product'],
      summary: 'My own product: an AI-powered app that tells drivers if a car repair quote is fair — plus a garage, reminders and diagnostics.',
      body: [
        'CarHelp is a product I designed and built from scratch. Drivers photograph a workshop quote and the app reads it line by line — parts, labour, fees and VAT — returning a verdict (fair, expensive or suspicious), the normal price range, possible savings and the questions worth asking the mechanic.',
        'Beyond quotes, it’s a full garage: multiple cars, mileage, yearly spend and cost per km, with reminders for servicing, inspection (IPO), insurance and IUC. Diagnostics let you photograph a dashboard light, record a noise or look up an OBD code, and an AI assistant knows your car’s history.',
        'There’s a free plan and a “CarHelp Completo” subscription with unlimited AI checks, family sharing and PDF maintenance reports. The Android app is in its final stretch and launching on Google Play very soon.',
      ],
      links: ['carhelp.pt'],
    },
    'carhelp-web': {
      subtitle: 'Product Website',
      statusLabel: 'Live · carhelp.pt',
      tags: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Three.js', 'Lenis'],
      summary: 'The launch site for CarHelp — oversized type, gradient-bordered glass, diffuse light and a 3D phone that follows the scroll.',
      body: [
        'The marketing site for CarHelp, live at carhelp.pt. A deep-black visual language with giant headlines, glass panels with gradient borders and diffuse violet-blue light — and a 3D phone (Three.js) that travels with the scroll, choreographed with GSAP ScrollTrigger and Lenis smooth scrolling.',
        'Fully bilingual (Portuguese and English), responsive from phone to ultrawide, with pricing, FAQ, legal pages and an account-deletion flow ready for the Google Play listing.',
      ],
      links: ['Visit carhelp.pt'],
    },
    'scuola-edile': {
      subtitle: 'Website Redesign',
      statusLabel: 'Live · formedilarezzo.it',
      tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress'],
      summary: 'ERASMUS project in Italy: the redesign of an official construction training & safety institution’s website.',
      body: [
        'Redesign of the official website for Scuola Edile — Centro per la Formazione e Sicurezza in Edilizia, an Italian construction training and safety institution. Built during my ERASMUS internship at Semanto (Agenzia di Comunicazione), in Italy.',
        'A modern, fully responsive layout with a training course catalogue, a safety & certification portal and a streamlined registration process, built accessibility-first.',
        'After the internship ended I kept collaborating remotely with Semanto to finish it — and we still work together. The site is now live.',
      ],
      links: ['Visit formedilarezzo.it'],
    },
    sportx: {
      subtitle: 'Club Management',
      statusLabel: 'PAP · graded 20/20',
      chip: 'Watch the demo',
      tags: ['Ruby on Rails', 'PostgreSQL', 'HTML', 'WSL (Ubuntu)', 'GitHub'],
      summary: 'My final school project (PAP), graded 20/20: a complete club management platform with member roles, practices, finances and a club social network.',
      body: [
        'Full-stack capstone project (PAP), developed throughout the 11th and 12th grades at school and graded 20/20.',
        'A complete club management system: member roles, practice scheduling, finances and an integrated social network with posts and interactions — built with Ruby on Rails and PostgreSQL on WSL (Ubuntu).',
        'The full demo is on YouTube.',
      ],
      links: ['Watch the demo on YouTube'],
    },
  },
  about: {
    title: 'About',
    note: 'Porto, PT',
    statement: 'I’m Tomás, a developer from Porto who cares about the details nobody asks for. I mix solid engineering with a real eye for *UX* — and I’d rather *ship* something real than just talk about it.',
    p: ['I finished my Professional Programming Course with an 18/20 average and a 20/20 capstone, worked with teams in Portugal and Italy, and now I’m building ', 'CarHelp', ' while studying Computer Science Engineering at ESTG — with a long-term focus on ', 'AI & Machine Learning', '.'],
    cv: 'Download CV',
    contact: 'Get in touch',
    photoAlt: 'Portrait of Tomás Nogueira',
    caption: ['Tomás Nogueira', '18 · Porto'],
    stats: ['Years writing code', 'PAP capstone grade', 'Course average', 'Sites live in production'],
  },
  experience: {
    title: 'Experience',
    note: (n) => `${n} roles right now`,
    now: 'Now',
    items: [
      { role: 'Founder · Designer & Developer', period: '2026 — Now', place: 'Porto, PT', text: 'Designing and building my own product end to end: the Android app, the AI quote analysis, the brand and the website at carhelp.pt.' },
      { role: 'IT Assistant', period: 'Jul 2026 — Now', place: 'Portugal', text: 'Building user-friendly web pages for data organisation with a strong UI/UX focus. Started as a Web Developer intern (May — July 2026), redesigning sections of the company website.' },
      { role: 'Web Developer', period: 'Jul 2026 — Now', place: 'Italy · Remote', text: 'Web pages for data organisation with a UI/UX focus. Started as an ERASMUS internship (April — May 2026), where I built the Scuola Edile website, now live at formedilarezzo.it.' },
      { role: 'Hardware Technician · Internship', period: 'May — Jul 2025', place: 'Portugal', text: 'Maintenance of desktops and laptops, and installation of servers, racks, switches and access points.' },
    ],
    educationTitle: 'Education',
    education: [
      { school: 'Computer Science Engineering · ESTG', detail: 'Currently studying — long-term focus on AI & Machine Learning', period: '2026 — Now' },
      { school: 'Escola Secundária da Maia', detail: 'Professional Programming Course — 18/20 average · PAP (SportX Club Management) graded 20/20', period: '2023 — 2026' },
    ],
    stackTitle: 'Stack & tools',
    stackLevels: ['Expert', 'Advanced', 'Working knowledge', 'Learning now'],
    learning: ['AI', 'Machine Learning'],
  },
  clients: { label: 'Trusted by & worked with', aria: 'Companies and institutions I’ve worked with' },
  collab: {
    title: 'Collaborate',
    note: 'Paid collaborations welcome',
    headline: 'Got an idea worth *building?* Let’s do it together.',
    side: 'My time is split between CarHelp and my studies, so I pick my projects carefully — paid collaborations are welcome, especially with people who care about what they make.',
    notNowLabel: 'Not right now',
    notNow: ['Full-time roles'],
    types: [
      { title: 'Product ideas', text: 'You have an idea, I have the hands. We prototype it, design it and ship a first real version together.', tags: ['MVP', 'UI/UX', 'Full-stack'], subject: 'Collaboration — product idea' },
      { title: 'Design × code', text: 'Designers who want their work built properly — responsive, accessible and with motion that feels right.', tags: ['Front-end', 'Motion', 'Web'], subject: 'Collaboration — design × code' },
      { title: 'Apps & AI', text: 'Mobile apps and AI-powered features — the things I’m learning and shipping every day with CarHelp.', tags: ['Android', 'Flutter', 'AI'], subject: 'Collaboration — app / AI' },
      { title: 'Side projects & open source', text: 'Tools, experiments and things that are simply fun to build. If it makes us both better, I’m in.', tags: ['GitHub', 'Experiments'], subject: 'Collaboration — side project' },
    ],
    cta: 'Pitch me this',
    stepsTitle: 'How a collaboration works',
    steps: [
      { title: 'Tell me the idea', text: 'A few lines are enough: what it is, who it’s for and where you are with it.' },
      { title: 'Quick call', text: '15–20 minutes to see if it clicks and if I can really add something.' },
      { title: 'Build together', text: 'We agree on scope, budget, roles and credit up front — then we ship.' },
    ],
  },
  contact: {
    eyebrow: 'Contact — I usually reply within 24h',
    title: 'Let’s build something *real.*',
    copyHint: 'Click to copy',
    whatsapp: 'WhatsApp',
    location: 'Location',
    locationValue: 'Porto, Portugal',
    time: 'Local time',
    status: 'Status',
    statusValue: 'Open to paid collaborations',
    form: { name: 'Your name', email: 'Email', subject: 'Subject', message: 'Tell me about your project', send: 'Send message', sending: 'Sending…', sent: 'Sent ✓' },
    msg: {
      ok: 'Message sent! A confirmation is on its way to your inbox — I’ll reply soon.',
      err: 'Something went wrong. Please try again or email',
      missing: 'Please fill in your name, email and message.',
      badEmail: 'That email address doesn’t look right.',
      noSubject: '(no subject)',
    },
    legal: ['Protected by reCAPTCHA — the Google', 'Privacy Policy', 'and', 'Terms of Service', 'apply.'],
  },
  footer: {
    marquee: ['Open to paid collaborations', 'Let’s talk'],
    idea: 'Got an idea?',
    hello: 'Say hello',
    menu: 'Menu', social: 'Social', products: 'Products', cv: 'CV (PDF)',
    hint: '↖ hover to scatter',
    built: 'Designed & built in Porto',
    top: 'Back to top ↑',
    words: ['NOGUEIRA', 'HELLO', 'LET’S TALK'],
  },
  modal: { close: 'Close' },
};

/* ───────────────────────────── Português ───────────────────────────── */
const pt = {
  meta: {
    title: 'Tomás Nogueira — Programador Full-Stack e fundador da CarHelp',
    description: 'Tomás Nogueira — programador full-stack e designer de UI/UX do Porto. Fundador da CarHelp, a app que te diz se um orçamento de oficina é justo.',
  },
  loader: { words: ['Olá', 'Bem-vindo', 'Viva', 'Olá'], foot: 'Tomás Nogueira — Portefólio ©2026' },
  cursor: { top: 'Topo', scroll: 'Descer', open: 'Abrir', copy: 'Copiar', visit: 'Visitar' },
  nav: {
    role: 'Programador Full-Stack',
    home: 'Início', carhelp: 'CarHelp', work: 'Projetos', about: 'Sobre mim', experience: 'Percurso', collaborate: 'Colaborar', contact: 'Contacto',
    talk: 'Vamos falar', menu: 'Menu', close: 'Fechar', top: 'Voltar ao topo', commandAria: 'Abrir o menu de comandos', skip: 'Saltar para o conteúdo', lang: 'Idioma', mainAria: 'Navegação principal',
  },
  cmd: {
    navigate: 'Navegar', actions: 'Ações', social: 'Redes', go: 'Ir para',
    copyEmail: 'Copiar o email', cv: 'Descarregar o CV (PDF)', carhelp: 'Abrir carhelp.pt', whatsapp: 'Enviar mensagem no WhatsApp', open: 'Abrir',
    switchLang: 'View in English',
    placeholder: 'Escreve um comando ou pesquisa…', empty: 'Nada encontrado.', hintNav: '↑↓ navegar', hintSelect: '↵ escolher', hintToggle: '⌘K abrir/fechar', aria: 'Menu de comandos', searchAria: 'Pesquisar comandos',
  },
  toast: { email: 'Email copiado' },
  hero: {
    status: 'Aberto a colaborações pagas',
    shapes: ['TN — sou eu', 'CarHelp — o meu produto', '</> — full-stack', '♥ — feito com cuidado', '∞ — sempre a aprender', '◎ — o mundo, a partir do Porto'],
    hint: 'passa o cursor pelos pontos',
    badge: 'PROGRAMADOR • DESIGNER • FUNDADOR • ',
    badgeAria: 'Descer até à CarHelp',
    lede: 'Programador full-stack e designer de UI/UX, 18 anos. Crio produtos que as pessoas *usam* mesmo — agora é a *CarHelp,* que está quase a chegar ao Google Play.',
    cta1: 'Conhecer a CarHelp',
    cta2: 'Ver projetos',
    scroll: 'Descer',
  },
  ticker: { main: ['Full-stack', 'UI/UX', 'Produto', 'Web', 'Apps', 'IA & ML'], aria: 'O que faço', side: ['Aberto a colaborações pagas', 'CarHelp', 'Lançamento em breve', 'Google Play', 'Porto'] },
  carhelp: {
    eyebrow: 'Em destaque — o meu produto',
    lede: 'A app que te diz se o orçamento da oficina é *justo* — antes de pagares.',
    live: 'Site online — carhelp.pt',
    soon: 'App Android — em breve no Google Play',
    steps: [
      { label: 'Análise de orçamentos', title: 'Este orçamento é justo?', text: 'Tira uma foto ao orçamento da oficina. A CarHelp lê-o linha a linha — peças, mão de obra, taxas, IVA — e em menos de um minuto dá-te um veredicto claro: justo, caro ou suspeito, com o intervalo normal de preço e o que perguntar ao mecânico.' },
      { label: 'A tua garagem', title: 'O teu carro, sob controlo.', text: 'Vários carros, quilómetros, gastos do ano e custo por km. Lembretes para a revisão, a inspeção (IPO), o seguro e o IUC — por data ou por quilómetros — para nada te escapar.' },
      { label: 'Diagnóstico e IA', title: 'Percebe o carro sem seres mecânico.', text: 'Fotografa uma luz do painel, grava um barulho estranho ou procura um código OBD e fica a saber as causas prováveis e os custos habituais — e ainda um assistente com IA que conhece o teu carro e o histórico dele.' },
    ],
    facts: [
      { value: '<1', unit: 'min', label: 'para analisar um orçamento' },
      { value: '4', unit: '', label: 'tipos de lembretes — revisão, IPO, seguro, IUC' },
      { value: '0', unit: '€', label: 'de comissões das oficinas. Do lado de quem conduz.' },
      { value: 'PT', unit: '/EN', label: 'em português e inglês desde o primeiro dia' },
    ],
    visit: 'Visitar carhelp.pt',
    caseStudy: 'Ler o caso completo',
    gplaySmall: 'Em breve no',
    gplayAria: 'Google Play — em breve',
    screen: 'Ecrã da CarHelp',
  },
  work: { title: 'Projetos', note: (n) => `${n} projetos`, open: 'Abrir' },
  projects: {
    'carhelp-app': {
      subtitle: 'App Android',
      statusLabel: 'Em breve · Google Play',
      chip: 'Em breve',
      tags: ['Android', 'IA', 'UI/UX', 'Produto'],
      summary: 'O meu produto: uma app com IA que diz aos condutores se um orçamento de oficina é justo — com garagem, lembretes e diagnóstico.',
      body: [
        'A CarHelp é um produto que desenhei e construí do zero. O condutor fotografa o orçamento da oficina e a app lê-o linha a linha — peças, mão de obra, taxas e IVA — e devolve um veredicto (justo, caro ou suspeito), o intervalo normal de preço, quanto pode poupar e as perguntas que vale a pena fazer ao mecânico.',
        'Para além dos orçamentos, é uma garagem completa: vários carros, quilómetros, gastos do ano e custo por km, com lembretes para a revisão, a inspeção (IPO), o seguro e o IUC. No diagnóstico podes fotografar uma luz do painel, gravar um barulho ou procurar um código OBD, e há um assistente com IA que conhece o histórico do carro.',
        'Tem um plano grátis e uma subscrição “CarHelp Completo” com análises de IA ilimitadas, partilha com a família e relatórios de manutenção em PDF. A app Android está na reta final e chega ao Google Play muito em breve.',
      ],
      links: ['carhelp.pt'],
    },
    'carhelp-web': {
      subtitle: 'Site do produto',
      statusLabel: 'Online · carhelp.pt',
      tags: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Three.js', 'Lenis'],
      summary: 'O site de lançamento da CarHelp — letras gigantes, vidro com bordas em gradiente, luz difusa e um telemóvel 3D que acompanha o scroll.',
      body: [
        'O site da CarHelp, online em carhelp.pt. Uma linguagem visual em preto profundo, com títulos gigantes, painéis de vidro com bordas em gradiente e luz difusa violeta e azul — e um telemóvel 3D (Three.js) que viaja com o scroll, coreografado com GSAP ScrollTrigger e o scroll suave do Lenis.',
        'Totalmente bilingue (português e inglês), adaptado do telemóvel ao ecrã ultralargo, com preços, perguntas frequentes, páginas legais e um processo para apagar a conta pronto para a ficha do Google Play.',
      ],
      links: ['Visitar carhelp.pt'],
    },
    'scuola-edile': {
      subtitle: 'Novo site',
      statusLabel: 'Online · formedilarezzo.it',
      tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress'],
      summary: 'Projeto ERASMUS em Itália: o redesign do site oficial de uma instituição de formação e segurança na construção.',
      body: [
        'Redesign do site oficial da Scuola Edile — Centro per la Formazione e Sicurezza in Edilizia, uma instituição italiana de formação e segurança na construção. Feito durante o meu estágio ERASMUS na Semanto (Agenzia di Comunicazione), em Itália.',
        'Um layout moderno e totalmente responsivo, com o catálogo de cursos, um portal de segurança e certificação e um processo de inscrição mais simples, pensado para ser acessível.',
        'Depois de o estágio acabar continuei a colaborar à distância com a Semanto para o terminar — e ainda trabalhamos juntos. O site já está online.',
      ],
      links: ['Visitar formedilarezzo.it'],
    },
    sportx: {
      subtitle: 'Gestão de clubes',
      statusLabel: 'PAP · nota 20/20',
      chip: 'Ver a demo',
      tags: ['Ruby on Rails', 'PostgreSQL', 'HTML', 'WSL (Ubuntu)', 'GitHub'],
      summary: 'O meu projeto final de curso (PAP), com 20 valores: uma plataforma completa de gestão de clubes com perfis de membros, treinos, finanças e uma rede social do clube.',
      body: [
        'Projeto full-stack de final de curso (PAP), desenvolvido ao longo do 11.º e do 12.º ano e avaliado com 20 valores.',
        'Um sistema completo de gestão de clubes: perfis e papéis dos membros, marcação de treinos, finanças e uma rede social integrada com publicações e interações — feito com Ruby on Rails e PostgreSQL em WSL (Ubuntu).',
        'A demonstração completa está no YouTube.',
      ],
      links: ['Ver a demo no YouTube'],
    },
  },
  about: {
    title: 'Sobre mim',
    note: 'Porto, PT',
    statement: 'Sou o Tomás, um programador do Porto que liga aos detalhes que ninguém pede. Junto boa engenharia a um olho atento para o *UX* — e prefiro *lançar* algo real a ficar só a falar sobre isso.',
    p: ['Terminei o Curso Profissional de Programação com média de 18 e 20 valores na PAP, trabalhei com equipas em Portugal e em Itália, e agora estou a construir a ', 'CarHelp', ' enquanto estudo Engenharia Informática na ESTG — com o objetivo de me especializar em ', 'IA e Machine Learning', '.'],
    cv: 'Descarregar CV',
    contact: 'Fala comigo',
    photoAlt: 'Retrato de Tomás Nogueira',
    caption: ['Tomás Nogueira', '18 · Porto'],
    stats: ['Anos a programar', 'Nota da PAP', 'Média do curso', 'Sites online'],
  },
  experience: {
    title: 'Percurso',
    note: (n) => `${n} funções neste momento`,
    now: 'Agora',
    items: [
      { role: 'Fundador · Designer e Programador', period: '2026 — Agora', place: 'Porto, PT', text: 'Estou a desenhar e a construir o meu próprio produto do início ao fim: a app Android, a análise de orçamentos com IA, a marca e o site carhelp.pt.' },
      { role: 'Assistente de IT', period: 'Jul 2026 — Agora', place: 'Portugal', text: 'Desenvolvo páginas web para organizar dados, simples de usar e com muita atenção ao UI/UX. Comecei como estagiário de desenvolvimento web (maio — julho de 2026), a redesenhar secções do site da empresa.' },
      { role: 'Programador Web', period: 'Jul 2026 — Agora', place: 'Itália · Remoto', text: 'Páginas web para organizar dados, com foco em UI/UX. Começou como estágio ERASMUS (abril — maio de 2026), onde fiz o site da Scuola Edile, agora online em formedilarezzo.it.' },
      { role: 'Técnico de Hardware · Estágio', period: 'Mai — Jul 2025', place: 'Portugal', text: 'Manutenção de computadores de secretária e portáteis, e instalação de servidores, racks, switches e access points.' },
    ],
    educationTitle: 'Formação',
    education: [
      { school: 'Engenharia Informática · ESTG', detail: 'A estudar — com foco a longo prazo em IA e Machine Learning', period: '2026 — Agora' },
      { school: 'Escola Secundária da Maia', detail: 'Curso Profissional de Programação — média de 18 · PAP (SportX Club Management) com 20 valores', period: '2023 — 2026' },
    ],
    stackTitle: 'Tecnologias e ferramentas',
    stackLevels: ['Especialista', 'Avançado', 'Conhecimentos', 'A aprender'],
    learning: ['IA', 'Machine Learning'],
  },
  clients: { label: 'Confiaram em mim e trabalhei com', aria: 'Empresas e instituições com quem trabalhei' },
  collab: {
    title: 'Colaborar',
    note: 'Colaborações pagas são bem-vindas',
    headline: 'Tens uma ideia que vale a pena *construir?* Vamos fazê-la juntos.',
    side: 'O meu tempo divide-se entre a CarHelp e os estudos, por isso escolho bem os projetos — colaborações pagas são bem-vindas, sobretudo para construir algo com pessoas que gostam do que fazem.',
    notNowLabel: 'Agora não',
    notNow: ['Emprego a tempo inteiro'],
    types: [
      { title: 'Ideias de produto', text: 'Tu tens a ideia, eu tenho as mãos. Fazemos o protótipo, o design e lançamos juntos uma primeira versão a sério.', tags: ['MVP', 'UI/UX', 'Full-stack'], subject: 'Colaboração — ideia de produto' },
      { title: 'Design × código', text: 'Designers que querem o seu trabalho bem construído — responsivo, acessível e com animações que fazem sentido.', tags: ['Front-end', 'Animação', 'Web'], subject: 'Colaboração — design × código' },
      { title: 'Apps e IA', text: 'Apps para telemóvel e funcionalidades com IA — o que ando a aprender e a lançar todos os dias com a CarHelp.', tags: ['Android', 'Flutter', 'IA'], subject: 'Colaboração — app / IA' },
      { title: 'Projetos paralelos e open source', text: 'Ferramentas, experiências e coisas que simplesmente dão gosto fazer. Se nos fizer melhores aos dois, conta comigo.', tags: ['GitHub', 'Experiências'], subject: 'Colaboração — projeto paralelo' },
    ],
    cta: 'Propõe-me isto',
    stepsTitle: 'Como funciona uma colaboração',
    steps: [
      { title: 'Conta-me a ideia', text: 'Bastam umas linhas: o que é, para quem é e em que ponto está.' },
      { title: 'Chamada rápida', text: '15 a 20 minutos para ver se encaixa e se consigo mesmo acrescentar alguma coisa.' },
      { title: 'Construímos juntos', text: 'Combinamos à partida o âmbito, o orçamento, os papéis e os créditos — e depois lançamos.' },
    ],
  },
  contact: {
    eyebrow: 'Contacto — costumo responder em 24h',
    title: 'Vamos construir algo *real.*',
    copyHint: 'Clica para copiar',
    whatsapp: 'WhatsApp',
    location: 'Localização',
    locationValue: 'Porto, Portugal',
    time: 'Hora local',
    status: 'Estado',
    statusValue: 'Aberto a colaborações pagas',
    form: { name: 'O teu nome', email: 'Email', subject: 'Assunto', message: 'Fala-me do teu projeto', send: 'Enviar mensagem', sending: 'A enviar…', sent: 'Enviada ✓' },
    msg: {
      ok: 'Mensagem enviada! Vais receber uma confirmação no teu email — respondo em breve.',
      err: 'Alguma coisa correu mal. Tenta outra vez ou escreve para',
      missing: 'Preenche o teu nome, email e mensagem.',
      badEmail: 'Esse email não parece estar certo.',
      noSubject: '(sem assunto)',
    },
    legal: ['Protegido por reCAPTCHA — aplicam-se a', 'Política de Privacidade', 'e os', 'Termos de Utilização', 'da Google.'],
  },
  footer: {
    marquee: ['Aberto a colaborações pagas', 'Vamos falar'],
    idea: 'Tens uma ideia?',
    hello: 'Diz olá',
    menu: 'Menu', social: 'Redes', products: 'Produtos', cv: 'CV (PDF)',
    hint: '↖ passa o cursor para espalhar',
    built: 'Desenhado e feito no Porto',
    top: 'Voltar ao topo ↑',
    words: ['NOGUEIRA', 'OLÁ', 'VAMOS FALAR'],
  },
  modal: { close: 'Fechar' },
};

export const CONTENT = { en, pt };

/* merge the shared data with the texts of one language */
export function buildContent(lang) {
  const t = CONTENT[lang];
  return {
    ...t,
    os: OS_TEXT[lang],
    projects: PROJECTS_BASE(lang).map((p) => ({
      ...p,
      ...t.projects[p.id],
      links: p.links.map((href, i) => ({ href, label: t.projects[p.id].links[i] })),
    })),
    experienceItems: EXPERIENCE_BASE.map((e, i) => ({ ...e, ...t.experience.items[i] })),
    stack: [
      ...STACK_BASE.map((items, i) => ({ level: t.experience.stackLevels[i], items })),
      { level: t.experience.stackLevels[3], items: t.experience.learning },
    ],
    collabTypes: COLLAB_BASE.map((c, i) => ({ ...c, ...t.collab.types[i] })),
    carhelpSteps: CARHELP.steps.map((key, i) => ({
      key,
      img: appMedia(lang, `phone-${key}.webp`),
      screen: appMedia(lang, `screen-${key}.jpg`),
      ...t.carhelp.steps[i],
    })),
  };
}
