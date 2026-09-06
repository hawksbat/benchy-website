const FALLBACK_VERSION = "9.6.0";
const FALLBACK_DOWNLOAD = "https://github.com/hawksbat/Benchy/releases/download/v9.6.0/Benchy_Setup.exe";

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 8);
}, { passive:true });

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
menuButton?.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});
mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}));

const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".carousel-dot"));
const title = document.querySelector("[data-caption-title]");
const text = document.querySelector("[data-caption-text]");
const captions = [
  ["Mon PC", "CPU, GPU, RAM, stockage et écran réunis dans une vue simple."],
  ["Jeux", "Un catalogue clair pour voir les jeux et comprendre ce qui convient à ta configuration."],
  ["Comparer", "Performances, prix et rapport perf/€ comparés sans tableau illisible."]
];

let current = 0;
let autoplay;

function renderSlide(index) {
  if (!slides.length) return;
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === current);
    slide.setAttribute("aria-hidden", i === current ? "false" : "true");
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
    dot.setAttribute("aria-current", i === current ? "true" : "false");
  });
  if (title) title.textContent = captions[current][0];
  if (text) text.textContent = captions[current][1];
}

function startAutoplay() {
  clearInterval(autoplay);
  autoplay = setInterval(() => renderSlide(current + 1), 6500);
}

document.querySelector("[data-prev]")?.addEventListener("click", () => { renderSlide(current - 1); startAutoplay(); });
document.querySelector("[data-next]")?.addEventListener("click", () => { renderSlide(current + 1); startAutoplay(); });
dots.forEach((dot, i) => dot.addEventListener("click", () => { renderSlide(i); startAutoplay(); }));

const carousel = document.querySelector(".carousel");
carousel?.addEventListener("mouseenter", () => clearInterval(autoplay));
carousel?.addEventListener("mouseleave", startAutoplay);

let touchStartX = 0;
carousel?.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive:true });
carousel?.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 45) {
    renderSlide(current + (dx < 0 ? 1 : -1));
    startAutoplay();
  }
}, { passive:true });

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") renderSlide(current - 1);
  if (e.key === "ArrowRight") renderSlide(current + 1);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold:.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

async function syncVersion() {
  try {
    const res = await fetch("/version.json", { cache:"no-store" });
    if (!res.ok) throw new Error("version");
    const data = await res.json();
    const version = typeof data.version === "string" && data.version.trim() ? data.version.trim() : FALLBACK_VERSION;
    const url = typeof data.downloadUrl === "string" && /^https:\/\//.test(data.downloadUrl) ? data.downloadUrl : FALLBACK_DOWNLOAD;
    document.querySelectorAll("[data-version]").forEach(el => el.textContent = version);
    document.querySelectorAll("[data-download]").forEach(el => el.href = url);
  } catch {
    document.querySelectorAll("[data-version]").forEach(el => el.textContent = FALLBACK_VERSION);
    document.querySelectorAll("[data-download]").forEach(el => el.href = FALLBACK_DOWNLOAD);
  }
}
syncVersion();
renderSlide(0);
startAutoplay();
