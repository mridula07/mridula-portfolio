(function(){
  const preloader = document.getElementById('preloader');
  const mark = document.getElementById('preloader-mark');
  const navMark = document.querySelector('.nav-mark');
  if(!preloader || !mark || !navMark) return;

  /* Respect reduced motion — skip preloader entirely */
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    preloader.style.display = 'none';
    document.body.classList.add('loaded');
    return;
  }

  /* After one glow pulse (800ms), spring the mark up into nav position */
  setTimeout(function(){
    /* Get nav mark position relative to viewport */
    const navRect = navMark.getBoundingClientRect();
    const markRect = mark.getBoundingClientRect();

    const dx = (navRect.left + navRect.width / 2) - (markRect.left + markRect.width / 2);
    const dy = (navRect.top + navRect.height / 2) - (markRect.top + markRect.height / 2);
    const scale = navRect.width / markRect.width;

    mark.style.transition = 'transform 0.55s cubic-bezier(.34,1.3,.4,1), opacity 0.3s ease';
    mark.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ') rotate(-4deg)';
    mark.style.opacity = '0';
  }, 820);

  /* Fade out preloader and reveal page */
  setTimeout(function(){
    preloader.style.transition = 'opacity 0.3s ease';
    preloader.style.opacity = '0';
  }, 1100);

  setTimeout(function(){
    preloader.style.display = 'none';
    document.body.classList.add('loaded');
  }, 1420);
})();
