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
  setVersion(fallback); setDownloads(fallback);
  fetch('/version.json', { cache: 'no-store' }).then((response) => response.ok ? response.json() : Promise.reject()).then((data) => { setVersion(data); setDownloads(data); }).catch(() => {});
})();
