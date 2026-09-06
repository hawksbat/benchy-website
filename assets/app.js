(function () {
	const config = window.BENCHY_CONFIG || {};
	const fallback = { version: '9.6.0', downloadUrl: '', releasePage: '', releaseNotes: [] };
	const text = {
		fr: { heroText: 'Analyse ton matériel, mesure ses performances, découvre comment tournent tes jeux et compare ta configuration en quelques minutes.' },
		en: { heroText: 'Analyze your hardware, measure performance, see how your games may run and compare your setup in minutes.' },
		es: { heroText: 'Analiza tu hardware, mide el rendimiento, descubre cómo pueden funcionar tus juegos y compara tu equipo en minutos.' }
	};
	const setVersion = (data) => document.querySelectorAll('[data-version]').forEach((node) => { node.textContent = data.version || fallback.version; });
	const setDownloads = (data) => document.querySelectorAll('[data-download]').forEach((node) => {
		const url = data.downloadUrl || data.releasePage || config.releasePage || '';
		if (url) { node.href = url; node.classList.remove('disabled'); node.removeAttribute('aria-disabled'); }
		else { node.href = '/download/'; node.classList.add('disabled'); node.setAttribute('aria-disabled', 'true'); }
	});
	const applyLanguage = (language) => {
		const selected = text[language] ? language : 'fr';
		localStorage.setItem('benchy-language', selected);
		document.documentElement.lang = selected;
		document.querySelectorAll('[data-i18n]').forEach((node) => { if (text[selected][node.dataset.i18n]) node.textContent = text[selected][node.dataset.i18n]; });
		document.querySelectorAll('[data-lang]').forEach((node) => node.style.color = node.dataset.lang === selected ? 'var(--accent)' : 'var(--muted)');
	};
	document.querySelectorAll('[data-lang]').forEach((node) => node.addEventListener('click', () => applyLanguage(node.dataset.lang)));
	applyLanguage(localStorage.getItem('benchy-language') || 'fr');
	const menu = document.querySelector('.menu-toggle');
	const links = document.querySelector('.links');
	if (menu && links) menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
	const label = document.querySelector('[data-shot-label]');
	document.querySelectorAll('[data-shot]').forEach((button) => button.addEventListener('click', () => {
		document.querySelectorAll('[data-shot]').forEach((item) => item.classList.toggle('active', item === button));
		if (label) label.textContent = button.dataset.shot + '.webp';
	}));
	document.querySelectorAll('[data-year]').forEach((node) => node.textContent = new Date().getFullYear());
	setVersion(fallback); setDownloads(fallback);
	fetch('/version.json', { cache: 'no-store' }).then((response) => response.ok ? response.json() : Promise.reject()).then((data) => { setVersion(data); setDownloads(data); }).catch(() => {});
})();
