(function(){
  window.APP = window.APP || {};
  APP.rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  APP.fine = matchMedia('(pointer:fine)').matches;
  APP.click = function(freq,dur){
    try{
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.frequency.value = freq; o.type = 'square';
      g.gain.setValueAtTime(.06, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime+dur);
      o.start(); o.stop(ac.currentTime+dur);
    }catch(e){}
  };
})();
