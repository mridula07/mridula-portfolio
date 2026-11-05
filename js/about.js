/* about.js — About page only: opening line fills in word by word as you scroll
   Part of mridula-portfolio. Loaded with `defer`, no dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── About: write-up fills in word by word as you scroll ── */
  var open = $('.about-open'), words = $$('.writeup .w');
  if (open && words.length) {
    var last = -1;
    var fill = function () {
      var b = open.getBoundingClientRect(), vh = window.innerHeight, travel = Math.max(1, b.height - vh);
      var p = reduce ? 1 : Math.min(1, Math.max(0, (-b.top + vh * 0.05) / (travel * 0.85)));
      var k = Math.round(p * words.length);
      if (k !== last) { for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < k); last = k; }
    };
    window.addEventListener('scroll', fill, { passive: true }); window.addEventListener('resize', fill); fill();
  }
})();
