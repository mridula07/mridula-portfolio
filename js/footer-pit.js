(function(){
  if(typeof Matter === 'undefined') return;
  /* footer gravity pit */
  const pit = document.getElementById('pit');
  const footerEl = document.querySelector('footer');
  if(!pit || !footerEl) return;
  let started=false;
  new IntersectionObserver((es,obs)=>{es.forEach(e=>{
    if(e.isIntersecting && !started){
      started=true;footerEl.classList.add('in');initPit();obs.disconnect();
    }
  })},{threshold:.2}).observe(footerEl);

  /* svgEl removed — helper was unused after extraction. */

  function initPit(){
    const {Engine,Bodies,Body,Composite,Mouse,MouseConstraint,Runner}=Matter;
    const W=()=>pit.clientWidth,H=()=>pit.clientHeight;
    const engine=Engine.create();engine.gravity.y=1;
    const wallOpts={isStatic:true,restitution:.4};
    const floor=Bodies.rectangle(W()/2,H()+30,W()+400,60,wallOpts);
    const left=Bodies.rectangle(-30,H()/2,60,H()*3,wallOpts);
    const right=Bodies.rectangle(W()+30,H()/2,60,H()*3,wallOpts);
    const ceiling=Bodies.rectangle(W()/2,-260,W()+400,60,wallOpts);
    Composite.add(engine.world,[floor,left,right,ceiling]);

    const stickerSrcs = [
      {src:'images/index_imgcd07ac57f9.png', w:132, h:86},
      {src:'images/index_imgd8af42af9e.png', w:115, h:107},
      {src:'images/index_img46b8b6fa5b.png', w:115, h:119},
      {src:'images/index_img77d90494a7.png', w:115, h:120},
      {src:'images/index_img72bfd84c9f.png', w:120, h:88},
      {src:'images/index_img5b0a3b8c90.png', w:120, h:119},
      {src:'images/index_img97aae65ad3.png', w:118, h:120},
      {src:'images/index_img8715b7c0aa.png', w:98,  h:125},
    ];
    const defs = stickerSrcs.map(s => ({t:'sticker', ...s}));
    const items=[];
    const startDelay = 1100;
    defs.forEach((d,i)=>{
      setTimeout(()=>{
        const x = 40 + Math.random()*(W()-80);
        const el = document.createElement('div');
        el.className = 'tool sticker-tool';
        el.style.width = d.w+'px'; el.style.height = d.h+'px';
        el.innerHTML = `<img src="${d.src}" width="${d.w}" height="${d.h}" alt="" draggable="false" style="display:block;filter:drop-shadow(0 6px 14px rgba(0,0,0,.35));"/>`;
        const body = Bodies.rectangle(x, -60, d.w*.85, d.h*.85, {
          chamfer:{radius:d.w*0.15},restitution:.5, friction:.12, frictionAir:.012
        });
        Body.setAngle(body, (Math.random()-.5)*.8);
        Body.setAngularVelocity(body, (Math.random()-.5)*.05);
        pit.appendChild(el); items.push({body,el});
        Composite.add(engine.world, body);
      }, startDelay + i*140);
    });
    if(window.APP && window.APP.fine){
      const mouse=Mouse.create(pit);
      const mc=MouseConstraint.create(engine,{mouse,constraint:{stiffness:.15,damping:.1}});
      Composite.add(engine.world,mc);
      mouse.element.removeEventListener('wheel',mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll',mouse.mousewheel);
    }
    Runner.run(Runner.create(),engine);
    (function render(){
      const w=W(),h=H();
      for(const {body,el} of items){
        /* safety net: reset any sticker that escapes bounds */
        if(body.position.y>h+200||body.position.y<-400||body.position.x<-200||body.position.x>w+200){
          Body.setPosition(body,{x:40+Math.random()*(w-80),y:-40});
          Body.setVelocity(body,{x:0,y:0});
          Body.setAngularVelocity(body,0);
        }
        el.style.transform=`translate(${body.position.x-el.offsetWidth/2}px,${body.position.y-el.offsetHeight/2}px) rotate(${body.angle}rad)`;
      }
      requestAnimationFrame(render);
    })();
    let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{
      Body.setPosition(floor,{x:W()/2,y:H()+30});
      Body.setPosition(right,{x:W()+30,y:H()/2});
      Body.setPosition(ceiling,{x:W()/2,y:-260});
    },200);});
  }
})();
