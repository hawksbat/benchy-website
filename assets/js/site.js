(() => {
  const config = window.BENCHY_CONFIG || {};
  const isNested = /\/(download|plus|checkout|legal|changelog|updates)\//.test(window.location.pathname);
  const root = isNested ? '../' : './';
  const assetRoot = `${root}assets/`;
  const fallback = { version: '9.6.0', downloadUrl: '', releasePage: '', releaseNotes: [] };
  const translations = {
    fr: { heroEyebrow: 'BENCHY · POUR WINDOWS', heroTitle: 'Connais ton PC.<br>Maîtrise ses <em>performances.</em>', heroText: 'Analyse ton matériel, mesure ses performances et découvre comment tournent tes jeux.', download: 'Télécharger Benchy', discover: 'Découvrir les fonctionnalités', navHome: 'Accueil', navFeatures: 'Fonctionnalités', navGames: 'Jeux', navUpdates: 'Mises à jour', navPremium: 'Premium' },
    en: { heroEyebrow: 'BENCHY · FOR WINDOWS', heroTitle: 'Know your PC.<br>Master its <em>performance.</em>', heroText: 'Analyze your hardware, measure performance and see how your games may run.', download: 'Download Benchy', discover: 'Discover features', navHome: 'Home', navFeatures: 'Features', navGames: 'Games', navUpdates: 'Updates', navPremium: 'Premium' },
    es: { heroEyebrow: 'BENCHY · PARA WINDOWS', heroTitle: 'Conoce tu PC.<br>Domina su <em>rendimiento.</em>', heroText: 'Analiza tu hardware, mide el rendimiento y descubre cómo pueden funcionar tus juegos.', download: 'Descargar Benchy', discover: 'Descubrir funciones', navHome: 'Inicio', navFeatures: 'Funciones', navGames: 'Juegos', navUpdates: 'Novedades', navPremium: 'Premium' }
  };
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const setVersion = (data) => $$('[data-version]').forEach((node) => { node.textContent = data.version || fallback.version; });
  const setDownloadState = (data) => {
    const url = data.downloadUrl || data.releasePage || config.releasePage || '';
    $$('[data-download]').forEach((node) => { node.href = url || `${root}download/`; node.classList.toggle('disabled', !url); node.setAttribute('aria-disabled', String(!url)); });
    $$('[data-download-note]').forEach((node) => { node.textContent = url ? '' : 'Téléchargement bientôt disponible'; });
  };
  const applyLanguage = (requested) => {
    const language = translations[requested] ? requested : 'fr';
    localStorage.setItem('benchy-language', language);
    document.documentElement.lang = language;
    $$('[data-i18n]').forEach((node) => { const value = translations[language][node.dataset.i18n]; if (value) node.innerHTML = value; });
    $$('[data-current-language]').forEach((node) => { node.textContent = language.toUpperCase(); });
    $$('[data-language]').forEach((node) => node.classList.toggle('is-active', node.dataset.language === language));
  };
  const languageMenu = $('.language-menu');
  const languageTrigger = $('.language-trigger');
  const closeLanguage = () => { if (languageMenu) languageMenu.classList.remove('is-open'); if (languageTrigger) languageTrigger.setAttribute('aria-expanded', 'false'); };
  if (languageTrigger && languageMenu) languageTrigger.addEventListener('click', () => { const open = languageMenu.classList.toggle('is-open'); languageTrigger.setAttribute('aria-expanded', String(open)); });
  $$('[data-language]').forEach((node) => node.addEventListener('click', () => { applyLanguage(node.dataset.language); closeLanguage(); }));
  document.addEventListener('click', (event) => { const wrapper = $('.language-select'); if (wrapper && !wrapper.contains(event.target)) closeLanguage(); });
  const menuButton = $('.menu-button');
  const siteNav = $('.site-nav');
  if (menuButton && siteNav) menuButton.addEventListener('click', () => { const open = siteNav.classList.toggle('is-open'); menuButton.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeLanguage(); if (siteNav && menuButton) { siteNav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); } } });
  if (siteNav && menuButton) $$('a', siteNav).forEach((link) => link.addEventListener('click', () => { siteNav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }));
  const gallery = $('#gallery-image');
  const galleryShots = {
    pc: ['Capture%20d%27%C3%A9cran%202026-09-06%20175721.png', 'Capture réelle de Benchy, écran Mon PC'],
    games: ['Capture%20d%27%C3%A9cran%202026-09-06%20175657.png', 'Capture réelle de Benchy, catalogue Jeux'],
    compare: ['Capture%20d%27%C3%A9cran%202026-09-06%20175739.png', 'Capture réelle de Benchy, comparateur GPU']
  };
  $$('[data-shot]').forEach((button) => button.addEventListener('click', () => { const shot = galleryShots[button.dataset.shot]; if (!gallery || !shot) return; $$('[data-shot]').forEach((item) => item.classList.toggle('active', item === button)); gallery.style.opacity = '0'; gallery.style.transform = 'translateY(6px)'; window.setTimeout(() => { gallery.src = `${assetRoot}images/${shot[0]}`; gallery.alt = shot[1]; gallery.style.opacity = '1'; gallery.style.transform = 'none'; }, 220); }));
  $$('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
  const header = $('.site-header');
  const onScroll = () => { if (header) header.classList.toggle('is-scrolled', window.scrollY > 12); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if ('IntersectionObserver' in window) { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 }); $$('[data-reveal]').forEach((node) => observer.observe(node)); } else { $$('[data-reveal]').forEach((node) => node.classList.add('is-visible')); }
  applyLanguage(localStorage.getItem('benchy-language') || 'fr');
  setVersion(fallback); setDownloadState(fallback);
  fetch(`${root}version.json`, { cache: 'no-store' }).then((response) => response.ok ? response.json() : Promise.reject()).then((data) => { setVersion(data); setDownloadState(data); const notes = $('#release-notes'); if (notes && Array.isArray(data.releaseNotes)) notes.textContent = data.releaseNotes.join(' '); }).catch(() => {});
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
})();
