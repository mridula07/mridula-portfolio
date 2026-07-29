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

  function initPit(){
    const {Engine,Bodies,Body,Composite,Runner}=Matter;
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
      {src:'images/sticker_01.svg',          w:100, h:111},
      {src:'images/sticker_02.svg',          w:108, h:108},
      {src:'images/sticker_03.svg',          w:120, h:89},
    ];
    const defs = stickerSrcs.map(function(s){return {t:'sticker', src:s.src, w:s.w, h:s.h};});
    const items=[];
    const startDelay = 1100;
    defs.forEach(function(d,i){
      setTimeout(function(){
        var x = 40 + Math.random()*(W()-80);
        var el = document.createElement('div');
        el.className = 'tool sticker-tool';
        el.style.width = d.w+'px'; el.style.height = d.h+'px';
        el.innerHTML = '<img src="'+d.src+'" width="'+d.w+'" height="'+d.h+'" alt="" draggable="false" style="display:block;filter:drop-shadow(0 6px 14px rgba(0,0,0,.35));"/>';
        var body = Bodies.rectangle(x, -60, d.w*.85, d.h*.85, {
          chamfer:{radius:d.w*0.15},restitution:.5, friction:.12, frictionAir:.012
        });
        Body.setAngle(body, (Math.random()-.5)*.8);
        Body.setAngularVelocity(body, (Math.random()-.5)*.05);
        pit.appendChild(el); items.push({body:body,el:el});
        Composite.add(engine.world, body);
      }, startDelay + i*140);
    });

    /* hover-based interaction: invisible pusher body that follows the cursor */
    var pusherRadius = 30;
    var pusher = Bodies.circle(-100, -100, pusherRadius, {
      isStatic: true,
      restitution: .8,
      render: {visible: false}
    });
    Composite.add(engine.world, pusher);
    var mouseActive = false;
    var lastMouse = {x:-100, y:-100};
    var currentMouse = {x:-100, y:-100};

    pit.addEventListener('mousemove', function(e){
      var rect = pit.getBoundingClientRect();
      lastMouse.x = currentMouse.x;
      lastMouse.y = currentMouse.y;
      currentMouse.x = e.clientX - rect.left;
      currentMouse.y = e.clientY - rect.top;
      mouseActive = true;
      /* move the pusher body to the cursor position —
         Matter.js static bodies push dynamic bodies when repositioned via setPosition */
      Body.setPosition(pusher, {x: currentMouse.x, y: currentMouse.y});
      /* also compute velocity from mouse movement to impart momentum */
      Body.setVelocity(pusher, {
        x: (currentMouse.x - lastMouse.x) * 0.5,
        y: (currentMouse.y - lastMouse.y) * 0.5
      });
    });
    pit.addEventListener('mouseleave', function(){
      mouseActive = false;
      Body.setPosition(pusher, {x:-100, y:-100});
    });
    /* touch support */
    pit.addEventListener('touchmove', function(e){
      var rect = pit.getBoundingClientRect();
      var touch = e.touches[0];
      lastMouse.x = currentMouse.x;
      lastMouse.y = currentMouse.y;
      currentMouse.x = touch.clientX - rect.left;
      currentMouse.y = touch.clientY - rect.top;
      mouseActive = true;
      Body.setPosition(pusher, {x: currentMouse.x, y: currentMouse.y});
      Body.setVelocity(pusher, {
        x: (currentMouse.x - lastMouse.x) * 0.5,
        y: (currentMouse.y - lastMouse.y) * 0.5
      });
    }, {passive:true});
    pit.addEventListener('touchend', function(){
      mouseActive = false;
      Body.setPosition(pusher, {x:-100, y:-100});
    });

    Runner.run(Runner.create(),engine);
    (function render(){
      var w=W(),h=H();
      for(var j=0;j<items.length;j++){
        var b=items[j].body, el=items[j].el;
        /* safety net: reset any sticker that escapes bounds */
        if(b.position.y>h+200||b.position.y<-400||b.position.x<-200||b.position.x>w+200){
          Body.setPosition(b,{x:40+Math.random()*(w-80),y:-40});
          Body.setVelocity(b,{x:0,y:0});
          Body.setAngularVelocity(b,0);
        }
        el.style.transform='translate('+(b.position.x-el.offsetWidth/2)+'px,'+(b.position.y-el.offsetHeight/2)+'px) rotate('+b.angle+'rad)';
      }
      requestAnimationFrame(render);
    })();
    var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){
      Body.setPosition(floor,{x:W()/2,y:H()+30});
      Body.setPosition(right,{x:W()+30,y:H()/2});
      Body.setPosition(ceiling,{x:W()/2,y:-260});
    },200);});
  }
})();
