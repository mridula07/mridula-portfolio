(function(){
  /* reveals */
  const io = new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));

  /* count-up */
  const cio=new IntersectionObserver(es=>{es.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'';
    const t0=performance.now(),dur=1400;
    const tick=t=>{const p=Math.min((t-t0)/dur,1),ease=1-Math.pow(1-p,3);
      el.textContent=Math.round(end*ease)+suf;
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);cio.unobserve(el);
  })},{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  /* visual exploration ticker */
  const vxTrack=document.getElementById('vxTrack');
  const vxBelt=document.getElementById('vxBelt');
  if(vxTrack && !window.APP.rm){
    let x=0, speed=.8, target=.8;
    vxBelt.addEventListener('mouseenter',()=>target=.18);
    vxBelt.addEventListener('mouseleave',()=>target=.8);
    (function loop(){
      speed += (target-speed)*.06;
      x -= speed;
      const half = vxTrack.scrollWidth/2;
      if(-x >= half) x += half;
      vxTrack.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(loop);
    })();
  }
})();
