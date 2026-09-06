
const FALLBACK_VERSION="9.6.0";
const FALLBACK_DOWNLOAD="https://github.com/hawksbat/Benchy/releases/download/v9.6.0/Benchy_Setup.exe";

const slides=[...document.querySelectorAll(".slide")];
const title=document.querySelector("[data-slide-title]");
const desc=document.querySelector("[data-slide-desc]");
const counter=document.querySelector("[data-counter]");
const progress=document.querySelector(".progress span");
const labels=[
  ["Mon PC","Une lecture claire de ta configuration, avec scores, classement, stockage et contrôle écran."],
  ["Jeux","Recherche, recommandations et informations liées à la configuration détectée."],
  ["Comparer","Scores, prix et rapport performance par euro dans une seule vue."]
];
let current=0;
let timer=null;

function show(i){
  if(!slides.length)return;
  current=(i+slides.length)%slides.length;
  slides.forEach((s,n)=>s.classList.toggle("active",n===current));
  if(title)title.textContent=labels[current][0];
  if(desc)desc.textContent=labels[current][1];
  if(counter)counter.textContent=String(current+1).padStart(2,"0")+" / "+String(slides.length).padStart(2,"0");
  if(progress)progress.style.transform="translateX("+(current*100)+"%)";
}
function restart(){clearInterval(timer);timer=setInterval(()=>show(current+1),6500)}
document.querySelector("[data-prev]")?.addEventListener("click",()=>{show(current-1);restart()});
document.querySelector("[data-next]")?.addEventListener("click",()=>{show(current+1);restart()});

const carousel=document.querySelector(".carousel");
carousel?.addEventListener("mouseenter",()=>clearInterval(timer));
carousel?.addEventListener("mouseleave",restart);
let startX=0;
carousel?.addEventListener("touchstart",e=>startX=e.touches[0].clientX,{passive:true});
carousel?.addEventListener("touchend",e=>{
  const d=e.changedTouches[0].clientX-startX;
  if(Math.abs(d)>45){show(current+(d<0?1:-1));restart()}
},{passive:true});

const menuBtn=document.querySelector("[data-menu]");
const mobileNav=document.querySelector("[data-mobile-nav]");
menuBtn?.addEventListener("click",()=>{
  const open=mobileNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded",String(open));
});
mobileNav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  mobileNav.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded","false");
}));

const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      io.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());

async function syncVersion(){
  try{
    const r=await fetch("./version.json",{cache:"no-store"});
    if(!r.ok)throw new Error();
    const d=await r.json();
    const v=typeof d.version==="string"&&d.version.trim()?d.version.trim():FALLBACK_VERSION;
    const u=typeof d.downloadUrl==="string"&&d.downloadUrl.startsWith("https://")?d.downloadUrl:FALLBACK_DOWNLOAD;
    document.querySelectorAll("[data-version]").forEach(el=>el.textContent=v);
    document.querySelectorAll("[data-download]").forEach(el=>el.href=u);
  }catch{
    document.querySelectorAll("[data-download]").forEach(el=>el.href=FALLBACK_DOWNLOAD);
  }
}
show(0);restart();syncVersion();
