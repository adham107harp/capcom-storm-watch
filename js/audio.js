/* CAPCOM: Storm Watch — voices. Pre-recorded clips; browser speech only as a fallback. */
(function (CC) {
  'use strict';
  var player = new Audio();
  player.preload = 'auto';
  CC.muted = false;

  function fallbackSpeak(line, end, est) {
    try {
      var u = new SpeechSynthesisUtterance(line[1]);
      u.pitch = line[0] === 'nour' ? 1.5 : line[0] === 'sol' ? 1.3 : 1;
      u.onend = end; u.onerror = end;
      speechSynthesis.speak(u);
      setTimeout(end, est * 2 + 3000);
    } catch (e) { setTimeout(end, est); }
  }

  /* Play one line by id; done() runs once when it ends (or is skipped by a timeout). */
  CC.play = function (id, done) {
    var line = CC.LINES[id], finished = false;
    function end() { if (finished) return; finished = true; if (CC.Sol) CC.Sol.talk(false); if (done) done(); }
    if (!line) { setTimeout(end, 10); return; }
    var est = 1000 + line[1].length * 60;
    if (CC.muted) { setTimeout(end, est); return; }
    try {
      player.pause();
      player.src = CC.url('audio:' + id);
      player.currentTime = 0;
      player.onended = end;
      player.onerror = function () { fallbackSpeak(line, end, est); };
      var p = player.play();
      if (p && p.catch) p.catch(function () { setTimeout(end, est); });
      if (line[0] === 'sol' && CC.Sol) CC.Sol.talk(true);
      setTimeout(end, est * 2 + 4000);
    } catch (e) { setTimeout(end, est); }
  };
  CC.hush = function () {
    try { player.pause(); } catch (e) { /* ignore */ }
    try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    if (CC.Sol) CC.Sol.talk(false);
  };
})(window.CC);
