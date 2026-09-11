const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>[...r.querySelectorAll(q)];
$('[data-year]').textContent=new Date().getFullYear();
const header=$('header');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>18),{passive:true});

const spot=$('[data-spotlight]');
addEventListener('pointermove',e=>{if(spot){spot.style.left=e.clientX+'px';spot.style.top=e.clientY+'px'}},{passive:true});

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});
$$('.reveal').forEach(x=>io.observe(x));

const core=$('[data-count]');
let counted=false;
if(core)new IntersectionObserver(es=>{if(es[0].isIntersecting&&!counted){counted=true;let st=performance.now(),to=+core.dataset.count;requestAnimationFrame(function f(t){const p=Math.min(1,(t-st)/1100),v=Math.round(to*(1-Math.pow(1-p,3)));core.textContent=v.toLocaleString('fr-FR');if(p<1)requestAnimationFrame(f)})}}).observe(core);

const par=$('[data-parallax]');
if(par){
 par.addEventListener('pointermove',e=>{const r=par.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;par.style.transform=`rotateX(${-y*2.8}deg) rotateY(${x*3.5}deg)`});
 par.addEventListener('pointerleave',()=>par.style.transform='');
}

$$('.magnetic').forEach(el=>{
 el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.025}px,${y*.025}px)`});
 el.addEventListener('pointerleave',()=>el.style.transform='');
});

const pics=['/assets/images/benchy-pc.png','/assets/images/benchy-games.png','/assets/images/benchy-compare.png'];
$$('[data-peek]').forEach(b=>b.onclick=()=>{
 $$('[data-peek]').forEach(x=>x.classList.remove('active'));
 b.classList.add('active');
 const img=$('[data-peek-img]');
 img.style.opacity='.12';
 setTimeout(()=>{img.src=pics[+b.dataset.peek];img.style.opacity='.45'},120);
});

const dlg=$('#paypalDialog');
$$('[data-buy]').forEach(b=>b.onclick=()=>dlg?.showModal());
$('[data-close-pay]')?.addEventListener('click',()=>dlg.close());

if(window.lucide)lucide.createIcons({attrs:{'stroke-width':1.6}});

// GitHub latest release remains the single source of truth.
fetch('https://api.github.com/repos/hawksbat/Benchy/releases/latest',{cache:'no-store'})
 .then(r=>r.ok?r.json():Promise.reject())
 .then(rel=>{
   const v=(rel.tag_name||'').replace(/^v/i,'');
   const assets=rel.assets||[];
   const escaped=v.replaceAll('.','\\.');
   const exe=assets.find(a=>new RegExp(`^Benchy[_-]?${escaped}\\.exe$`,'i').test(a.name))||assets.find(a=>/^Benchy.*\.exe$/i.test(a.name));
   if(v)$$('[data-version]').forEach(e=>e.textContent=v);
   if(exe)$$('[data-download]').forEach(e=>e.href=exe.browser_download_url);
 }).catch(()=>{});

const menuToggle=document.querySelector('[data-menu-toggle]');
const mobileMenu=document.querySelector('[data-mobile-menu]');
if(menuToggle&&mobileMenu){
  const closeMenu=()=>{
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded','false');
  };
  menuToggle.addEventListener('click',()=>{
    const open=!mobileMenu.classList.contains('open');
    menuToggle.classList.toggle('active',open);
    mobileMenu.classList.toggle('open',open);
    document.body.classList.toggle('menu-open',open);
    menuToggle.setAttribute('aria-expanded',String(open));
  });
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  window.addEventListener('resize',()=>{if(innerWidth>900)closeMenu()});
}
