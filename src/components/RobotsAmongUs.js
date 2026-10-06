// ponytail: lifted from "Robots Among Us v2.html" as plain JS (unchecked by
// astro check); port to TS if it starts growing.
import data from '../data/robots-among-us.json';

const ROBOTS=data.robots;
const IMAGES=data.images;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// the design style is read as the deal a robot offers: what it asks you to treat it as
const CONTRACTS={
  lifelike:{name:'Person',look:'Lifelike',ask:'Treat me like a person.',you:'talk · mirror · empathise',risk:'Uncanny valley, deception, and social obligation toward a product.'},
  character:{name:'Creature',look:'Playful',ask:'Care for me like a creature.',you:'play · nurture · name it',risk:'Real attachment, but honestly non-human: it never pretends to be one of us.'},
  sleek:{name:'Tool',look:'Sleek',ask:'Use me like a device.',you:'command · schedule · replace',risk:'Trust rests on useful, dependable behaviour rather than a simulated personality.'},
  functional:{name:'Machine',look:'Functional',ask:'Work around me.',you:'step aside · supervise',risk:'Trust rests on reliable function and safe physical interaction, including in the home.'},
};
const STAGES={on:'Product / service',early:'Pilot / dev kit',proto:'Prototype',legacy:'Discontinued',unknown:'Unverified'};
const stageOf=s=>({consumer:'on',business:'on',developer:'early',early:'early',legacy:'legacy',unknown:'unknown'}[s]||'proto');
const STATUS={consumer:'Consumer product',business:'Commercial / B2B',developer:'Developer platform',early:'Early access / pilot',prototype:'Prototype / announced',legacy:'Historical / discontinued',unknown:'Availability unverified'};
const RINGS={5:'Care & reliance',4:'Social bonds',3:'Shared routines',2:'Public encounters',1:'Background work'};
const RINGSHORT={5:'Care',4:'Bonds',3:'Routines',2:'Encounters',1:'Background'};

function bodyOf(r){
  if(r.style==='lifelike')return 'lifelike';
  if(r.form==='biped')return r.style==='character'?'playful':'sleek';
  if(r.form==='hybrid')return 'playful';
  if(r.form==='wheeled')return 'half';
  if(r.form==='quadruped')return 'quad';
  if(r.form==='desktop'||r.form==='special')return 'beyond';
  return null; // unidentified image stays off the map
}
// sectors run clockwise from the east gutter; kin sits next to kin
const MODES={
  body:{of:bodyOf,sectors:[
    {id:'beyond',name:'Beyond the humanoid',sub:'pets · desk bots · carts · cleaners'},
    {id:'quad',name:'Quadrupeds',sub:'robot dogs, pets & field platforms'},
    {id:'playful',name:'Playful humanoids',sub:'off the human template, on purpose'},
    {id:'lifelike',name:'Lifelike humanoids',sub:'cloning human appearance'},
    {id:'sleek',name:'Sleek humanoids',sub:'white-grey, chasing the iPhone moment'},
    {id:'half',name:'Half-humanoids',sub:'torso up top, wheels below'},
  ],fams:[{name:'THE HUMANOID FAMILY',ids:['playful','lifelike','sleek']}]},
  // the gutter now splits the two extremes: person on one side, machine on the other
  rel:{of:r=>r.style,sectors:['functional','sleek','character','lifelike'].map(k=>({id:k,name:'As a '+CONTRACTS[k].name.toLowerCase(),sub:'you '+CONTRACTS[k].you.replaceAll(' · ',', ')})),
    fams:[{name:'ASKS TO BE USED',ids:['functional','sleek']},{name:'ASKS TO BE TREATED SOCIALLY',ids:['character','lifelike']}]},
};
const SHORT={unitreeg1:'Unitree G1',unitreer1:'Unitree R1',boostert1:'Booster T1',hsr:'Toyota HSR',starship:'Starship',serve:'Serve',labrador:'Retriever',somatic:'Somatic',codey:'Mindbot',realbotix:'Aria',goat:'Goat bot',riba:'RIBA',lynx:'LYNX M20',galbot:'Galbot G1',agibotg2:'AGIBOT G2',g1d:'Unitree G1-D',neo:'NEO'};
const label=r=>SHORT[r.id]||r.name.split(/ · | \/ /)[0];
const imgOf=r=>{const k=r.images[0]??r.photo;return k?IMAGES[k]:null};
const bots=ROBOTS.map(r=>({...r,body:bodyOf(r),stage:stageOf(r.status)})).filter(r=>r.body&&r.close>0&&CONTRACTS[r.style]);

/* geometry, in viewBox units */
const C=720, GUT=.22, ZIG=5;
let SPACING=94; // cells of ZIG+ robots pack in a zigzag
const BAND={5:[92,200],4:[200,315],3:[315,425],2:[425,515],1:[515,612]};
const mid=k=>(BAND[k][0]+BAND[k][1])/2;
const P=(r,a)=>[C+r*Math.cos(a),C+r*Math.sin(a)];
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))%997;return h/997};
const stepOf=(n,k)=>(n>=ZIG?.66:1)*SPACING/mid(k);
const arc=(r,a0,a1)=>{const[x0,y0]=P(r,a0),[x1,y1]=P(r,a1);return `M${x0} ${y0}A${r} ${r} 0 ${a1-a0>Math.PI?1:0} 1 ${x1} ${y1}`};
const arcRev=(r,a0,a1)=>{const[x0,y0]=P(r,a0),[x1,y1]=P(r,a1);return `M${x1} ${y1}A${r} ${r} 0 ${a1-a0>Math.PI?1:0} 0 ${x0} ${y0}`};

const svg=document.getElementById('bg'), orbit=document.getElementById('orbit');
// --u = viewBox units per screen px, so chart text can hold a readable on-screen size
new ResizeObserver(()=>orbit.style.setProperty('--u',1440/orbit.clientWidth)).observe(orbit);
orbit.insertAdjacentHTML('beforeend',bots.map((b,i)=>{const im=imgOf(b);const pos=['biped','wheeled','hybrid'].includes(b.form)?'50% 14%':'50% 50%';
  return `<button class="bot ${b.stage} c-${b.style}" data-id="${b.id}" style="--c:var(--${b.style});--d:${(i%9)*35}ms" aria-label="${esc(b.name)}, ${esc(b.maker)}: asks to be treated as a ${CONTRACTS[b.style].name.toLowerCase()}, ${RINGS[b.close]}, ${STATUS[b.status]}"><span class="ph">${im?`<img src="${im.src}" alt="" loading="lazy" decoding="async" style="object-position:${pos}">`:`<span class="initial">${esc(label(b).slice(0,2))}</span>`}</span><span class="nm">${esc(label(b))}</span></button>`}).join(''));

function layout(mode){
  const M=MODES[mode], S=M.sectors;
  const cell=(s,k)=>bots.filter(b=>M.of(b)===s.id&&b.close===k);
  // each sector gets the angle its most crowded ring needs, then the slack is shared out
  const needs=()=>S.map(s=>Math.max(.46,...[1,2,3,4,5].map(k=>cell(s,k).length*stepOf(cell(s,k).length,k)))+.13);
  SPACING=94;
  while(needs().reduce((a,b)=>a+b,0)>2*Math.PI-GUT&&SPACING>30)SPACING-=1;
  const need=needs();
  orbit.style.setProperty('--bot-size',(SPACING*.74/14.4)+'cqw');
  const scale=(2*Math.PI-GUT)/need.reduce((a,b)=>a+b,0);
  let a=GUT/2;
  S.forEach((s,i)=>{s.a0=a;a+=need[i]*scale;s.a1=a;s.n=bots.filter(b=>M.of(b)===s.id).length});
  for(const s of S)for(const k of [1,2,3,4,5]){
    const c=cell(s,k);if(!c.length)continue;
    // use the wedge's spare room first; zigzag only when one row can't fit
    const r=mid(k), span=s.a1-s.a0-.10, zig=c.length>=ZIG;
    const step=Math.min(span/c.length,stepOf(c.length,k)*1.05), slack=Math.max(0,span-c.length*step);
    const centre=(s.a0+s.a1)/2+(k%2?1:-1)*(.2+hash(s.id+k)*.2)*slack; // neighbouring rings lean opposite ways
    c.forEach((b,i)=>{
      const rad=r+(zig?(i%2?26:-26):c.length>2?(i%2?10:-10):(hash(b.id)-.5)*14); // stagger so labels breathe
      const[x,y]=P(rad,centre+(i-(c.length-1)/2)*step);
      b.x=x;b.y=y;b.angle=centre+(i-(c.length-1)/2)*step;
      const el=orbit.querySelector(`[data-id="${b.id}"]`);el.style.left=x/14.4+'%';el.style.top=y/14.4+'%';
    });
  }
  let g='';
  [1,2,3,4,5].forEach(k=>g+=`<circle class="band" cx="${C}" cy="${C}" r="${BAND[k][1]}" fill="var(--r${k})"/>`);
  g+=`<circle cx="${C}" cy="${C}" r="${BAND[5][0]}" fill="var(--r5)" class="band"/>`;
  [...S.map(s=>s.a0),S.at(-1).a1].forEach(t=>{const[x0,y0]=P(BAND[5][0],t),[x1,y1]=P(BAND[1][1],t);g+=`<line class="divider" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`});
  // gutter: wipe the wedge, write ring names along the east axis
  const R=BAND[1][1]+2;
  g+=`<path d="M${C} ${C}L${P(R,-GUT/2).join(' ')}A${R} ${R} 0 0 1 ${P(R,GUT/2).join(' ')}Z" fill="var(--bg)"/>`;
  // neighbouring rings alternate above/below the axis so long names never collide
  const above=`y="${C-3}" dominant-baseline="text-after-edge"`, below=`y="${C+3}" dominant-baseline="text-before-edge"`;
  [1,2,3,4,5].forEach(k=>g+=`<text class="ringlbl" x="${C+mid(k)}" ${k%2?above:below} text-anchor="middle">${RINGSHORT[k]}</text>`);
  g+=`<text class="ringlbl" x="${C+R+12}" ${below}>→ far</text>`;
  g+=`<g class="you" transform="translate(${C} ${C-6})"><circle cy="-22" r="14"/><path d="M-26 28c0-26 10-36 26-36s26 10 26 36z"/></g><text class="ringlbl" x="${C}" y="${C+50}" text-anchor="middle" style="fill:var(--ink)">you</text>`;
  // sector names on the rim; bottom half reversed so text stays upright
  S.forEach((s,i)=>{
    const m=(s.a0+s.a1)/2, bottom=Math.sin(m)>0.05, a0=s.a0+.01, a1=s.a1-.01;
    g+=`<path id="s${i}" d="${bottom?arcRev(650,a0,a1):arc(636,a0,a1)}" fill="none"/><path id="t${i}" d="${bottom?arcRev(672,a0,a1):arc(658,a0,a1)}" fill="none"/>`;
    g+=`<text class="seclbl"><textPath href="#s${i}" startOffset="50%" text-anchor="middle">${esc(s.name)} · ${s.n}</textPath></text>`;
    g+=`<text class="secsub"><textPath href="#t${i}" startOffset="50%" text-anchor="middle">${esc(s.sub)}</textPath></text>`;
  });
  // brackets group wedges into families
  M.fams.forEach((f,j)=>{
    const fs=S.filter(s=>f.ids.includes(s.id)), fa0=fs[0].a0+.02, fa1=fs.at(-1).a1-.02, bottom=Math.sin((fa0+fa1)/2)>0.05;
    g+=`<path class="famarc" d="${arc(690,fa0,fa1)}"/><path id="f${j}" d="${bottom?arcRev(712,fa0,fa1):arc(702,fa0,fa1)}" fill="none"/>`;
    [fa0,fa1].forEach(t=>{const[x0,y0]=P(680,t),[x1,y1]=P(690,t);g+=`<line class="famarc" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>`});
    g+=`<text class="fam"><textPath href="#f${j}" startOffset="50%" text-anchor="middle">${f.name} · ${fs.reduce((n,s)=>n+s.n,0)}</textPath></text>`;
  });
  svg.innerHTML=g;
}

/* sector zoom */
const viewport=document.getElementById('viewport'), secBar=document.getElementById('sectors'), zoomBtn=document.getElementById('zoom');
let sector=null;
function zoomTo(id){
  const M=MODES[mode], s=M.sectors.find(x=>x.id===id);
  sector=s?id:null;
  secBar.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sector===(sector??'')));
  viewport.classList.toggle('sector',!!s);
  bots.forEach(b=>orbit.querySelector(`[data-id="${b.id}"]`).classList.toggle('out',!!s&&M.of(b)!==id));
  if(!s){orbit.style.transform='';return}
  enlarge(false);
  // bounding box of the wedge, inner ring to rim labels
  const pts=[];for(let i=0;i<=24;i++){const t=s.a0+(s.a1-s.a0)*i/24;pts.push(P(BAND[5][0],t),P(690,t))}
  const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]), x0=Math.min(...xs), x1=Math.max(...xs), y0=Math.min(...ys), y1=Math.max(...ys);
  const k=Math.min(4,1440/(x1-x0+40),1440/(y1-y0+40));
  orbit.style.transform=`translate(50%,50%) scale(${k}) translate(${-(x0+x1)/28.8}%,${-(y0+y1)/28.8}%)`;
}
function enlarge(v){viewport.classList.toggle('zoomed',v);zoomBtn.setAttribute('aria-pressed',v);zoomBtn.textContent=v?'Fit chart':'Enlarge chart'}
secBar.addEventListener('click',e=>{const b=e.target.closest('[data-sector]');if(b)zoomTo(b.dataset.sector||null)});
svg.addEventListener('click',e=>{
  const r=svg.getBoundingClientRect(), x=(e.clientX-r.left)/r.width*1440-C, y=(e.clientY-r.top)/r.height*1440-C, d=Math.hypot(x,y);
  let a=Math.atan2(y,x);if(a<0)a+=2*Math.PI;
  const s=d>BAND[5][0]&&d<712&&MODES[mode].sectors.find(s=>a>=s.a0&&a<s.a1);
  zoomTo(s&&s.id!==sector?s.id:null); // same wedge or outside the rings zooms back out
});

/* arrange toggle */
let mode=location.hash==='#relationship'?'rel':'body';
const modeBtns=document.querySelectorAll('[data-mode]');
function setMode(m,animate){
  mode=m;modeBtns.forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m));
  secBar.innerHTML='<span>Zoom</span><button data-sector="">All</button>'+MODES[m].sectors.map(s=>`<button data-sector="${s.id}">${esc(s.name)} · ${bots.filter(b=>MODES[m].of(b)===s.id).length}</button>`).join('');
  zoomTo(null);
  if(!animate)return layout(m);
  svg.style.opacity=0;setTimeout(()=>{layout(m);svg.style.opacity=1},250);
}
modeBtns.forEach(b=>b.onclick=()=>b.dataset.mode!==mode&&setMode(b.dataset.mode,true));
setMode(mode,false);
requestAnimationFrame(()=>requestAnimationFrame(()=>orbit.classList.add('ready')));

/* legend + filters */
const on={style:new Set(Object.keys(CONTRACTS)),stage:new Set(Object.keys(STAGES))};
const ALL={style:Object.keys(CONTRACTS),stage:Object.keys(STAGES)};
const n=f=>bots.filter(f).length;
document.getElementById('f-style').innerHTML=Object.entries(CONTRACTS).map(([k,c])=>`<button class="chip" data-f="style" data-v="${k}" aria-pressed="true"><i class="c-${k}" style="--c:var(--${k})"></i><span><b>${c.name}</b> · ${c.look} · ${n(b=>b.style===k)}<small>${c.ask} You ${c.you}.</small></span></button>`).join('');
document.getElementById('f-stage').innerHTML=Object.entries(STAGES).map(([k,s])=>`<button class="chip" data-f="stage" data-v="${k}" aria-pressed="true"><i class="${k}"></i>${s} · ${n(b=>b.stage===k)}</button>`).join('');
document.getElementById('ringkey').innerHTML=[5,4,3,2,1].map(k=>`<span style="background:var(--r${k});border:1px solid var(--line)"></span><span><b>${RINGS[k]}</b> · ${n(b=>b.close===k)}</span>`).join('');
document.getElementById('stats').innerHTML=`<div><b>${bots.length}</b>robots</div><div><b>4</b>contracts</div><div><b>${n(b=>b.stage==='on')}</b>products / services</div>`;
document.querySelectorAll('.chip[data-f]').forEach(c=>c.onclick=()=>{
  const f=c.dataset.f,set=on[f],v=c.dataset.v;
  // first click isolates a value; later clicks toggle; emptying a group restores it
  if(set.size===ALL[f].length){set.clear();set.add(v)}else if(set.has(v))set.delete(v);else set.add(v);
  if(!set.size)ALL[f].forEach(x=>set.add(x));
  document.querySelectorAll(`.chip[data-f="${f}"]`).forEach(x=>x.setAttribute('aria-pressed',set.has(x.dataset.v)));
  applyFilters();
});

/* side card: takeaways at rest, profile on click */
const side=document.getElementById('side');
const core=bots.filter(b=>b.close>=4), social=b=>b.style==='lifelike'||b.style==='character';
const TAKE=`<p class="k">What the expanded orbit shows</p><ul class="take">
<li><b>Closeness has more than one form.</b>${n(b=>b.close>=4&&social(b))} of ${core.length} entries in the inner rings invite a social bond. Assistive devices such as Obi and Labrador Retriever also aim for close reliance through physical support.</li>
<li><b>A friendly face can have a practical job.</b>Delivery robots and hospital logistics platforms can look like creatures while remaining in the public-encounter ring. Appearance and intended relationship are separate design choices.</li>
<li><b>Hardware availability is not task readiness.</b>${n(b=>b.stage==='early')} entries are pilots, early-access programs or developer platforms. Buying a robot body does not establish reliable household autonomy.</li>
</ul><p class="checked">This is a curated map of intended relationships, not a ranking of intelligence or a complete market census.</p>`;
function show(id){
  document.querySelectorAll('.bot').forEach(el=>el.classList.toggle('on',el.dataset.id===id));
  const b=bots.find(x=>x.id===id);
  if(!b){side.innerHTML=TAKE;return}
  const im=imgOf(b), body=MODES.body.sectors.find(s=>s.id===b.body), c=CONTRACTS[b.style];
  side.innerHTML=`<div class="detail" style="--c:var(--${b.style})"><button class="close" id="back">× close</button><p class="k">${esc(body.name)}${b.form==='wheeled'&&b.body!=='half'?' · on wheels':''}</p>
  ${im?`<img src="${im.src}" alt="${esc(b.name)}">`:''}<h2>${esc(b.name)}</h2><p class="maker">${esc(b.maker)} · ${esc(b.role)}</p>
  <div class="chips"><span class="chip"><i class="c-${b.style}" style="--c:var(--${b.style})"></i>${c.name} contract</span><span class="chip"><i class="${b.stage}" style="--c:var(--${b.style})"></i>${STATUS[b.status]}</span></div>
  <div class="deal"><b>“${c.ask}”</b>You ${c.you}. ${c.risk}</div>
  <h3>Closeness · ${RINGS[b.close]}</h3><div class="pips">${[1,2,3,4,5].map(k=>`<i class="${k<=b.close?'on':''}"></i>`).join('')}</div>
  <p>${esc(b.description)}</p><h3>Why this ring</h3><p>${esc(b.reason)}</p><h3>Reality check</h3><p>${esc(b.reality)}</p>
  <p class="checked">Sources checked ${esc(b.checked || 'date not recorded')} · ${esc(b.origin || 'Research')}. Ring and contract: editorial interpretation.</p><h3>Sources</h3><div class="links">${b.website?`<a href="${esc(b.website)}" target="_blank" rel="noopener">Official site ↗</a>`:''}${b.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)} ↗</a>`).join('')}${b.photoSource?`<a href="${esc(b.photoSource)}" target="_blank" rel="noopener">Photo · ${esc(b.photoCredit || b.maker)} ↗</a>`:''}</div></div>`;
  document.getElementById('back').onclick=()=>show(null);
}
orbit.addEventListener('click',e=>{const el=e.target.closest('.bot');if(!el)return;show(el.classList.contains('on')?null:el.dataset.id);
  if(matchMedia('(max-width:1050px)').matches)side.scrollIntoView({behavior:'smooth',block:'start'})});
document.addEventListener('keydown',e=>{if(e.key==='Escape')show(null)});
show(null);

/* Search provides readable, keyboard-accessible access to every profile. */
const search=document.getElementById('search'), results=document.getElementById('search-results');
function applyFilters(){
  const q=search.value.trim().toLocaleLowerCase();
  const matches=bots.filter(b=>on.style.has(b.style)&&on.stage.has(b.stage)&&(!q||[b.name,b.maker,b.role,b.description].join(' ').toLocaleLowerCase().includes(q)));
  const ids=new Set(matches.map(b=>b.id));
  document.querySelectorAll('.bot').forEach(el=>el.classList.toggle('dim',!ids.has(el.dataset.id)));
  document.getElementById('search-count').textContent=q?`${matches.length} matching robots`:`${matches.length} of ${bots.length} robots highlighted`;
  results.innerHTML=q?matches.map(b=>`<button class="result" data-result="${b.id}"><b>${esc(b.name)}</b><small>${esc(b.maker)} · ${esc(b.role)}</small></button>`).join(''):'';
}
search.addEventListener('input',applyFilters);
results.addEventListener('click',e=>{const el=e.target.closest('[data-result]');if(el){show(el.dataset.result);if(matchMedia('(max-width:1050px)').matches)side.scrollIntoView({behavior:'smooth',block:'start'})}});
zoomBtn.onclick=()=>{zoomTo(null);enlarge(!viewport.classList.contains('zoomed'))};
applyFilters();
