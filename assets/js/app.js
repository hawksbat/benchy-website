
const FALLBACK_VERSION="9.6.0";
const FALLBACK_DOWNLOAD="https://github.com/hawksbat/Benchy/releases/download/v9.6.0/Benchy_Setup.exe";

document.addEventListener("pointermove",e=>{
  document.documentElement.style.setProperty("--mx",e.clientX+"px");
  document.documentElement.style.setProperty("--my",e.clientY+"px");
},{passive:true});

const menuBtn=document.querySelector("[data-menu]");
const mobileMenu=document.querySelector("[data-mobile-menu]");
menuBtn?.addEventListener("click",()=>{
  const open=mobileMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded",String(open));
});
mobileMenu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  mobileMenu.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded","false");
}));

const track=document.querySelector("[data-track]");
const slides=[...document.querySelectorAll("[data-slide]")];
const tabs=[...document.querySelectorAll("[data-tab]")];
const title=document.querySelector("[data-carousel-title]");
const desc=document.querySelector("[data-carousel-desc]");
const counter=document.querySelector("[data-carousel-counter]");
const copy=[
  ["Mon PC","Configuration, scores et informations utiles réunis dans une seule vue."],
  ["Jeux","Recherche et recommandations liées à ta configuration."],
  ["Comparer","Scores, prix et rapport performance / € pour comparer plus simplement."]
];
let current=0;
let timer;

function go(i){
  if(!slides.length)return;
  current=(i+slides.length)%slides.length;
  if(track)track.style.transform=`translateX(-${current*100}%)`;
  tabs.forEach((t,n)=>t.classList.toggle("active",n===current));
  if(title)title.textContent=copy[current][0];
  if(desc)desc.textContent=copy[current][1];
  if(counter)counter.textContent=`${String(current+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;
}
function autoplay(){clearInterval(timer);timer=setInterval(()=>go(current+1),6500)}
document.querySelector("[data-prev]")?.addEventListener("click",()=>{go(current-1);autoplay()});
document.querySelector("[data-next]")?.addEventListener("click",()=>{go(current+1);autoplay()});
tabs.forEach((t,i)=>t.addEventListener("click",()=>{go(i);autoplay()}));

let x=0;
const carousel=document.querySelector("[data-carousel]");
carousel?.addEventListener("touchstart",e=>x=e.touches[0].clientX,{passive:true});
carousel?.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].clientX-x;
  if(Math.abs(dx)>45){go(current+(dx<0?1:-1));autoplay()}
},{passive:true});
carousel?.addEventListener("mouseenter",()=>clearInterval(timer));
carousel?.addEventListener("mouseleave",autoplay);

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
go(0);autoplay();syncVersion();
