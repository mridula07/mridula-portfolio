(function(){
  const cursor = document.getElementById('caseCursor');
  const cases = document.querySelectorAll('.case');
  if(!cursor || !cases.length) return;
  if(!(window.APP && window.APP.fine)) return; /* touch/coarse pointers: cards stay plain links */

  const reduced = window.APP.rm;
  let tx=0, ty=0, cx=0, cy=0, active=false, raf=null;

  function loop(){
    if(reduced){ cx=tx; cy=ty; }
    else{ cx += (tx-cx)*.2; cy += (ty-cy)*.2; }
    cursor.style.left = cx+'px';
    cursor.style.top = cy+'px';
    if(active) raf = requestAnimationFrame(loop);
  }
  function onMove(e){ tx=e.clientX; ty=e.clientY; }

  cases.forEach(el=>{
    el.addEventListener('mouseenter', e=>{
      active = true;
      tx=cx=e.clientX; ty=cy=e.clientY;
      cursor.classList.add('show');
      document.addEventListener('mousemove', onMove);
      raf = requestAnimationFrame(loop);
    });
    el.addEventListener('mouseleave', ()=>{
      active = false;
      cursor.classList.remove('show');
      document.removeEventListener('mousemove', onMove);
      if(raf) cancelAnimationFrame(raf);
    });
  });
})();
