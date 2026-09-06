const FALLBACK_VERSION = "9.6.0";
const FALLBACK_DOWNLOAD = "https://github.com/hawksbat/Benchy/releases/download/v9.6.0/Benchy_Setup.exe";

lucide.createIcons();

const menu = document.querySelector("[data-menu]");
const mobile = document.querySelector("[data-mobile-nav]");
menu?.addEventListener("click", () => {
  const open = mobile.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});

const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".dot")];
const title = document.querySelector("[data-slide-title]");
const text = document.querySelector("[data-slide-text]");
const labels = [
  ["Mon PC","Ta configuration détectée, classée et expliquée sans liste interminable de specs."],
  ["Jeux","Un catalogue visuel avec recommandations et compatibilité selon ta machine."],
  ["Comparer","Performance brute, prix médian et perf/€ réunis dans la même comparaison."]
];
let index = 0;
let timer;

function showSlide(i){
  if(!slides.length) return;
  index=(i+slides.length)%slides.length;
  slides.forEach((s,n)=>s.classList.toggle("active",n===index));
  dots.forEach((d,n)=>d.classList.toggle("active",n===index));
  if(title) title.textContent=labels[index][0];
  if(text) text.textContent=labels[index][1];
}
function autoplay(){ clearInterval(timer); timer=setInterval(()=>showSlide(index+1),6500); }

document.querySelector("[data-prev]")?.addEventListener("click",()=>{showSlide(index-1);autoplay()});
document.querySelector("[data-next]")?.addEventListener("click",()=>{showSlide(index+1);autoplay()});
dots.forEach((d,i)=>d.addEventListener("click",()=>{showSlide(i);autoplay()}));

const car=document.querySelector(".carousel");
car?.addEventListener("mouseenter",()=>clearInterval(timer));
car?.addEventListener("mouseleave",autoplay);

let x0=0;
car?.addEventListener("touchstart",e=>x0=e.touches[0].clientX,{passive:true});
car?.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].clientX-x0;
  if(Math.abs(dx)>45){showSlide(index+(dx<0?1:-1));autoplay()}
},{passive:true});

async function syncVersion(){
  try{
    const r=await fetch("/version.json",{cache:"no-store"});
    if(!r.ok) throw 0;
    const d=await r.json();
    const v=typeof d.version==="string"&&d.version.trim()?d.version:FALLBACK_VERSION;
    const u=typeof d.downloadUrl==="string"&&/^https:\/\//.test(d.downloadUrl)?d.downloadUrl:FALLBACK_DOWNLOAD;
    document.querySelectorAll("[data-version]").forEach(el=>el.textContent=v);
    document.querySelectorAll("[data-download]").forEach(el=>el.href=u);
  }catch{
    document.querySelectorAll("[data-download]").forEach(el=>el.href=FALLBACK_DOWNLOAD);
  }
}
document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());

showSlide(0);
autoplay();
syncVersion();
