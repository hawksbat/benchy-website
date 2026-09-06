(() => {
  const config = window.BENCHY_CONFIG || {};
  const fallback = { version: '9.6.0', downloadUrl: '', releasePage: '' };
  const shots = {
    pc: { src: "/assets/images/Capture%20d%27%C3%A9cran%202026-09-06%20175721.png", alt: 'Capture réelle de Benchy, écran Mon PC' },
    games: { src: "/assets/images/Capture%20d%27%C3%A9cran%202026-09-06%20175657.png", alt: 'Capture réelle de Benchy, catalogue Jeux' },
    compare: { src: "/assets/images/Capture%20d%27%C3%A9cran%202026-09-06%20175739.png", alt: 'Capture réelle de Benchy, comparateur GPU' }
  };
  const translations = {
    fr: {
      heroEyebrow: 'BENCHY · POUR WINDOWS', heroTitle: 'Connais ton PC.<br>Maîtrise ses <em>performances.</em>', heroText: 'Analyse ton matériel, mesure ses performances, découvre comment tournent tes jeux et compare ta configuration en quelques minutes.', download: 'Télécharger Benchy', downloadShort: 'Télécharger', discover: 'Découvrir Benchy', navHome: 'Accueil', navFeatures: 'Fonctionnalités', navGames: 'Jeux', navPlus: 'Benchy+', navUpdates: 'Nouveautés'
    },
    en: {
      heroEyebrow: 'BENCHY · FOR WINDOWS', heroTitle: 'Know your PC.<br>Master its <em>performance.</em>', heroText: 'Analyze your hardware, measure performance, see how your games may run and compare your setup in minutes.', download: 'Download Benchy', downloadShort: 'Download', discover: 'Discover Benchy', navHome: 'Home', navFeatures: 'Features', navGames: 'Games', navPlus: 'Benchy+', navUpdates: 'Updates'
    },
    es: {
      heroEyebrow: 'BENCHY · PARA WINDOWS', heroTitle: 'Conoce tu PC.<br>Domina su <em>rendimiento.</em>', heroText: 'Analiza tu hardware, mide el rendimiento, descubre cómo pueden funcionar tus juegos y compara tu equipo en minutos.', download: 'Descargar Benchy', downloadShort: 'Descargar', discover: 'Descubrir Benchy', navHome: 'Inicio', navFeatures: 'Funciones', navGames: 'Juegos', navPlus: 'Benchy+', navUpdates: 'Novedades'
    }
  };
  const languageSelect = document.querySelector('.language-select');
  const languageTrigger = document.querySelector('.language-trigger');
  const languageMenu = document.querySelector('.language-menu');
  const currentLanguage = document.querySelector('[data-current-language]');
  const menuButton = document.querySelector('.menu-button');
  const siteNav = document.querySelector('.site-nav');

  const setVersion = (data) => document.querySelectorAll('[data-version]').forEach((node) => { node.textContent = data.version || fallback.version; });
  const setDownloads = (data) => {
    const url = data.downloadUrl || data.releasePage || config.releasePage || '';
    document.querySelectorAll('[data-download]').forEach((node) => {
      if (url) { node.href = url; node.classList.remove('disabled'); node.removeAttribute('aria-disabled'); }
      else { node.href = '/download/'; node.classList.add('disabled'); node.setAttribute('aria-disabled', 'true'); }
    });
    document.querySelectorAll('[data-download-note]').forEach((node) => { node.textContent = url ? '' : 'Téléchargement bientôt disponible'; });
  };
  const setLanguageMenu = (language) => {
    document.querySelectorAll('[data-language]').forEach((node) => node.classList.toggle('is-active', node.dataset.language === language));
  };
  const applyLanguage = (language) => {
    const selected = translations[language] ? language : 'fr';
    localStorage.setItem('benchy-language', selected);
    document.documentElement.lang = selected;
    if (currentLanguage) currentLanguage.textContent = selected.toUpperCase();
    setLanguageMenu(selected);
    document.querySelectorAll('[data-i18n]').forEach((node) => { const value = translations[selected][node.dataset.i18n]; if (value) node.innerHTML = value; });
  };
  const closeLanguageMenu = () => { if (languageMenu) languageMenu.classList.remove('is-open'); if (languageTrigger) languageTrigger.setAttribute('aria-expanded', 'false'); };
  if (languageTrigger && languageMenu) languageTrigger.addEventListener('click', () => { const open = languageMenu.classList.toggle('is-open'); languageTrigger.setAttribute('aria-expanded', String(open)); });
  document.querySelectorAll('[data-language]').forEach((node) => node.addEventListener('click', () => { applyLanguage(node.dataset.language); closeLanguageMenu(); }));
  document.addEventListener('click', (event) => { if (languageSelect && !languageSelect.contains(event.target)) closeLanguageMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeLanguageMenu(); if (siteNav && menuButton) { siteNav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); } } });
  if (menuButton && siteNav) menuButton.addEventListener('click', () => { const open = siteNav.classList.toggle('is-open'); menuButton.setAttribute('aria-expanded', String(open)); });
  if (siteNav && menuButton) siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { siteNav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }));

  const galleryImage = document.querySelector('#gallery-image');
  document.querySelectorAll('[data-shot]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-shot]').forEach((item) => item.classList.toggle('active', item === button));
    const shot = shots[button.dataset.shot];
    if (!galleryImage || !shot) return;
    galleryImage.style.opacity = '0'; galleryImage.style.transform = 'translateY(6px)';
    window.setTimeout(() => { galleryImage.src = shot.src; galleryImage.alt = shot.alt; galleryImage.style.opacity = '1'; galleryImage.style.transform = 'translateY(0)'; }, 220);
  }));
  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
  const header = document.querySelector('.site-header');
  const updateHeader = () => { if (header) header.classList.toggle('is-scrolled', window.scrollY > 12); };
  window.addEventListener('scroll', updateHeader, { passive: true }); updateHeader();
  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach((node) => revealObserver.observe(node));
  applyLanguage(localStorage.getItem('benchy-language') || 'fr');
  setVersion(fallback); setDownloads(fallback);
  fetch('/version.json', { cache: 'no-store' }).then((response) => response.ok ? response.json() : Promise.reject()).then((data) => { setVersion(data); setDownloads(data); }).catch(() => {});
  if (window.lucide) window.lucide.createIcons();
})();
