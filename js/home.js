/* home.js — homepage only: Story/TL;DR, contact toggle, fix-log preview, testimonial tickers
   Part of mridula-portfolio. Loaded with `defer`, no dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── Story / TL;DR toggle ── */
  var copy = $('.intro-copy');
  $$('[data-mode-btn]').forEach(function (b) {
    b.addEventListener('click', function () {
      copy.setAttribute('data-mode', b.getAttribute('data-mode-btn'));
      $$('[data-mode-btn]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
  });

  /* ── Contact toggle ── */
  var ANS = {
    job: { t: 'I’m open to full-time product design roles, B2B or B2C, wherever the product is complex and moving fast.', c: 'View my resume', h: 'https://drive.google.com/file/d/1Jns75wjYnaLUI4F77qrDoTa8SmW4ctKh/view?usp=sharing' },
    free: { t: 'I take on a few freelance projects alongside: unslopping vibe-coded apps, fixing one flow end to end, or taking your brief to an MVP.', c: 'Tell me about it', h: 'mailto:mistry.mridula6@gmail.com' }
  };
  var ans = $('.answer');
  $$('[data-ans]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-ans');
      if (b.getAttribute('aria-pressed') === 'true') return;
      $$('[data-ans]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      ans.classList.add('swapping');
      setTimeout(function () {
        $('p', ans).textContent = ANS[k].t;
        var a = $('a', ans); a.firstChild.nodeValue = ANS[k].c + ' '; a.setAttribute('href', ANS[k].h);
        if (k === 'job') { a.target = '_blank'; a.rel = 'noopener'; } else { a.removeAttribute('target'); a.removeAttribute('rel'); }
        ans.classList.remove('swapping');
      }, 160);
    });
  });

  /* ── Fix log: phone preview follows the cursor ── */
  var fixRow = $('.fix-row[data-preview]'), fixes = $('.fixes'), pv = $('.fix-preview');
  if (fixRow && pv && finePointer) {
    fixRow.addEventListener('mouseenter', function () { pv.classList.add('on'); });
    fixRow.addEventListener('mouseleave', function () { pv.classList.remove('on'); });
    fixes.addEventListener('mousemove', function (e) {
      var b = fixes.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      pv.style.left = (x > b.width - 280 ? x - 256 : x + 36) + 'px';
      pv.style.top = (y - 240) + 'px';
    });
  }

  /* ── Testimonial tickers: tap to pause on touch screens ── */
  $$('.ticker').forEach(function (t) { t.addEventListener('click', function () { if (!finePointer) t.classList.toggle('paused'); }); });
})();
