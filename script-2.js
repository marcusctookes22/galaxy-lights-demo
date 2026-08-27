      roof: "panoramic",
      twinkle: true,
      shooting: true,
      designMode: false,
      customStars: []
    };

    const labels = {
      pattern: {night:"Night Sky", galaxy:"Galaxy Arc", halo:"Halo Edge"},
      color: {ice:"Ice White", gold:"Warm Gold", violet:"Violet", rgb:"RGB Mix"},
      roof: {solid:"Solid roof", regular:"Standard sunroof", panoramic:"Panoramic roof"}
    };

    let generatedStars = [];
    let previewW = 0;
    let previewH = 0;
    let lastPreviewFrame = 0;

    function seededRandom(seed){
      let value = seed >>> 0;
      return () => {
        value += 0x6D2B79F5;
        let t = value;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }

    function roofRect(){
      const marginX = previewW * .075;
      const marginY = previewH * .095;
      return {x:marginX,y:marginY,w:previewW-marginX*2,h:previewH-marginY*2};
    }

    function sunroofRects(){
      const r = roofRect();
      if(headlinerState.roof === "solid") return [];
      if(headlinerState.roof === "regular"){
        return [{x:r.x+r.w*.34,y:r.y+r.h*.11,w:r.w*.32,h:r.h*.35,rad:r.h*.045}];
      }
      return [
        {x:r.x+r.w*.19,y:r.y+r.h*.09,w:r.w*.62,h:r.h*.30,rad:r.h*.045},
        {x:r.x+r.w*.19,y:r.y+r.h*.43,w:r.w*.62,h:r.h*.27,rad:r.h*.045}
      ];
    }

    function inSunroof(x,y){
      return sunroofRects().some(r => x>r.x && x<r.x+r.w && y>r.y && y<r.y+r.h);
    }

    function inRoof(x,y){
      const r=roofRect();
      return x>r.x && x<r.x+r.w && y>r.y && y<r.y+r.h && !inSunroof(x,y);
    }

    function generateStars(){
      if(!previewW || !previewH) return;
      const r = roofRect();
      const seed = headlinerState.kit + headlinerState.pattern.length*7919 + headlinerState.roof.length*3571;
      const rand = seededRandom(seed);
      const stars=[];
      const count=headlinerState.kit;
      let guard=0;
      while(stars.length<count && guard<count*20){
        guard++;
        let x,y;
        if(headlinerState.pattern === "galaxy"){
          const t=rand()*Math.PI*4.6;
          const rr=(.04+.39*(t/(Math.PI*4.6))) * Math.min(r.w,r.h*1.65);
          x=r.x+r.w*.50 + Math.cos(t)*rr + (rand()-.5)*r.w*.13;
          y=r.y+r.h*.52 + Math.sin(t)*rr*.54 + (rand()-.5)*r.h*.12;
          if(rand()<.34){x=r.x+rand()*r.w;y=r.y+rand()*r.h;}
        }else if(headlinerState.pattern === "halo"){
          const edge=rand();
          if(edge<.25){x=r.x+rand()*r.w;y=r.y+r.h*(.05+rand()*.12)}
          else if(edge<.5){x=r.x+rand()*r.w;y=r.y+r.h*(.83+rand()*.12)}
          else if(edge<.75){x=r.x+r.w*(.05+rand()*.10);y=r.y+rand()*r.h}
          else{x=r.x+r.w*(.85+rand()*.10);y=r.y+rand()*r.h}
          if(rand()<.26){x=r.x+rand()*r.w;y=r.y+rand()*r.h;}
        }else{
          x=r.x+rand()*r.w;
          y=r.y+rand()*r.h;
        }
        if(inRoof(x,y)){
          stars.push({x,y,size:.45+rand()*1.18,alpha:.34+rand()*.65,phase:rand()*Math.PI*2,colorIndex:Math.floor(rand()*4)});
        }
      }
      generatedStars=stars;
    }

    function starColor(star, alpha){
      const a=Math.max(.08,Math.min(1,alpha));
      if(headlinerState.color === "gold") return `rgba(246,216,137,${a})`;
      if(headlinerState.color === "violet") return `rgba(190,145,255,${a})`;
      if(headlinerState.color === "rgb"){
        const palette=[[232,248,255],[159,208,255],[192,137,255],[242,205,112]];
        const c=palette[star.colorIndex%palette.length];
        return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
      }
      return `rgba(235,249,255,${a})`;
    }

    function roundedRect(ctx,x,y,w,h,r){
      const rr=Math.min(r,w/2,h/2);
      ctx.beginPath();
      ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
    }

    function drawHeadliner(time=0){
      if(!previewW || !previewH) return;
      hctx.clearRect(0,0,previewW,previewH);
      const r=roofRect();

      const bg=hctx.createRadialGradient(previewW*.5,previewH*.43,0,previewW*.5,previewH*.43,previewW*.7);
      bg.addColorStop(0,"#12161b");bg.addColorStop(.58,"#08090b");bg.addColorStop(1,"#020202");
      hctx.fillStyle=bg;hctx.fillRect(0,0,previewW,previewH);

      roundedRect(hctx,r.x,r.y,r.w,r.h,r.h*.11);
      const roofGrad=hctx.createLinearGradient(0,r.y,0,r.y+r.h);
      roofGrad.addColorStop(0,"#17191c");roofGrad.addColorStop(.5,"#111315");roofGrad.addColorStop(1,"#090a0b");
      hctx.fillStyle=roofGrad;hctx.fill();
      hctx.strokeStyle="rgba(217,176,79,.23)";hctx.lineWidth=1;hctx.stroke();

      hctx.save();roundedRect(hctx,r.x,r.y,r.w,r.h,r.h*.11);hctx.clip();
      hctx.strokeStyle="rgba(255,255,255,.016)";hctx.lineWidth=1;
      for(let yy=r.y;yy<r.y+r.h;yy+=7){hctx.beginPath();hctx.moveTo(r.x,yy);hctx.lineTo(r.x+r.w,yy);hctx.stroke();}

      const twinkleTime=time*.0015;
      for(const star of generatedStars){
        const pulse=headlinerState.twinkle ? .62+.38*Math.sin(twinkleTime+star.phase*3.1) : 1;
        const alpha=star.alpha*pulse;
        hctx.beginPath();hctx.arc(star.x,star.y,star.size,0,Math.PI*2);hctx.fillStyle=starColor(star,alpha);hctx.fill();
        if(star.size>1.25 && alpha>.55){
          hctx.strokeStyle=starColor(star,alpha*.36);hctx.lineWidth=.6;
          hctx.beginPath();hctx.moveTo(star.x-3.2,star.y);hctx.lineTo(star.x+3.2,star.y);hctx.moveTo(star.x,star.y-3.2);hctx.lineTo(star.x,star.y+3.2);hctx.stroke();
        }
      }

      for(const star of headlinerState.customStars){
        const x=star.x*previewW,y=star.y*previewH;
        if(!inRoof(x,y)) continue;
        const fake={colorIndex:star.colorIndex||0};
        hctx.shadowBlur=12;hctx.shadowColor=starColor(fake,.85);hctx.fillStyle=starColor(fake,1);
        hctx.beginPath();hctx.arc(x,y,2.1,0,Math.PI*2);hctx.fill();hctx.shadowBlur=0;
      }

      if(headlinerState.shooting){
        const trails=[
          [r.x+r.w*.12,r.y+r.h*.28,r.x+r.w*.27,r.y+r.h*.38],
          [r.x+r.w*.67,r.y+r.h*.73,r.x+r.w*.83,r.y+r.h*.62]
        ];
        trails.forEach((t,i)=>{
          if(inSunroof((t[0]+t[2])/2,(t[1]+t[3])/2)) return;
          const grad=hctx.createLinearGradient(t[0],t[1],t[2],t[3]);
          grad.addColorStop(0,"rgba(255,255,255,0)");
          grad.addColorStop(.68,headlinerState.color==='gold'?"rgba(246,216,137,.34)":"rgba(226,245,255,.34)");
          grad.addColorStop(1,headlinerState.color==='gold'?"rgba(246,216,137,.95)":"rgba(242,251,255,.95)");
          hctx.strokeStyle=grad;hctx.lineWidth=1.4+i*.25;hctx.beginPath();hctx.moveTo(t[0],t[1]);hctx.lineTo(t[2],t[3]);hctx.stroke();
        });
      }
      hctx.restore();

      for(const sr of sunroofRects()){
        roundedRect(hctx,sr.x,sr.y,sr.w,sr.h,sr.rad);
        const glass=hctx.createLinearGradient(sr.x,sr.y,sr.x+sr.w,sr.y+sr.h);
        glass.addColorStop(0,"rgba(2,7,11,.98)");glass.addColorStop(.55,"rgba(8,17,25,.98)");glass.addColorStop(1,"rgba(2,4,6,.99)");
        hctx.fillStyle=glass;hctx.fill();hctx.strokeStyle="rgba(160,194,220,.18)";hctx.stroke();
        hctx.beginPath();hctx.moveTo(sr.x+sr.w*.08,sr.y+sr.h*.15);hctx.lineTo(sr.x+sr.w*.64,sr.y+sr.h*.08);hctx.strokeStyle="rgba(255,255,255,.045)";hctx.stroke();
      }

      hctx.fillStyle="rgba(0,0,0,.84)";
      hctx.beginPath();hctx.moveTo(0,previewH);hctx.lineTo(0,previewH*.82);hctx.quadraticCurveTo(previewW*.18,previewH*.71,previewW*.31,previewH*.84);hctx.lineTo(previewW*.69,previewH*.84);hctx.quadraticCurveTo(previewW*.82,previewH*.71,previewW,previewH*.82);hctx.lineTo(previewW,previewH);hctx.closePath();hctx.fill();
    }

    function resizeHeadliner(){
      const rect=headlinerCanvas.getBoundingClientRect();
      const dpr=Math.min(window.devicePixelRatio||1,2);
      previewW=Math.max(300,rect.width);previewH=Math.max(220,rect.height);
      headlinerCanvas.width=Math.floor(previewW*dpr);headlinerCanvas.height=Math.floor(previewH*dpr);
      hctx.setTransform(dpr,0,0,dpr,0,0);
      generateStars();drawHeadliner(performance.now());
    }

    function updateDesignerUI(){
      previewCount.textContent=`${headlinerState.kit.toLocaleString()} ★${headlinerState.customStars.length?` + ${headlinerState.customStars.length} custom`:''}`;
      kitLabel.textContent=`${headlinerState.kit.toLocaleString()} stars`;
      patternLabel.textContent=labels.pattern[headlinerState.pattern];
      colorLabel.textContent=labels.color[headlinerState.color];
      roofLabel.textContent=labels.roof[headlinerState.roof];
      designSummary.textContent=[
        `${headlinerState.kit.toLocaleString()} stars`,labels.pattern[headlinerState.pattern],labels.color[headlinerState.color],labels.roof[headlinerState.roof],
        headlinerState.twinkle?'Twinkle':'Static',headlinerState.shooting?'Shooting stars':'No shooting stars',
        headlinerState.customStars.length?`${headlinerState.customStars.length} custom stars`:null
      ].filter(Boolean).join(' · ');
      previewBadge.textContent=headlinerState.designMode?'Design Mode · tap the headliner to place custom stars':'Density Preview · click Design Mode to place custom stars';
    }

    document.querySelectorAll('[data-control]').forEach(group=>{
      group.querySelectorAll('.choice').forEach(btn=>{
        btn.addEventListener('click',()=>{
          group.querySelectorAll('.choice').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
          const control=group.dataset.control;
          headlinerState[control]=control==='kit'?Number(btn.dataset.value):btn.dataset.value;
          generateStars();updateDesignerUI();drawHeadliner(performance.now());
        });
      });
    });

    const twinkleToggle=document.getElementById('twinkleToggle');
    const shootingToggle=document.getElementById('shootingToggle');
    twinkleToggle.addEventListener('click',()=>{headlinerState.twinkle=!headlinerState.twinkle;twinkleToggle.classList.toggle('active',headlinerState.twinkle);updateDesignerUI();drawHeadliner(performance.now());});
    shootingToggle.addEventListener('click',()=>{headlinerState.shooting=!headlinerState.shooting;shootingToggle.classList.toggle('active',headlinerState.shooting);updateDesignerUI();drawHeadliner(performance.now());});

    const designModeBtn=document.getElementById('designModeBtn');
    designModeBtn.addEventListener('click',()=>{
      headlinerState.designMode=!headlinerState.designMode;
      designModeBtn.classList.toggle('active',headlinerState.designMode);updateDesignerUI();
    });
    document.getElementById('clearCustomBtn').addEventListener('click',()=>{headlinerState.customStars=[];updateDesignerUI();drawHeadliner(performance.now());});

    headlinerCanvas.addEventListener('pointerdown',e=>{
      if(!headlinerState.designMode) return;
      const rect=headlinerCanvas.getBoundingClientRect();
      const x=e.clientX-rect.left,y=e.clientY-rect.top;
      if(!inRoof(x,y)) return;
      headlinerState.customStars.push({x:x/previewW,y:y/previewH,colorIndex:headlinerState.customStars.length%4});
      updateDesignerUI();drawHeadliner(performance.now());
    });

    document.getElementById('surpriseBtn').addEventListener('click',()=>{
      const pick=a=>a[Math.floor(Math.random()*a.length)];
      headlinerState.kit=pick([300,500,850,1500,2500]);
      headlinerState.pattern=pick(['night','galaxy','halo']);
      headlinerState.color=pick(['ice','gold','violet','rgb']);
      headlinerState.roof=pick(['solid','regular','panoramic']);
      headlinerState.twinkle=Math.random()>.18;headlinerState.shooting=Math.random()>.38;headlinerState.customStars=[];
      document.querySelectorAll('[data-control]').forEach(group=>group.querySelectorAll('.choice').forEach(btn=>btn.classList.toggle('active',String(btn.dataset.value)===String(headlinerState[group.dataset.control]))));
      twinkleToggle.classList.toggle('active',headlinerState.twinkle);shootingToggle.classList.toggle('active',headlinerState.shooting);
      generateStars();updateDesignerUI();drawHeadliner(performance.now());
    });

    document.getElementById('savePreview').addEventListener('click',()=>{
      drawHeadliner(performance.now());
      const link=document.createElement('a');
      link.download=`galaxy-headliner-${headlinerState.kit}-${headlinerState.pattern}.png`;
      link.href=headlinerCanvas.toDataURL('image/png');link.click();
    });

    document.getElementById('useDesignBtn').addEventListener('click',()=>{
      const radio=[...document.querySelectorAll('input[name="service"]')].find(r=>r.value==='Starlight Headliner');
      if(radio){radio.checked=true;radio.dispatchEvent(new Event('change',{bubbles:true}));}
      const message=document.getElementById('message');
      const designText=`Headliner preview: ${headlinerState.kit.toLocaleString()} stars; ${labels.pattern[headlinerState.pattern]}; ${labels.color[headlinerState.color]}; ${labels.roof[headlinerState.roof]}; ${headlinerState.twinkle?'twinkle on':'twinkle off'}; ${headlinerState.shooting?'shooting stars on':'shooting stars off'}${headlinerState.customStars.length?`; ${headlinerState.customStars.length} custom constellation stars`:''}.`;
      message.value=(message.value?message.value+'\\n\\n':'')+designText;
      document.getElementById('quote').scrollIntoView({behavior:'smooth'});
      setTimeout(()=>document.getElementById('year').focus({preventScroll:true}),700);
    });

    function animateHeadliner(t){
      if(headlinerState.twinkle && t-lastPreviewFrame>34){drawHeadliner(t);lastPreviewFrame=t;}
      requestAnimationFrame(animateHeadliner);
    }
    requestAnimationFrame(()=>{resizeHeadliner();updateDesignerUI();requestAnimationFrame(animateHeadliner);});
    window.addEventListener('resize',resizeHeadliner);

    const form = document.getElementById("quoteForm");
    const status = document.getElementById("formStatus");
    form.addEventListener("submit", e => {
      e.preventDefault();
      if(!form.reportValidity()) return;

      const data = new FormData(form);
      const subject = `Galaxy Car Lights Quote — ${data.get("year")} ${data.get("make")} ${data.get("model")}`;
      const selectedService = data.get("service");
      const detailLines = [];
      if(selectedService === "Starlight Headliner" || selectedService === "Starlight + Exterior Contour"){
        detailLines.push(`Starlight density: ${data.get("starPreference")}`);
        detailLines.push(`Starlight effects: ${data.get("starEffects")}`);
      }