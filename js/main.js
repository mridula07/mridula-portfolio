/* main.js — shared on every page: nav, scroll reveal, back to top, sliding toggles, footer trail
   Part of mridula-portfolio. Loaded with `defer`, no dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── Nav: glass over the sky, frosted white once you scroll past the hero ── */
  var nav = $('.nav'), shell = $('.nav-shell'), hero = $('.hero');
  function navState() {
    if (!nav) return;
    if (!hero) { nav.classList.add('solid'); return; }
    nav.classList.toggle('solid', window.scrollY > hero.offsetHeight - 140);
  }
  window.addEventListener('scroll', navState, { passive: true });
  window.addEventListener('resize', navState);
  navState();
  var menuBtn = $('.nav-menu');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = shell.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) nav.classList.add('solid'); else navState();
    });
    $$('.nav-sheet a').forEach(function (a) { a.addEventListener('click', function () { shell.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); navState(); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { shell.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); navState(); } });
  }

  /* ── Reveal on scroll ── */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* ── Back to top ── */
  $$('[data-top]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }); });

  /* ── Segmented toggles: a pill slides to the chosen option ── */
  var toggles = $$('.toggle');
  function placePill(t, animate) {
    var on = $('[aria-pressed="true"]', t), pill = $('.toggle__pill', t);
    if (!on || !pill) return;
    if (!animate) t.classList.add('no-anim');
    pill.style.width = on.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + on.offsetLeft + 'px)';
    if (!animate) { void pill.offsetWidth; t.classList.remove('no-anim'); }
  }
  toggles.forEach(function (t) {
    var pill = document.createElement('span'); pill.className = 'toggle__pill'; pill.setAttribute('aria-hidden', 'true'); t.insertBefore(pill, t.firstChild);
    placePill(t, false);
    $$('button', t).forEach(function (b) { b.addEventListener('click', function () { requestAnimationFrame(function () { placePill(t, true); }); }); });
  });
  var replace = function () { toggles.forEach(function (t) { placePill(t, false); }); };
  window.addEventListener('resize', replace);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(replace);

  /* ── Footer: liquid trail reveals the photo under the cursor, or the finger on touch screens ── */
  var foot = $('.footer'), dots = $('#foot-dots');
  if (foot && dots && !reduce) {
    var NS = 'http://www.w3.org/2000/svg', N = 22, pts = [], cs = [], R = [];
    for (var i = 0; i < N; i++) { var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '0'); dots.appendChild(c); cs.push(c); pts.push({ x: 0, y: 0 }); R.push((150 * Math.pow(1 - i / N, 0.85) + 18) * (foot.clientWidth < 760 ? 0.6 : 1)); }
    var tx = 0, ty = 0, inside = false, size = 0, lastT = performance.now(), running = false, raf = 0, seeded = false;
    var toLocal = function (e) { var b = foot.getBoundingClientRect(), s = Math.max(b.width / 1440, b.height / 720), ox = (b.width - 1440 * s) / 2, oy = (b.height - 720 * s) / 2; return { x: (e.clientX - b.left - ox) / s, y: (e.clientY - b.top - oy) / s }; };
    var tick = function (now) {
      var dt = Math.min(0.033, (now - lastT) / 1000); lastT = now;
      size += ((inside ? 1 : 0) - size) * (1 - Math.exp(-dt * (inside ? 6 : 2.5)));
      var k0 = 1 - Math.exp(-dt * 14); pts[0].x += (tx - pts[0].x) * k0; pts[0].y += (ty - pts[0].y) * k0;
      for (var i = 1; i < N; i++) {
        var p = pts[i], q = pts[i - 1], k = 1 - Math.exp(-dt * 18);
        p.x += (q.x - p.x) * k; p.y += (q.y - p.y) * k;
        var dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy), max = R[i] * 0.45;
        if (d > max) { p.x = q.x + dx / d * max; p.y = q.y + dy / d * max; }
      }
      var br = 1 + 0.05 * Math.sin(now / 420);
      for (var j = 0; j < N; j++) { cs[j].setAttribute('cx', pts[j].x.toFixed(1)); cs[j].setAttribute('cy', pts[j].y.toFixed(1)); cs[j].setAttribute('r', Math.max(0, R[j] * size * br).toFixed(1)); }
      if (inside || size > 0.002) raf = requestAnimationFrame(tick); else { running = false; seeded = false; }
    };
    var move = function (e) {
      var p = toLocal(e); tx = p.x; ty = p.y;
      if (!seeded) { for (var q = 0; q < N; q++) { pts[q].x = tx; pts[q].y = ty; } seeded = true; }
      inside = true;
      if (!running) { running = true; lastT = performance.now(); raf = requestAnimationFrame(tick); }
    };
    var off = function () { inside = false; };
    if (finePointer) {
      foot.addEventListener('pointermove', move);
      foot.addEventListener('pointerleave', off);
    } else {
      /* touch: drag a finger across the footer; passive so the page still scrolls */
      var touch = function (e) { if (e.touches[0]) move(e.touches[0]); };
      foot.addEventListener('touchstart', touch, { passive: true });
      foot.addEventListener('touchmove', touch, { passive: true });
      foot.addEventListener('touchend', off);
      foot.addEventListener('touchcancel', off);
    }
  }
})();
