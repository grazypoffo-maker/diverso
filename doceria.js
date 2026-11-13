const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const cards=[...document.querySelectorAll('.product')];const catalog=document.querySelector('#products');
const params=new URLSearchParams(location.search);const filters=[...document.querySelectorAll('[data-filter]')];let category=params.get('categoria')||'Todos';if(!filters.some(b=>b.dataset.filter===category))category='Todos';
const search=document.querySelector('#search');
function filterProducts(){if(!catalog)return;const query=normalize(search.value.trim());let count=0;for(const card of cards){const show=(category==='Todos'||card.dataset.category===category)&&normalize(card.dataset.name+' '+card.dataset.category+' '+card.querySelector('p').textContent).includes(query);card.hidden=!show;if(show)count++}for(const button of filters){const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))}document.querySelector('#result-count').textContent=`${count} ${count===1?'doce para descobrir':'doces para descobrir'}`;document.querySelector('#no-results').hidden=count>0}
if(catalog){for(const b of filters)b.addEventListener('click',()=>{category=b.dataset.filter;const url=new URL(location.href);if(category==='Todos')url.searchParams.delete('categoria');else url.searchParams.set('categoria',category);history.replaceState(null,'',url);filterProducts()});search.addEventListener('input',filterProducts);document.querySelector('#clear-search').addEventListener('click',()=>{category='Todos';search.value='';history.replaceState(null,'',location.pathname);filterProducts();search.focus()});filterProducts()}
const dialog=document.querySelector('#product-dialog');let trigger;
function closeDialog(){dialog.close();document.documentElement.style.overflow='';trigger?.focus()}
for(const card of cards){card.querySelector('[data-detail]').addEventListener('click',e=>{trigger=e.currentTarget;const content=document.querySelector('#dialog-content');content.replaceChildren();const layout=document.createElement('div');layout.className='dialog-layout';const image=card.querySelector('img').cloneNode();image.removeAttribute('loading');const copy=document.createElement('div');copy.className='dialog-copy';const kicker=card.querySelector('.kicker').cloneNode(true);const heading=document.createElement('h2');heading.id='dialog-title';heading.textContent=card.dataset.name;const desc=card.querySelector('p').cloneNode(true);const order=card.querySelector('a').cloneNode(true);const note=document.createElement('p');note.className='note';note.textContent='Consulte preços, disponibilidade e informações sobre ingredientes com a doceria antes de pedir.';copy.append(kicker,heading,desc,order,note);layout.append(image,copy);content.append(layout);if(typeof dialog.showModal==='function'){dialog.showModal();document.documentElement.style.overflow='hidden'}else location.href=order.href})}
if(dialog){dialog.querySelector('.dialog-close').addEventListener('click',closeDialog);dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()});dialog.addEventListener('close',()=>{document.documentElement.style.overflow=''});dialog.addEventListener('cancel',()=>{document.documentElement.style.overflow=''})}
// Menu Mais: fechar ao clicar fora ou apertar Escape, sem bloquear o teclado.
const moreMenu=document.querySelector('.more-nav');if(moreMenu){document.addEventListener('click',e=>{if(!moreMenu.contains(e.target))moreMenu.open=false});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&moreMenu.open){moreMenu.open=false;moreMenu.querySelector('summary').focus()}})}
const navigation=document.querySelector('.nav-bar');if(navigation){const syncNavigationHeight=()=>{document.documentElement.style.setProperty('--story-top',`${Math.ceil(navigation.getBoundingClientRect().height)+(innerWidth<=760?24:48)}px`)};syncNavigationHeight();if('ResizeObserver'in window)new ResizeObserver(syncNavigationHeight).observe(navigation);addEventListener('resize',syncNavigationHeight)}
// Montagem vetorial do chocotone: valores determinísticos, sem capturar a rolagem.
function cakeStateAt(progress){
 const clamp=v=>Math.max(0,Math.min(1,v));const p=clamp(progress);const range=(a,b)=>{const x=clamp((p-a)/(b-a));return x*x*(3-2*x)};
 return{p,phase:Math.min(4,Math.floor(p*5)),arrive:range(0,.13),knife:range(.13,.3),knifeOpacity:range(.13,.17)*(1-range(.27,.34)),open:range(.24,.41),lidOpacity:1-range(.46,.63),fill:range(.37,.61),bagOpacity:range(.34,.41)*(1-range(.61,.68)),cover:range(.63,.82),garnish:range(.82,.96),sparkles:range(.92,1)};
}
const cakeSection=document.querySelector('.cake-scroll');
if(cakeSection){
 const stage=cakeSection.querySelector('.cake-stage');const svg=cakeSection.querySelector('.panettone-svg');const controls=[...cakeSection.querySelectorAll('[data-cake-step]')];const status=cakeSection.querySelector('.cake-phase');
 const labels=['O chocotone','A tampa se abre','Entra o recheio','Um banho de chocolate','O toque final'];const staticMode=matchMedia('(prefers-reduced-motion: reduce), (max-height: 520px)');const parts={};svg.querySelectorAll('[data-cake]').forEach(el=>{parts[el.dataset.cake]=el});let shown=null,target=0,raf=0,lastTime=0,lastPhase=-1;
 const set=(part,attribute,value)=>parts[part]?.setAttribute(attribute,String(value));
 function draw(p){
  const s=cakeStateAt(p);cakeSection.style.setProperty('--cake-progress',s.p);cakeSection.dataset.phase=String(s.phase);
  set('body','transform',`translate(0 ${(1-s.arrive)*16})`);set('plate','transform',`translate(0 ${(1-s.arrive)*16})`);
  set('lid','transform',`translate(${s.open*125} ${-s.open*176+(1-s.arrive)*16}) rotate(${s.open*17} 320 250)`);set('lid','opacity',s.lidOpacity);
  set('knife','opacity',s.knifeOpacity);set('knife','transform',`translate(${130-s.knife*200} 0)`);set('cavity','opacity',s.open);
  set('cream','opacity',Math.min(1,s.fill*4));set('cream','transform',`translate(320 287) scale(${.08+.92*s.fill} ${.2+.8*s.fill}) translate(-320 -287)`);
  set('bag','opacity',s.bagOpacity);set('bag','transform',`translate(${(1-s.fill)*14} ${-25*(1-s.fill)})`);set('stream','opacity',s.bagOpacity);
  set('ganache','opacity',Math.min(1,s.cover*3));set('ganache','transform',`translate(320 280) scale(${.88+.12*s.cover} ${.03+.97*s.cover}) translate(-320 -280)`);
  set('garnish','opacity',s.garnish);set('garnish','transform',`translate(0 ${(1-s.garnish)*-45})`);set('sparkles','opacity',s.sparkles);
  if(lastPhase!==s.phase){status.textContent=labels[s.phase];controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===s.phase)));lastPhase=s.phase}
 }
 function measure(){const rect=cakeSection.getBoundingClientRect();const stickyTop=parseFloat(getComputedStyle(stage).top)||0;return Math.max(0,Math.min(1,(stickyTop-rect.top)/Math.max(1,rect.height-stage.getBoundingClientRect().height)))}
 function tick(time){raf=0;const dt=Math.min(50,lastTime?time-lastTime:16);lastTime=time;if(shown===null||staticMode.matches)shown=staticMode.matches?1:target;else shown+=(target-shown)*(1-Math.exp(-dt/65));if(Math.abs(target-shown)<.0002)shown=target;draw(shown);if(!staticMode.matches&&Math.abs(target-shown)>.0002)raf=requestAnimationFrame(tick)}
 function schedule(){target=staticMode.matches?1:measure();if(!raf)raf=requestAnimationFrame(tick)}
 controls.forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.cakeStep);if(staticMode.matches){shown=(i+.9)/5;target=shown;draw(shown);return}const rect=cakeSection.getBoundingClientRect();const top=parseFloat(getComputedStyle(stage).top)||0;const distance=Math.max(1,rect.height-stage.getBoundingClientRect().height);const desired=[.08,.32,.56,.78,1][i];window.scrollTo({top:Math.max(0,scrollY+rect.top-top+distance*desired),behavior:'smooth'})}));
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);staticMode.addEventListener('change',()=>{shown=null;schedule()});schedule();
}
// Entrada suave das seções; sem ocultar conteúdo quando JS ou observador não existem.
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target)}},{threshold:.08});
 document.querySelectorAll('.christmas-video,.christmas-highlight,.natal-product,.order-banner').forEach(el=>{el.classList.add('reveal-ready');reveal.observe(el)});
}
