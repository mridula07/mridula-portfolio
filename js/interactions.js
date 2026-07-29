(function(){
  /* lamp = dark mode */
  const lamp = document.getElementById('lamp');
  if(lamp){
    lamp.addEventListener('click',()=>{lamp.classList.toggle('on');
      document.body.classList.toggle('dim',lamp.classList.contains('on'));
      window.APP && window.APP.click && window.APP.click(lamp.classList.contains('on')?880:420,.08);
    });
  }

  /* shuttle chase */
  const shuttle=document.getElementById('shuttle');
  if(shuttle){
    const smashLabel=shuttle.querySelector('.smash-label');
    const missEl=shuttle.querySelector('.miss');
    const spots=[{top:'56%',left:'88%'},{top:'87%',left:'42%'},{top:'16%',left:'22%'},{top:'87%',left:'68%'}];
    const misses=['missed!','oops, too slow','almost!'];
    let tries=0,caught=false;
    shuttle.addEventListener('click',()=>{
      if(caught)return;
      if(tries<3){
        const s=spots[(tries+1)%spots.length];
        shuttle.style.top=s.top;shuttle.style.left=s.left;
        shuttle.style.transform=`translate(-50%,-50%) rotate(${Math.random()*60-30}deg)`;
        smashLabel.style.opacity=0;missEl.textContent=misses[tries];missEl.style.opacity=1;
        window.APP && window.APP.click && window.APP.click(300+tries*80,.06);setTimeout(()=>missEl.style.opacity=0,700);tries++;
      }else{
        caught=true;shuttle.classList.add('caught');
        smashLabel.textContent='nice shot! 🏸';smashLabel.style.opacity=1;
        shuttle.style.transform='translate(-50%,-50%) rotate(0deg)';window.APP && window.APP.click && window.APP.click(660,.12);
      }
    });
    shuttle.style.transform='translate(-50%,-50%)';
  }

  /* about tabs */
  document.querySelectorAll('.tab').forEach(t=>{
    t.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));
      document.querySelectorAll('.pane').forEach(x=>x.classList.remove('on'));
      t.classList.add('on');
      document.getElementById('pane-'+t.dataset.pane).classList.add('on');
    });
  });
})();
