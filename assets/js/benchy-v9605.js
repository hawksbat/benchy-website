
const fallbackVersion="9.6.0";
const fallbackDownload="https://github.com/hawksbat/Benchy/releases/download/v9.6.0/Benchy_Setup.exe";

const root=document.documentElement;
const savedTheme=localStorage.getItem("benchy-theme")||"dark";
root.dataset.theme=savedTheme;

const themeToggle=document.querySelector("[data-theme-toggle]");
themeToggle?.addEventListener("click",()=>{
  const next=root.dataset.theme==="dark"?"light":"dark";
  root.dataset.theme=next;
  localStorage.setItem("benchy-theme",next);
  themeToggle.setAttribute("aria-label",next==="dark"?"Activer le mode clair":"Activer le mode sombre");
});

let tx=innerWidth/2,ty=innerHeight/3,cx=tx,cy=ty;
addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY},{passive:true});
(function glow(){
  cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;
  root.style.setProperty("--mx",cx+"px");root.style.setProperty("--my",cy+"px");
  requestAnimationFrame(glow);
})();

const translations={
 fr:{
  navFeatures:"Fonctionnalités",navScreens:"Screens",navPlan:"Plan",navDownload:"Télécharger",
  heroKicker:"BENCHY · WINDOWS",hero1:"Ton PC.",hero2:"Des réponses claires.",
  heroCopy:"Benchy regroupe benchmark, matériel, jeux, monitoring et comparaison dans une interface lisible.",
  downloadBenchy:"Télécharger Benchy",seeFeatures:"Voir les fonctionnalités",
  featureLabel:"Fonctionnalités",featureTitle:"Des outils pensés comme l'app.",featureCopy:"Des contrôles interactifs reprennent les usages principaux de Benchy.",
  screenLabel:"Screens",screenTitle:"L'interface réelle.",screenCopy:"Parcours les pages principales de Benchy.",
  planLabel:"Plan",planTitle:"Benchy+ en achat unique.",planCopy:"Benchy reste gratuit. Benchy+ ajoute les fonctions premium sans abonnement.",
  lifetime:"paiement unique · lifetime",buy:"Acheter Benchy+",included:"Inclus",forever:"À vie",
  paymentTitle:"Benchy+",paymentSub:"19,99 € · paiement unique",paymentNote:"Paiement sécurisé via PayPal",
  downloadTitle:"Télécharger Benchy",official:"Installateur officiel"
 },
 en:{
  navFeatures:"Features",navScreens:"Screens",navPlan:"Plan",navDownload:"Download",
  heroKicker:"BENCHY · WINDOWS",hero1:"Your PC.",hero2:"Clear answers.",
  heroCopy:"Benchy brings benchmarks, hardware, games, monitoring and comparisons into one clear interface.",
  downloadBenchy:"Download Benchy",seeFeatures:"See features",
  featureLabel:"Features",featureTitle:"Tools that feel like the app.",featureCopy:"Interactive controls mirror Benchy's main workflows.",
  screenLabel:"Screens",screenTitle:"The real interface.",screenCopy:"Browse Benchy's main pages.",
  planLabel:"Plan",planTitle:"Benchy+ as a one-time purchase.",planCopy:"Benchy stays free. Benchy+ adds premium features with no subscription.",
  lifetime:"one-time payment · lifetime",buy:"Buy Benchy+",included:"Included",forever:"Lifetime",
  paymentTitle:"Benchy+",paymentSub:"€19.99 · one-time payment",paymentNote:"Secure payment via PayPal",
  downloadTitle:"Download Benchy",official:"Official installer"
 },
 es:{
  navFeatures:"Funciones",navScreens:"Capturas",navPlan:"Plan",navDownload:"Descargar",
  heroKicker:"BENCHY · WINDOWS",hero1:"Tu PC.",hero2:"Respuestas claras.",
  heroCopy:"Benchy reúne benchmark, hardware, juegos, monitorización y comparaciones en una interfaz clara.",
  downloadBenchy:"Descargar Benchy",seeFeatures:"Ver funciones",
  featureLabel:"Funciones",featureTitle:"Herramientas como en la app.",featureCopy:"Los controles interactivos reproducen los usos principales de Benchy.",
  screenLabel:"Capturas",screenTitle:"La interfaz real.",screenCopy:"Explora las principales páginas de Benchy.",
  planLabel:"Plan",planTitle:"Benchy+ con pago único.",planCopy:"Benchy sigue siendo gratis. Benchy+ añade funciones premium sin suscripción.",
  lifetime:"pago único · lifetime",buy:"Comprar Benchy+",included:"Incluido",forever:"De por vida",
  paymentTitle:"Benchy+",paymentSub:"19,99 € · pago único",paymentNote:"Pago seguro con PayPal",
  downloadTitle:"Descargar Benchy",official:"Instalador oficial"
 }
};
function setLang(lang){
  if(!translations[lang])lang="fr";
  localStorage.setItem("benchy-lang",lang);
  root.lang=lang;
  document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n;
    if(translations[lang][key])el.textContent=translations[lang][key];
  });
}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
setLang(localStorage.getItem("benchy-lang")||"fr");

const menuBtn=document.querySelector("[data-menu]");
const mobileMenu=document.querySelector("[data-mobile-menu]");
menuBtn?.addEventListener("click",()=>mobileMenu.classList.toggle("open"));
mobileMenu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobileMenu.classList.remove("open")));

document.querySelectorAll("[data-range]").forEach(input=>{
  const out=document.querySelector(`[data-range-value="${input.dataset.range}"]`);
  input.addEventListener("input",()=>out&&(out.textContent=input.value+"%"));
});
document.querySelector("[data-reset]")?.addEventListener("click",()=>{
  const b=document.querySelector('[data-range="brightness"]'),c=document.querySelector('[data-range="contrast"]');
  if(b)b.value=50;if(c)c.value=50;
  document.querySelector('[data-range-value="brightness"]').textContent="50%";
  document.querySelector('[data-range-value="contrast"]').textContent="50%";
});

const track=document.querySelector("[data-track]");
const slides=[...document.querySelectorAll("[data-slide]")];
const tabs=[...document.querySelectorAll("[data-tab]")];
const cTitle=document.querySelector("[data-carousel-title]");
const cDesc=document.querySelector("[data-carousel-desc]");
const counter=document.querySelector("[data-counter]");
const copy=[
 ["Mon PC","Configuration détectée et informations matérielles utiles."],
 ["Jeux","Recherche et recommandations liées à ta configuration."],
 ["Comparer","Performance, prix et rapport performance / €."]
];
let current=0;
function go(i){
  current=(i+slides.length)%slides.length;
  if(track)track.style.transform=`translateX(-${current*100}%)`;
  tabs.forEach((t,n)=>t.classList.toggle("active",n===current));
  if(cTitle)cTitle.textContent=copy[current][0];
  if(cDesc)cDesc.textContent=copy[current][1];
  if(counter)counter.textContent=`${String(current+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;
}
tabs.forEach((t,i)=>t.addEventListener("click",()=>go(i)));
document.querySelector("[data-prev]")?.addEventListener("click",()=>go(current-1));
document.querySelector("[data-next]")?.addEventListener("click",()=>go(current+1));
go(0);

const dialog=document.querySelector("#paypalDialog");
document.querySelectorAll("[data-buy]").forEach(b=>b.addEventListener("click",()=>dialog?.showModal()));
document.querySelector("[data-close-pay]")?.addEventListener("click",()=>dialog?.close());
dialog?.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());

fetch("./version.json",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{
 const v=d.version||fallbackVersion,u=(typeof d.downloadUrl==="string"&&d.downloadUrl.startsWith("https://"))?d.downloadUrl:fallbackDownload;
 document.querySelectorAll("[data-version]").forEach(el=>el.textContent=v);
 document.querySelectorAll("[data-download]").forEach(el=>el.href=u);
}).catch(()=>document.querySelectorAll("[data-download]").forEach(el=>el.href=fallbackDownload));
