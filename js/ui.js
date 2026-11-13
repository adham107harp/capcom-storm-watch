/* CAPCOM: Storm Watch — screen parts: HUD, subtitles, answer cards, hints, cards and effects. */
(function (CC) {
  'use strict';
  var $ = CC.$;

  var FACE = {
    nour: '<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#ff9a4d"/><path d="M16 80c2-14 11-21 24-21s22 7 24 21z" fill="#ff6b1a"/><g fill="#2a1408"><circle cx="24" cy="30" r="9"/><circle cx="32" cy="20" r="9"/><circle cx="44" cy="18" r="9"/><circle cx="55" cy="25" r="9"/><circle cx="58" cy="37" r="8"/><circle cx="22" cy="42" r="8"/></g><circle cx="40" cy="39" r="15" fill="#c58a62"/><circle cx="34" cy="38" r="2.2" fill="#0b0f1a"/><circle cx="46" cy="38" r="2.2" fill="#0b0f1a"/><path d="M34 45q6 6 12 0" stroke="#0b0f1a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M23 38a17 17 0 0 1 34 0" stroke="#0b0f1a" stroke-width="3" fill="none"/><rect x="54" y="35" width="6" height="10" rx="2" fill="#0b0f1a"/></svg>',
    sami: '<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#3b82f6"/><circle cx="40" cy="40" r="26" fill="#fff" stroke="#0b0f1a" stroke-width="3"/><ellipse cx="40" cy="42" rx="18" ry="13" fill="#ffb347" stroke="#0b0f1a" stroke-width="3"/></svg>',
    lina: '<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#ff6b1a"/><circle cx="40" cy="40" r="26" fill="#fff" stroke="#0b0f1a" stroke-width="3"/><ellipse cx="40" cy="42" rx="18" ry="13" fill="#ffb347" stroke="#0b0f1a" stroke-width="3"/></svg>',
    omar: '<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#c1440e"/><circle cx="40" cy="40" r="26" fill="#fff" stroke="#0b0f1a" stroke-width="3"/><ellipse cx="40" cy="42" rx="18" ry="13" fill="#ffb347" stroke="#0b0f1a" stroke-width="3"/></svg>'
  };
  var NAME = { sol: 'SOL', nour: 'NOUR · JUNIOR ASTRONAUT', sami: 'SAMI · COMMANDER', lina: 'LINA · ENGINEER', omar: 'DR. OMAR · MARS CREW' };
  var RADIO = { sami: 1, lina: 1, omar: 1 };

  CC.ICON = {
    home: '<path d="M6 20L20 8l14 12v14H6z" fill="#7ee08a" stroke="#0b0f1a" stroke-width="3" stroke-linejoin="round"/><rect x="16" y="24" width="8" height="10" fill="#0b0f1a"/>',
    rock: '<path d="M6 30l5-14 10-6 11 6 3 14z" fill="#b9b3d6" stroke="#0b0f1a" stroke-width="3" stroke-linejoin="round"/>',
    ask: '<circle cx="20" cy="20" r="15" fill="#48d1ff" stroke="#0b0f1a" stroke-width="3"/><path d="M15 16a5 5 0 1 1 7 4.5c-1.5.8-2 1.6-2 3.5" stroke="#0b0f1a" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="29" r="2" fill="#0b0f1a"/>',
    idea: '<path d="M20 5a11 11 0 0 1 6 20v5H14v-5A11 11 0 0 1 20 5z" fill="#ffd23f" stroke="#0b0f1a" stroke-width="3"/><path d="M15 34h10" stroke="#0b0f1a" stroke-width="3"/>',
    water: '<path d="M20 5c6 9 11 14 11 20a11 11 0 0 1-22 0c0-6 5-11 11-20z" fill="#48d1ff" stroke="#0b0f1a" stroke-width="3"/>',
    food: '<rect x="7" y="12" width="26" height="20" rx="3" fill="#ffb347" stroke="#0b0f1a" stroke-width="3"/><path d="M7 19h26" stroke="#0b0f1a" stroke-width="3"/>',
    dirt: '<path d="M4 32c4-10 10-16 16-16s12 6 16 16z" fill="#9aa0b8" stroke="#0b0f1a" stroke-width="3"/><path d="M26 6l6 10" stroke="#0b0f1a" stroke-width="3"/>',
    panel: '<rect x="8" y="6" width="24" height="20" fill="#2a4fd1" stroke="#0b0f1a" stroke-width="3"/><path d="M20 26v10" stroke="#0b0f1a" stroke-width="3"/>',
    heat: '<path d="M14 30c-4-6 4-10 0-18M22 30c-4-6 4-10 0-18M30 30c-4-6 4-10 0-18" stroke="#ff6b1a" stroke-width="4" fill="none" stroke-linecap="round"/>',
    radio: '<path d="M20 22v14M12 14a11 11 0 0 1 16 0M7 9a18 18 0 0 1 26 0" stroke="#0b0f1a" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="21" r="4" fill="#48d1ff" stroke="#0b0f1a" stroke-width="2"/>',
    tool: '<path d="M26 6a8 8 0 0 0-8 11L7 28l5 5 11-11a8 8 0 0 0 11-8l-5 5-5-1-1-5z" fill="#cfcde6" stroke="#0b0f1a" stroke-width="3" stroke-linejoin="round"/>',
    door: '<rect x="10" y="5" width="20" height="30" fill="#7ee08a" stroke="#0b0f1a" stroke-width="3"/><circle cx="25" cy="21" r="2" fill="#0b0f1a"/>',
    shield: '<path d="M20 4l13 5v10c0 8-6 14-13 17C13 33 7 27 7 19V9z" fill="#48d1ff" stroke="#0b0f1a" stroke-width="3" stroke-linejoin="round"/>',
    rover: '<rect x="5" y="14" width="30" height="12" rx="3" fill="#f2f2f6" stroke="#0b0f1a" stroke-width="3"/><circle cx="12" cy="29" r="4" fill="#0b0f1a"/><circle cx="28" cy="29" r="4" fill="#0b0f1a"/>',
    plant: '<path d="M20 34V16M20 22c-8 0-10-6-10-10 6 0 10 3 10 10zM20 18c0-7 4-11 11-11 0 6-4 11-11 11z" fill="#7ee08a" stroke="#0b0f1a" stroke-width="3" stroke-linejoin="round"/>',
    split: '<circle cx="20" cy="20" r="14" fill="#ffd23f" stroke="#0b0f1a" stroke-width="3"/><path d="M20 6v28" stroke="#0b0f1a" stroke-width="3"/>',
    clock: '<circle cx="20" cy="20" r="15" fill="#ffd0d8" stroke="#0b0f1a" stroke-width="3"/><path d="M20 11v10l6 4" stroke="#0b0f1a" stroke-width="3" fill="none" stroke-linecap="round"/>',
    map: '<path d="M5 9l9-3 12 4 9-3v24l-9 3-12-4-9 3z" fill="#e8f4ff" stroke="#0b0f1a" stroke-width="3" stroke-linejoin="round"/><path d="M14 6v24M26 10v24" stroke="#0b0f1a" stroke-width="2"/>',
    lab: '<path d="M15 5h10M17 5v10L8 32h24L23 15V5" fill="#d5f5d9" stroke="#0b0f1a" stroke-width="3" stroke-linejoin="round"/>',
    stop: '<rect x="8" y="8" width="24" height="24" rx="4" fill="#ff4f6d" stroke="#0b0f1a" stroke-width="3"/>',
    send: '<path d="M5 20L35 6 26 34l-6-11z" fill="#48d1ff" stroke="#0b0f1a" stroke-width="3" stroke-linejoin="round"/>'
  };
  function icon(name) { return CC.ICON[name] ? '<svg viewBox="0 0 40 40" aria-hidden="true">' + CC.ICON[name] + '</svg>' : ''; }

  /* ---------- HUD ---------- */
  var last = {};
  function bump(id, v) {
    if (last[id] !== undefined && last[id] !== v) { var e = $(id); e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); }
    last[id] = v;
  }
  CC.hud = function () {
    var G = CC.G;
    $('mDose').style.width = Math.min(100, G.dose / 60 * 100) + '%';
    $('mLim').style.left = (G.limit / 60 * 100) + '%';
    $('mDoseN').textContent = Math.round(G.dose) + '/' + G.limit;
    $('mPow').style.width = Math.max(0, Math.min(100, G.power)) + '%';
    $('mPowN').textContent = Math.max(0, Math.round(G.power));
    var s = ''; for (var i = 0; i < G.goal; i++) s += i < G.mission ? '★' : '☆'; $('mMis').textContent = s;
    var sh = ''; for (var j = 0; j < 3; j++) sh += j < G.shield ? '■' : '□'; $('mSh').textContent = sh;
    bump('mD', Math.round(G.dose)); bump('mP', Math.round(G.power)); bump('mM', G.mission); bump('mS', G.shield);
    var txt = $('clockTxt'), ring = $('ring');
    txt.classList.toggle('sm', G.clockMode === 'delay');
    var st = $('stage'), hb = $('hud').getBoundingClientRect(), sb = st.getBoundingClientRect();
    if (hb.height) st.style.setProperty('--hudb', Math.round(hb.bottom - sb.top + 18) + 'px');
    if (G.clockMode === 'delay') {
      txt.innerHTML = '12 MIN<br>DELAY'; ring.style.strokeDashoffset = '0'; ring.style.stroke = '#ff9d5c'; $('stage').classList.remove('hot');
    } else if (G.clockMode === 'day') {
      txt.innerHTML = 'DAY<br>' + G.day; ring.style.strokeDashoffset = (213.6 * (1 - Math.min(1, G.day / 4))).toFixed(1); ring.style.stroke = '#48d1ff';
      $('stage').classList.remove('hot');
    } else {
      var c = Math.max(0, G.clock), m = Math.floor(c), sec = Math.floor((c - m) * 60);
      txt.textContent = (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
      ring.style.strokeDashoffset = (213.6 * (1 - c / (G.total || 1))).toFixed(1);
      var hot = G.running && !G.impacted && c <= G.total * 0.25;
      ring.style.stroke = hot ? '#ff4f6d' : '#ffd23f';
      $('stage').classList.toggle('hot', hot);
    }
  };

  /* ---------- subtitles + voices ---------- */
  var tok = 0;
  CC.cancelTalk = function () { tok++; CC.hush(); $('sub').hidden = true; };
  /* ids: line ids, or [id, fn] to run fn when the line starts */
  CC.say = function (ids, then) {
    var my = ++tok, i = 0;
    $('answers').hidden = true; CC.hideArrow();
    function next() {
      if (my !== tok) return;
      if (CC.G.impactPending && CC.G.onImpact) { CC.G.impactPending = false; CC.G.onImpact(); return; }
      if (i >= ids.length) { $('sub').hidden = true; if (then) then(); return; }
      var it = ids[i++], id = typeof it === 'string' ? it : it[0], fn = typeof it === 'string' ? null : it[1];
      if (fn) fn();
      var L = CC.LINES[id], who = L[0], radio = !!RADIO[who];
      var sub = $('sub');
      sub.hidden = false;
      sub.className = 'sub' + (radio ? ' radio' : who === 'nour' ? ' nour' : '');
      sub.innerHTML = '<div class="face">' + (FACE[who] || '') + '</div>' +
        '<strong>' + NAME[who] + (radio ? ' <i>RADIO</i>' : '') + '</strong><span class="line">' + L[1] + '</span>' +
        '<div class="ctl"><button class="pill" type="button" data-act="rep">Replay</button><button class="pill" type="button" data-act="next">Next ›</button></div>';
      if (CC.Sol) CC.Sol.mood(who === 'sol' ? 'talk' : 'listen');
      if (radio && CC.World) CC.World.wave(who);
      var gone = false;
      function adv() { if (gone) return; gone = true; CC.hush(); setTimeout(next, 160); }
      sub.querySelector('[data-act=next]').onclick = adv;
      sub.querySelector('[data-act=rep]').onclick = function () { CC.hush(); CC.play(id, function () {}); };
      CC.play(id, function () { if (my === tok) adv(); });
    }
    next();
  };

  /* ---------- answer cards ---------- */
  function chips(c) {
    var h = '';
    if (c.min) h += '<span class="chip">' + c.min + ' min</span>';
    if (c.power) h += '<span class="chip p">Power ' + (c.power > 0 ? '+' : '−') + Math.abs(c.power) + '</span>';
    if (c.mission) h += '<span class="chip ms">Mission ' + (c.mission > 0 ? '+' : '−') + Math.abs(c.mission) + '</span>';
    if (c.shield) h += '<span class="chip sh">Shelter +' + c.shield + '</span>';
    if (c.risk) h += '<span class="chip d">' + c.risk + '</span>';
    return h;
  }
  function quipFor(c) {
    if (c.risk) return 'Hmm, risky!';
    if (c.shield) return 'Thicker walls!';
    if (c.power && c.power < 0) return 'Ooh, power!';
    if (c.power > 0) return 'More power!';
    if (c.mission < 0) return 'Less science...';
    if (c.mission > 0) return 'Science!';
    return 'Hmm...';
  }
  CC.applyCost = function (c) {
    var G = CC.G;
    if (c.min) CC.advance(c.min);
    if (c.power) G.power += c.power;
    if (c.mission) G.mission = Math.max(0, G.mission + c.mission);
    if (c.shield) G.shield = Math.min(3, G.shield + c.shield);
  };
  var idleT = null, hinted = false;
  /* opts: {icon,label,cost,nour,off,say,reply,fx,next} */
  CC.ask = function (opts) {
    var a = $('answers');
    a.hidden = false; a.classList.toggle('pulse', !hinted);
    a.innerHTML = opts.map(function (o, n) {
      return '<button class="ans' + (o.nour ? ' nour' : '') + '" type="button" data-n="' + n + '"' + (o.off ? ' disabled' : '') + '>' + icon(o.icon) +
        '<span><span class="by">' + (o.nour ? 'Nour’s idea' : o.off ? o.off : 'You say') + '</span><span class="q">' + o.label + '</span>' +
        '<span class="chips">' + chips(o.cost || {}) + '</span></span></button>';
    }).join('');
    if (!hinted) { hinted = true; CC.pointAt(a.querySelector('.ans')); CC.play('hint_cards'); }
    clearTimeout(idleT);
    idleT = setTimeout(function () { if (!a.hidden) { CC.play('hint_idle'); CC.pointAt(a.querySelector('.ans:not([disabled])')); } }, 15000);
    Array.prototype.forEach.call(a.querySelectorAll('.ans'), function (b) {
      var o = opts[+b.getAttribute('data-n')];
      var on = function () { CC.quip(quipFor(o.cost || {})); if (CC.Sol) CC.Sol.mood('point'); };
      var off = function () { CC.quip(null); if (CC.Sol) CC.Sol.mood('idle'); };
      b.addEventListener('mouseenter', on); b.addEventListener('focus', on);
      b.addEventListener('mouseleave', off); b.addEventListener('blur', off);
      b.onclick = function () {
        if (o.off) return;
        clearTimeout(idleT); CC.hideArrow(); CC.quip(null);
        a.hidden = true; a.classList.remove('pulse');
        CC.applyCost(o.cost || {});
        if (o.fx) o.fx();
        CC.hud();
        if (CC.G.running && CC.G.clock <= 0 && CC.G.onImpact) { CC.G.onImpact(); return; }
        CC.say((o.say ? [o.say] : []).concat(o.reply || []), o.next);
      };
    });
    var f = a.querySelector('.ans:not([disabled])');
    if (f) f.focus({ preventScroll: true });
  };
  CC.clearIdle = function () { clearTimeout(idleT); };
  CC.goBtn = function (label, fn, alt) {
    var a = $('answers');
    a.hidden = false; a.classList.remove('pulse');
    a.innerHTML = '<div class="row"><button class="go" type="button" id="goB">' + label + '</button>' + (alt ? '<button class="go alt" type="button" id="goB2">' + alt[0] + '</button>' : '') + '</div>';
    $('goB').onclick = function () { CC.hideArrow(); a.hidden = true; fn(); };
    if (alt) $('goB2').onclick = function () { CC.hideArrow(); a.hidden = true; alt[1](); };
    $('goB').focus({ preventScroll: true });
    CC.pointAt($('goB'));
  };
  CC.quip = function (t) {
    var q = $('quip');
    if (!t) { q.hidden = true; return; }
    q.hidden = false; q.textContent = t; q.style.animation = 'none'; void q.offsetWidth; q.style.animation = '';
  };

  /* ---------- pointing arrow (placed beside the target so it never covers text) ---------- */
  var arrowEl = null;
  /* The arrow is placed after the target's entry animation ends, so it never lands on top of it. */
  var arrowTok = 0;
  CC.pointAt = function (el) {
    CC.hideArrow();
    if (!el) return;
    var tok = arrowTok;
    setTimeout(function () {
      if (tok !== arrowTok || !el.isConnected || el.offsetParent === null) return;
      var r = el.getBoundingClientRect(), st = $('stage').getBoundingClientRect();
      arrowEl = document.createElement('div');
      arrowEl.className = 'arrow';
      arrowEl.innerHTML = '<svg viewBox="0 0 54 54" aria-hidden="true"><path d="M50 27L26 8v12H4v14h22v12z" fill="#ffc21a" stroke="#0b0f1a" stroke-width="4" stroke-linejoin="round"/></svg>';
      var leftRoom = r.left - st.left;
      if (leftRoom > 64) { arrowEl.style.left = (r.left - st.left - 60) + 'px'; arrowEl.style.top = (r.top - st.top + r.height / 2 - 27) + 'px'; }
      else { arrowEl.classList.add('down'); arrowEl.style.left = (r.left - st.left + r.width / 2 - 27) + 'px'; arrowEl.style.top = (r.top - st.top - 58) + 'px'; }
      $('stage').appendChild(arrowEl);
      if (CC.Sol) CC.Sol.mood('point');
    }, 700);
  };
  CC.hideArrow = function () { arrowTok++; if (arrowEl) { arrowEl.remove(); arrowEl = null; } };
  window.addEventListener('resize', CC.hideArrow);

  /* ---------- cards and effects ---------- */
  CC.card = function (html, cls) {
    var b = $('cardBox');
    if (!html) { b.innerHTML = ''; return; }
    b.innerHTML = '<div class="card ' + (cls || '') + '">' + html + '</div>';
    var v = b.querySelector('video'); if (v) { try { v.play(); } catch (e) { /* muted autoplay may be blocked */ } }
  };
  CC.mediaCard = function (tag, kind, key, title, credit) {
    var m = kind === 'video' ? '<video src="' + CC.url(key) + '" muted loop playsinline autoplay></video>' : '<img src="' + CC.url(key) + '" alt="' + title + '">';
    CC.card('<span class="tag">' + tag + '</span>' + m + '<p>' + title + '<small>' + credit + '</small></p>');
  };
  CC.factCard = function (tag, big, text, source) {
    CC.card('<span class="tag">' + tag + '</span><p class="big">' + big + '</p><p>' + text + '<small>' + source + '</small></p>', 'fact');
  };
  CC.sfx = function (t) {
    var s = $('sfx');
    if (!t) { s.hidden = true; return; }
    s.hidden = false; s.textContent = t; s.style.animation = 'none'; void s.offsetWidth; s.style.animation = '';
  };
  CC.boom = function () {
    var st = $('stage'); st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake');
    var f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  };
  CC.fadeTo = function (fn) { $('fade').classList.add('on'); setTimeout(function () { fn(); $('fade').classList.remove('on'); }, 650); };
  CC.hideOverlays = function () { ['ovTitle', 'ovSite', 'ovMenu'].forEach(function (k) { $(k).hidden = true; }); };
  CC.overlay = function (html) { CC.hideOverlays(); var o = $('ovMenu'); o.hidden = false; o.innerHTML = html; o.scrollTop = 0; return o; };
  CC.stars = function (n) { var s = ''; for (var i = 0; i < 3; i++) s += i < n ? '★' : '☆'; return s; };
})(window.CC);
