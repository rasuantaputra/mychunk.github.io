const $=s=>document.querySelector(s),card=$('.card'),t=$('#t'),k=$('#k'),n=$('#n'),bar=$('.bar i'),nav=$('#nav');
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const decks={All:cards};
for(const c of cards)(decks[c.deck]||(decks[c.deck]=[])).push(c);
let list,deck,i=0,busy=false,sx=0,dx=0,drag=false;
const show=()=>{const{word,deck:d}=list[i];t.textContent=word;k.textContent=d;n.textContent=(i+1)+' / '+list.length;bar.style.width=(i+1)/list.length*100+'%'};
const shuffle=a=>{for(let j=a.length-1;j>0;j--){const r=Math.random()*(j+1)|0;[a[j],a[r]]=[a[r],a[j]]}return a};
const pick=d=>{deck=d;list=shuffle(decks[d].slice());i=0;for(const b of nav.children)b.setAttribute('aria-pressed',b.dataset.d===d);show()};
for(const d in decks){const b=document.createElement('button');b.dataset.d=d;b.innerHTML=d+'<small>'+decks[d].length+'</small>';b.onclick=()=>pick(d);nav.append(b)}
const step=d=>{
  if(d>0&&i===list.length-1){const last=list[i];list=shuffle(decks[deck].slice());if(list.length>1&&list[0]===last)[list[0],list[1]]=[list[1],list[0]];i=0}
  else i=(i+d+list.length)%list.length;
  show()};
function fling(d){ // d = 1 next (swipe left), -1 previous (swipe right)
  if(busy)return;
  if(calm){step(d);card.style.transform='';return}
  busy=true;
  card.style.transition='transform .22s ease-in,opacity .22s';
  card.style.transform='translateX('+(-d*innerWidth)+'px) rotate('+(-d*20)+'deg)';
  card.style.opacity=0;
  setTimeout(()=>{
    step(d);
    card.style.transition='none';card.style.transform='scale(.94)';card.offsetWidth;
    card.style.transition='transform .2s ease-out,opacity .2s';card.style.transform='';card.style.opacity=1;
    busy=false;
  },220);
}
card.onpointerdown=e=>{if(busy)return;drag=true;sx=e.clientX;dx=0;card.setPointerCapture(e.pointerId);card.style.transition='none'};
card.onpointermove=e=>{if(!drag)return;dx=e.clientX-sx;card.style.transform='translateX('+dx+'px) rotate('+dx/20+'deg)'};
card.onpointerup=card.onpointercancel=()=>{if(!drag)return;drag=false;if(Math.abs(dx)>70)fling(dx<0?1:-1);else{card.style.transition='transform .2s';card.style.transform=''}};
addEventListener('keydown',e=>{if(e.key==='ArrowRight')fling(1);else if(e.key==='ArrowLeft')fling(-1)});
pick('All');
