
const FALLBACK_VERSION="9.6.0";
const FALLBACK_DOWNLOAD="https://github.com/hawksbat/Benchy/releases/download/v9.6.0/Benchy_Setup.exe";

let targetX=window.innerWidth/2,targetY=window.innerHeight/3,curX=targetX,curY=targetY;
document.addEventListener("pointermove",e=>{targetX=e.clientX;targetY=e.clientY},{passive:true});
function animateGlow(){
  curX+=(targetX-curX)*.08;curY+=(targetY-curY)*.08;
  document.documentElement.style.setProperty("--mx",curX+"px");
  document.documentElement.style.setProperty("--my",curY+"px");
  requestAnimationFrame(animateGlow);
}
animateGlow();

const menuBtn=document.querySelector("[data-menu]");
const mobileMenu=document.querySelector("[data-mobile-menu]");
menuBtn?.addEventListener("click",()=>{
  const open=mobileMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded",String(open));
});
mobileMenu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobileMenu.classList.remove("open")));

document.querySelectorAll("[data-range]").forEach(input=>{
  const out=document.querySelector(`[data-value="${input.dataset.range}"]`);
  input.addEventListener("input",()=>{if(out)out.textContent=input.value+"%"});
});
document.querySelector("[data-reset-screen]")?.addEventListener("click",()=>{
  document.querySelector('[data-range="brightness"]').value=50;
  document.querySelector('[data-range="contrast"]').value=50;
  document.querySelector('[data-value="brightness"]').textContent="50%";
  document.querySelector('[data-value="contrast"]').textContent="50%";
});

const track=document.querySelector("[data-track]");
const slides=[...document.querySelectorAll("[data-slide]")];
const tabs=[...document.querySelectorAll("[data-screen-tab]")];
const title=document.querySelector("[data-carousel-title]");
const desc=document.querySelector("[data-carousel-desc]");
const counter=document.querySelector("[data-carousel-counter]");
const copy=[
  ["Mon PC","Configuration détectée et informations matérielles utiles."],
  ["Jeux","Recherche et recommandations liées à ta configuration."],
  ["Comparer","Performance, prix et rapport performance / €."]
];
let current=0,timer;
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

const carousel=document.querySelector("[data-carousel]");
let touchX=0;
carousel?.addEventListener("touchstart",e=>touchX=e.touches[0].clientX,{passive:true});
carousel?.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].clientX-touchX;
  if(Math.abs(dx)>45){go(current+(dx<0?1:-1));autoplay()}
},{passive:true});

const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target)}
}),{threshold:.1});
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
