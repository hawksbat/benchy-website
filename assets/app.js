(function () {
  const config = window.BENCHY_CONFIG || {};
  const fallback = { version: '9.6.0', downloadUrl: '', releasePage: '' };
  const imageBase = '/assets/images/';
  const shots = {
    dashboard: "Capture%20d%27%C3%A9cran%202026-09-06%20171232.png",
    benchmark: "Capture%20d%27%C3%A9cran%202026-09-06%20171240.png",
    games: "Capture%20d%27%C3%A9cran%202026-09-06%20171246.png",
    compare: "Capture%20d%27%C3%A9cran%202026-09-06%20171305.png",
    storage: "Capture%20d%27%C3%A9cran%202026-09-06%20171327.png"
  };
  const translations = {
    fr: { forWindows: 'POUR WINDOWS', heroTitle: 'Connais ton PC.\nMaîtrise ses performances.', heroText: 'Analyse ton matériel, mesure ses performances, découvre comment tournent tes jeux et compare ta configuration avec Benchy.', download: 'Télécharger Benchy', discover: 'Découvrir Benchy' },
    en: { forWindows: 'FOR WINDOWS', heroTitle: 'Know your PC.\nMaster its performance.', heroText: 'Analyze your hardware, measure performance, see how your games may run and compare your setup with Benchy.', download: 'Download Benchy', discover: 'Discover Benchy' },
    es: { forWindows: 'PARA WINDOWS', heroTitle: 'Conoce tu PC.\nDomina su rendimiento.', heroText: 'Analiza tu hardware, mide el rendimiento, descubre cómo pueden funcionar tus juegos y compara tu equipo con Benchy.', download: 'Descargar Benchy', discover: 'Descubrir Benchy' }
  };
  const sharedLabels = {
    fr: { navHome: 'Accueil', navFeatures: 'Fonctionnalités', navGames: 'Jeux', navPlus: 'Benchy+', navNews: 'Nouveautés', benchmark: 'Benchmark', pc: 'Mon PC', monitoring: 'Monitoring', compare: 'Comparer', storage: 'Stockage', intro: 'Ton PC, expliqué clairement.', benchmarkTitle: 'Mesure ce que vaut vraiment ta configuration.', gamesTitle: 'Tes jeux.<br>Tes performances.', pcTitle: 'Tout ton PC.<br>Une seule vue.', monitoringTitle: 'Vois ce que fait ta machine.', compareTitle: 'Compare ce qui compte vraiment.', storageTitle: "Récupère de l'espace sans chercher pendant des heures." },
    en: { navHome: 'Home', navFeatures: 'Features', navGames: 'Games', navPlus: 'Benchy+', navNews: 'Updates', benchmark: 'Benchmark', pc: 'My PC', monitoring: 'Monitoring', compare: 'Compare', storage: 'Storage', intro: 'Your PC, clearly explained.', benchmarkTitle: 'Measure what your setup is really worth.', gamesTitle: 'Your games.<br>Your performance.', pcTitle: 'Your whole PC.<br>One view.', monitoringTitle: 'See what your machine is doing.', compareTitle: 'Compare what really matters.', storageTitle: 'Recover space without searching for hours.' },
    es: { navHome: 'Inicio', navFeatures: 'Funciones', navGames: 'Juegos', navPlus: 'Benchy+', navNews: 'Novedades', benchmark: 'Benchmark', pc: 'Mi PC', monitoring: 'Monitorización', compare: 'Comparar', storage: 'Almacenamiento', intro: 'Tu PC, explicado claramente.', benchmarkTitle: 'Mide lo que realmente vale tu configuración.', gamesTitle: 'Tus juegos.<br>Tu rendimiento.', pcTitle: 'Todo tu PC.<br>Una sola vista.', monitoringTitle: 'Mira qué hace tu máquina.', compareTitle: 'Compara lo que realmente importa.', storageTitle: 'Recupera espacio sin buscar durante horas.' }
  };
  const setVersion = (data) => document.querySelectorAll('[data-version]').forEach((node) => { node.textContent = data.version || fallback.version; });
  const setDownloads = (data) => document.querySelectorAll('[data-download]').forEach((node) => {
    const url = data.downloadUrl || data.releasePage || config.releasePage || '';
    if (url) { node.href = url; node.classList.remove('disabled'); node.removeAttribute('aria-disabled'); }
    else { node.href = '/download/'; node.classList.add('disabled'); node.setAttribute('aria-disabled', 'true'); }
  });
  const applyLanguage = (language) => {
    const selected = translations[language] ? language : 'fr';
    localStorage.setItem('benchy-language', selected);
    document.documentElement.lang = selected;
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const value = translations[selected][node.dataset.i18n];
      if (value) node.innerHTML = value.replace(/\n/g, '<br>');
    });
    const labels = sharedLabels[selected];
    const replacements = { '.links a:nth-child(1)': labels.navHome, '.links a:nth-child(2)': labels.navFeatures, '.links a:nth-child(3)': labels.navGames, '.links a:nth-child(4)': labels.navPlus, '.links a:nth-child(5)': labels.navNews, '.product-nav a:nth-child(1)': labels.benchmark, '.product-nav a:nth-child(2)': labels.navGames, '.product-nav a:nth-child(3)': labels.pc, '.product-nav a:nth-child(4)': labels.monitoring, '.product-nav a:nth-child(5)': labels.compare, '.product-nav a:nth-child(6)': labels.storage, '.intro h2': labels.intro, '#benchmark h2': labels.benchmarkTitle, '#games h2': labels.gamesTitle, '#pc h2': labels.pcTitle, '#monitoring h2': labels.monitoringTitle, '#compare h2': labels.compareTitle, '#storage h2': labels.storageTitle };
    Object.entries(replacements).forEach(([selector, value]) => { const node = document.querySelector(selector); if (node) node.innerHTML = value; });
    document.querySelectorAll('[data-lang]').forEach((node) => { node.style.color = node.dataset.lang === selected ? 'var(--orange)' : 'var(--muted)'; });
  };
  document.querySelectorAll('[data-lang]').forEach((node) => node.addEventListener('click', () => applyLanguage(node.dataset.lang)));
  applyLanguage(localStorage.getItem('benchy-language') || 'fr');
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('.links');
  if (menu && links) menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  const galleryImage = document.getElementById('gallery-image');
  document.querySelectorAll('[data-shot]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-shot]').forEach((item) => item.classList.toggle('active', item === button));
    if (!galleryImage || !shots[button.dataset.shot]) return;
    galleryImage.style.opacity = '0';
    window.setTimeout(() => { galleryImage.src = imageBase + shots[button.dataset.shot]; galleryImage.style.opacity = '1'; }, 220);
  }));
  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
  const header = document.querySelector('.nav');
  const updateHeader = () => { if (header) header.classList.toggle('scrolled', window.scrollY > 12); };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));
  if (window.lucide) window.lucide.createIcons();
  setVersion(fallback); setDownloads(fallback);
  fetch('/version.json', { cache: 'no-store' }).then((response) => response.ok ? response.json() : Promise.reject()).then((data) => { setVersion(data); setDownloads(data); }).catch(() => {});
})();
