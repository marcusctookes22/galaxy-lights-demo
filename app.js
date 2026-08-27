(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const logo = window.GALAXY_REFERENCE_LOGO || 'galaxy-logo.svg';
  $$('.js-logo').forEach(img => { img.src = logo; });
  $('#year').textContent = new Date().getFullYear();

  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const mobileNav = $('#mobileNav');
  const setMenu = open => {
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  };
  mobileNav.setAttribute('aria-hidden','true');
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  $$('#mobileNav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
      }), { threshold: 0.1 })
    : null;
  $$('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('visible'));

  const heroCanvas = $('#heroStars');
  const heroCtx = heroCanvas.getContext('2d');
  let heroStars = [];
  let heroRaf = 0;
  let heroActive = true;
  const resizeHero = () => {
    const rect = heroCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    heroCanvas.width = Math.max(1, Math.round(rect.width * dpr));
    heroCanvas.height = Math.max(1, Math.round(rect.height * dpr));
    heroCtx.setTransform(dpr,0,0,dpr,0,0);
    heroStars = Array.from({ length: Math.max(55, Math.round(rect.width / 15)) }, () => ({
      x: Math.random() * rect.width, y: Math.random() * rect.height, r: Math.random() * 1.1 + .2,
      a: Math.random() * .55 + .15, p: Math.random() * Math.PI * 2
    }));
  };
  const drawHero = time => {
    if(!heroActive){heroRaf=0;return;}
    const rect = heroCanvas.getBoundingClientRect();
    heroCtx.clearRect(0,0,rect.width,rect.height);
    heroStars.forEach(s => {
      const alpha = s.a * (.68 + .32 * Math.sin(time * .001 + s.p));
      heroCtx.fillStyle = `rgba(210,225,255,${alpha})`;
      heroCtx.beginPath(); heroCtx.arc(s.x,s.y,s.r,0,Math.PI*2); heroCtx.fill();
    });
    heroRaf = requestAnimationFrame(drawHero);
  };
  resizeHero(); heroRaf = requestAnimationFrame(drawHero);

  const canvas = $('#headlinerCanvas');
  const ctx = canvas.getContext('2d');
  const state = { density:850, pattern:'night', color:'ice', roof:'panoramic', twinkle:true, shooting:true, design:false, custom:[] };
  const labels = {
    pattern:{night:'Night sky',galaxy:'Galaxy arc',halo:'Halo edge'},
    color:{ice:'Ice white',violet:'Violet',blue:'Electric blue',rgb:'RGB mix'},
    roof:{solid:'Solid',sunroof:'Sunroof',panoramic:'Panoramic'}
  };
  let stars = [], cw = 0, ch = 0, studioRaf = 0, studioActive = false;
  const rand = seed => { let x=seed>>>0; return () => ((x=Math.imul(1664525,x)+1013904223>>>0)/4294967296); };
  const roofBox = () => ({x:cw*.07,y:ch*.08,w:cw*.86,h:ch*.77,r:Math.min(cw,ch)*.05});
  const glassBoxes = () => {
    const r=roofBox(); if(state.roof==='solid') return [];
    if(state.roof==='sunroof') return [{x:r.x+r.w*.34,y:r.y+r.h*.12,w:r.w*.32,h:r.h*.35}];
    return [{x:r.x+r.w*.2,y:r.y+r.h*.10,w:r.w*.6,h:r.h*.28},{x:r.x+r.w*.2,y:r.y+r.h*.43,w:r.w*.6,h:r.h*.25}];
  };
  const inGlass = (x,y) => glassBoxes().some(g => x>g.x && x<g.x+g.w && y>g.y && y<g.y+g.h);
  const inRoof = (x,y) => { const r=roofBox(); return x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h&&!inGlass(x,y); };
  const makeStars = () => {
    if(!cw||!ch) return; const r=roofBox(); const random=rand(state.density + state.pattern.length*917 + state.roof.length*1297); stars=[];
    let guard=0; while(stars.length<state.density && guard<state.density*25){ guard++; let x,y;
      if(state.pattern==='galaxy'){ const t=random()*Math.PI*4.5, rr=(.04+.4*(t/(Math.PI*4.5)))*Math.min(r.w,r.h*1.5); x=r.x+r.w*.5+Math.cos(t)*rr+(random()-.5)*r.w*.12; y=r.y+r.h*.5+Math.sin(t)*rr*.52+(random()-.5)*r.h*.12; if(random()<.28){x=r.x+random()*r.w;y=r.y+random()*r.h;} }
      else if(state.pattern==='halo'){ const edge=Math.floor(random()*4); if(edge===0){x=r.x+random()*r.w;y=r.y+r.h*(.04+random()*.12)} else if(edge===1){x=r.x+random()*r.w;y=r.y+r.h*(.84+random()*.12)} else if(edge===2){x=r.x+r.w*(.04+random()*.1);y=r.y+random()*r.h} else{x=r.x+r.w*(.86+random()*.1);y=r.y+random()*r.h} if(random()<.22){x=r.x+random()*r.w;y=r.y+random()*r.h;} }
      else{x=r.x+random()*r.w;y=r.y+random()*r.h}
      if(inRoof(x,y)) stars.push({x,y,r:.35+random()*1.05,a:.32+random()*.65,p:random()*Math.PI*2,c:Math.floor(random()*4)});
    }
  };
  const starColor = (s,a) => {
    const alpha=Math.max(.05,Math.min(1,a)); if(state.color==='violet') return `rgba(189,149,255,${alpha})`; if(state.color==='blue') return `rgba(107,190,255,${alpha})`;
    if(state.color==='rgb'){ const p=[[230,248,255],[109,190,255],[190,143,255],[232,112,255]][s.c%4]; return `rgba(${p[0]},${p[1]},${p[2]},${alpha})`; }
    return `rgba(234,249,255,${alpha})`;
  };
  const roundRect = (x,y,w,h,r) => {
    const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
  };
  const drawStudio = time => {
    if(!cw||!ch) return; ctx.clearRect(0,0,cw,ch); const r=roofBox();
    const bg=ctx.createRadialGradient(cw*.5,ch*.35,0,cw*.5,ch*.35,cw*.68); bg.addColorStop(0,'#121626');bg.addColorStop(.55,'#070915');bg.addColorStop(1,'#010207');ctx.fillStyle=bg;ctx.fillRect(0,0,cw,ch);
    roundRect(r.x,r.y,r.w,r.h,r.r); const rg=ctx.createLinearGradient(0,r.y,0,r.y+r.h);rg.addColorStop(0,'#161927');rg.addColorStop(1,'#080a12');ctx.fillStyle=rg;ctx.fill();ctx.strokeStyle='rgba(131,151,220,.2)';ctx.stroke();
    ctx.save();roundRect(r.x,r.y,r.w,r.h,r.r);ctx.clip();
    for(const s of stars){const pulse=state.twinkle ? .65+.35*Math.sin(time*.0014+s.p*2.9) : 1;const a=s.a*pulse;ctx.fillStyle=starColor(s,a);ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();}
    for(const s of state.custom){const x=s.x*cw,y=s.y*ch;if(!inRoof(x,y))continue;ctx.shadowBlur=12;ctx.shadowColor='#a68cff';ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    if(state.shooting){[[.13,.29,.30,.39],[.68,.73,.84,.61]].forEach((q,i)=>{const x1=r.x+r.w*q[0],y1=r.y+r.h*q[1],x2=r.x+r.w*q[2],y2=r.y+r.h*q[3];if(inGlass((x1+x2)/2,(y1+y2)/2))return;const g=ctx.createLinearGradient(x1,y1,x2,y2);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,starColor({c:i},.9));ctx.strokeStyle=g;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});}
    ctx.restore();
    glassBoxes().forEach(g=>{roundRect(g.x,g.y,g.w,g.h,12);const gg=ctx.createLinearGradient(g.x,g.y,g.x+g.w,g.y+g.h);gg.addColorStop(0,'#02050a');gg.addColorStop(.55,'#08121d');gg.addColorStop(1,'#020409');ctx.fillStyle=gg;ctx.fill();ctx.strokeStyle='rgba(112,159,202,.16)';ctx.stroke();});
    ctx.fillStyle='rgba(0,0,0,.78)';ctx.beginPath();ctx.moveTo(0,ch);ctx.lineTo(0,ch*.84);ctx.quadraticCurveTo(cw*.2,ch*.73,cw*.34,ch*.86);ctx.lineTo(cw*.66,ch*.86);ctx.quadraticCurveTo(cw*.8,ch*.73,cw,ch*.84);ctx.lineTo(cw,ch);ctx.closePath();ctx.fill();
  };
  const resizeStudio = () => { const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);cw=Math.max(300,rect.width);ch=Math.max(280,rect.height);canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);makeStars();drawStudio(performance.now()); };
  const animateStudio = time => { if(!studioActive){studioRaf=0;return;} drawStudio(time); studioRaf=requestAnimationFrame(animateStudio); };
  const updateStudioUI = () => {
    $('#previewCount').textContent = `${state.density.toLocaleString()} stars${state.custom.length?` + ${state.custom.length} custom`:''}`;
    $('#densityLabel').textContent=state.density.toLocaleString();$('#patternLabel').textContent=labels.pattern[state.pattern];$('#colorLabel').textContent=labels.color[state.color];$('#roofLabel').textContent=labels.roof[state.roof];
    $('#previewHint').textContent=state.design?'Design mode · click the headliner':'Preview mode';
    $('#designModeBtn').classList.toggle('active',state.design);
    $('#twinkleToggle').classList.toggle('active',state.twinkle);$('#shootingToggle').classList.toggle('active',state.shooting);
    $('#twinkleToggle').setAttribute('aria-pressed',String(state.twinkle));$('#shootingToggle').setAttribute('aria-pressed',String(state.shooting));
  };
  $$('[data-control]').forEach(btn=>btn.addEventListener('click',()=>{const control=btn.dataset.control;$$(`[data-control="${control}"]`).forEach(b=>b.classList.remove('active'));btn.classList.add('active');state[control]=control==='density'?Number(btn.dataset.value):btn.dataset.value;makeStars();updateStudioUI();drawStudio(performance.now());}));
  $('#twinkleToggle').addEventListener('click',()=>{state.twinkle=!state.twinkle;updateStudioUI();});
  $('#shootingToggle').addEventListener('click',()=>{state.shooting=!state.shooting;updateStudioUI();});
  $('#designModeBtn').addEventListener('click',()=>{state.design=!state.design;updateStudioUI();});
  $('#clearStarsBtn').addEventListener('click',()=>{state.custom=[];updateStudioUI();});
  $('#surpriseBtn').addEventListener('click',()=>{const pick=a=>a[Math.floor(Math.random()*a.length)];state.density=pick([300,500,850,1500,2500]);state.pattern=pick(['night','galaxy','halo']);state.color=pick(['ice','violet','blue','rgb']);state.roof=pick(['solid','sunroof','panoramic']);state.twinkle=Math.random()>.15;state.shooting=Math.random()>.35;state.custom=[];['density','pattern','color','roof'].forEach(c=>$$(`[data-control="${c}"]`).forEach(b=>b.classList.toggle('active',String(b.dataset.value)===String(state[c]))));makeStars();updateStudioUI();});
  $('#savePreviewBtn').addEventListener('click',()=>{drawStudio(performance.now());const a=document.createElement('a');a.download=`galaxy-headliner-${state.density}-${state.pattern}.png`;a.href=canvas.toDataURL('image/png');a.click();});
  canvas.addEventListener('pointerdown',e=>{if(!state.design)return;const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;if(!inRoof(x,y))return;state.custom.push({x:x/cw,y:y/ch});updateStudioUI();});
  const designSummary = () => `${state.density} stars · ${labels.pattern[state.pattern]} · ${labels.color[state.color]} · ${labels.roof[state.roof]} · ${state.twinkle?'Twinkle':'Static'} · ${state.shooting?'Shooting stars':'No shooting stars'}${state.custom.length?` · ${state.custom.length} custom stars`:''}`;
  $('#useDesignBtn').addEventListener('click',()=>{const radio=$('input[name="service"][value="Starlight Headliner"]');radio.checked=true;$('#studioDesign').value=designSummary();$('#quote').scrollIntoView({behavior:'smooth'});});
  resizeStudio();
  if('IntersectionObserver' in window){
    new IntersectionObserver(([entry])=>{heroActive=entry.isIntersecting;if(heroActive&&!heroRaf)heroRaf=requestAnimationFrame(drawHero);},{rootMargin:'200px'}).observe($('.hero'));
    new IntersectionObserver(([entry])=>{studioActive=entry.isIntersecting;if(studioActive&&!studioRaf)studioRaf=requestAnimationFrame(animateStudio);},{rootMargin:'220px'}).observe($('#studio'));
  }else{studioActive=true;studioRaf=requestAnimationFrame(animateStudio);}

  $$('[data-service-select]').forEach(link=>link.addEventListener('click',()=>{const target=$(`input[name="service"][value="${link.dataset.serviceSelect}"]`);if(target)target.checked=true;}));
  $$('.faq-item button').forEach(button=>button.addEventListener('click',()=>{const item=button.closest('.faq-item'),open=item.classList.contains('open');$$('.faq-item').forEach(i=>{i.classList.remove('open');$('button',i).setAttribute('aria-expanded','false');});if(!open){item.classList.add('open');button.setAttribute('aria-expanded','true');}}));

  const form=$('#quoteForm');
  form.addEventListener('submit',e=>{
    e.preventDefault(); const required=$$('[required]',form); let valid=true;
    required.forEach(el=>{const missing=el.type==='radio'?!$(`input[name="${el.name}"]:checked`,form):!el.value.trim();if(missing){valid=false;if(el.type!=='radio')el.classList.add('invalid');}else el.classList.remove('invalid');});
    const email=$('input[type="email"]',form);if(email.value&&!email.validity.valid){valid=false;email.classList.add('invalid');}
    if(!valid){$('#formStatus').textContent='Please complete the required fields.';return;}
    const data=new FormData(form);const summary=[`Galaxy Car Lights project`,`Vehicle: ${data.get('year')} ${data.get('make')} ${data.get('model')}`,`Service: ${data.get('service')}`,data.get('studioDesign')?`Studio: ${data.get('studioDesign')}`:'',`Name: ${data.get('name')}`,`Phone: ${data.get('phone')}`,`Email: ${data.get('email')}`,data.get('notes')?`Notes: ${data.get('notes')}`:''].filter(Boolean).join('\n');
    navigator.clipboard?.writeText(summary).catch(()=>{});$('#formStatus').textContent='Project summary created and copied when your browser allows it.';
  });
  $$('input,textarea',form).forEach(el=>el.addEventListener('input',()=>el.classList.remove('invalid')));

  let resizeTimer; window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{resizeHero();resizeStudio();},120);},{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(heroRaf);cancelAnimationFrame(studioRaf);heroRaf=0;studioRaf=0;}
    else{if(heroActive&&!heroRaf)heroRaf=requestAnimationFrame(drawHero);if(studioActive&&!studioRaf)studioRaf=requestAnimationFrame(animateStudio);}
  });
})();
