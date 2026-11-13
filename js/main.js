/* CAPCOM: Storm Watch — start-up and the game clock. */
(function (CC) {
  'use strict';
  var $ = CC.$, last = 0;

  /* Real time drives the countdown in Levels 1 and 3. */
  function tick(t) {
    var G = CC.G;
    if (G.running && !G.impacted && G.clockMode === 'min') {
      var dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
      CC.advance(dt / (G.secPerMin || 6));
      if (G.clock <= 0) {
        G.clock = 0;
        if (!$('answers').hidden || $('sub').hidden) { $('answers').hidden = true; if (G.onImpact) G.onImpact(); }
        else G.impactPending = true; /* the current line finishes first, then the particles hit */
      }
      CC.hud();
    }
    last = t;
    requestAnimationFrame(tick);
  }

  function boot() {
    $('startBtn').onclick = CC.startGame;
    $('muteBtn').onclick = function () {
      CC.muted = !CC.muted;
      this.setAttribute('aria-pressed', String(CC.muted));
      this.textContent = CC.muted ? 'Sound off' : 'Sound on';
      if (CC.muted) CC.hush();
    };
    CC.reset(0);
    CC.initWorld();
    CC.initSol();
    CC.World.setSite('sunny');
    CC.title();
    requestAnimationFrame(tick);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window.CC);
