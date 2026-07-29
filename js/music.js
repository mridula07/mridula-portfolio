(function(){
  const cassette = document.getElementById('cassette');
  const audio = document.getElementById('sunflower');
  if(cassette && audio){
    cassette.addEventListener('click',()=>{
      const playing = cassette.classList.toggle('playing');
      if(playing){ audio.currentTime=0; audio.play().catch(()=>{}); }
      else { audio.pause(); }
    });
    audio.addEventListener('ended',()=>cassette.classList.remove('playing'));
    window.APP = window.APP || {};
    window.APP.audio = audio;
  }
})();
