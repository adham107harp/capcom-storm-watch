/* Menus and shared screens: level menu, debrief, certificate, live space weather, about the data. */
(function (CC) {
  'use strict';
  var $ = CC.$;

  CC.title = function () {
    CC.hideOverlays(); $('ovTitle').hidden = false; $('hud').hidden = true;
    CC.World.mode('globe'); CC.World.globeShot('far');
  };

  CC.levelMenu = function () {
    CC.cancelTalk(); CC.card(null); $('hud').hidden = true;
    CC.G = CC.reset(0); CC.World.setSite(CC.G.site); CC.World.mode('surface'); CC.World.shot('wide');
    var S = CC.SAVE, total = S.l1 + S.l2 + S.l3 + S.l4;
    var lv = [
      ['lv1', 'Level 1 · Sept 2017 · Moon', S.l1, true],
      ['lv2', 'Level 2 · May 2024 · Moon', S.l2, true],
      ['lv3', 'Level 3 · Oct 2024 · Moon', S.l3, true],
      ['lv4', 'Level 4 · May 2024 · Mars', S.l4, true]
    ];
    CC.overlay('<p class="kicker">Base: ' + CC.SITES[CC.G.site].name + ' · Total stars ' + total + ' of 12</p>' +
      '<h2 class="big mid">Choose a storm</h2>' +
      '<div class="levels">' + lv.map(function (l) { return '<button class="lvbtn" type="button" id="' + l[0] + '"><span>' + l[1] + '</span><b>' + CC.stars(l[2]) + '</b></button>'; }).join('') + '</div>' +
      '<div class="row"><button class="go alt sm" type="button" id="lvLive">Today’s real Sun (LIVE)</button><button class="go alt sm" type="button" id="lvAbout">About the data</button><button class="go alt sm" type="button" id="lvSite">Change site</button></div>' +
      (S.l1 ? '' : '<p class="credit">Tip: start with Level 1. It teaches the basics.</p>'));
    $('lv1').onclick = CC.level1; $('lv2').onclick = CC.level2; $('lv3').onclick = CC.level3; $('lv4').onclick = CC.level4;
    $('lvLive').onclick = CC.liveScreen; $('lvAbout').onclick = CC.aboutScreen;
    $('lvSite').onclick = function () { CC.hideOverlays(); CC.World.shot('site'); CC.siteScreen(); };
    CC.pointAt($(S.l1 ? (S.l2 ? (S.l3 ? 'lv4' : 'lv3') : 'lv2') : 'lv1'));
  };

  /* opts: lvl, media (html), fact (html), win, lose, factLine, powerNeed, next ([label, fn]) */
  CC.debrief = function (o) {
    var G = CC.G;
    CC.World.storm(false); $('stage').classList.remove('impact', 'hot'); $('hud').hidden = true; CC.card(null); CC.hideArrow(); CC.clearIdle();
    G.running = false;
    var safe = G.dose < G.limit && !G.failPower, stars = safe ? 1 : 0;
    if (safe && G.power >= o.powerNeed) stars = 2;
    if (stars === 2 && G.mission >= G.goal) stars = 3;
    var key = 'l' + o.lvl; CC.SAVE[key] = Math.max(CC.SAVE[key], stars); CC.saveStars();
    var tip = G.failPower ? 'The power ran out. Save power for long storms.' :
      !safe ? 'The dose went over the limit. Thicker walls and staying inside keep it down.' :
      stars === 1 ? 'Everyone is safe. Now try to keep more power.' :
      stars === 2 ? 'For 3 stars, reach the mission goal too.' : 'Perfect run, CAPCOM!';
    var ov = CC.overlay('<div class="deb"><div class="debm">' + o.media + '</div><div class="debt">' +
      '<h2>' + (safe ? 'Crew safe!' : G.failPower ? 'Power out!' : 'Too much radiation') + '</h2>' +
      '<div class="starrow" aria-label="' + stars + ' of 3 stars"><span class="' + (stars > 0 ? 'on' : '') + '">★</span><span class="' + (stars > 1 ? 'on' : '') + '">★</span><span class="' + (stars > 2 ? 'on' : '') + '">★</span></div>' +
      '<div class="score"><b>Your game points</b><span>Dose ' + Math.round(G.dose) + ' (limit ' + G.limit + ')</span><span>Power ' + Math.max(0, Math.round(G.power)) + '</span><span>Mission ' + G.mission + ' of ' + G.goal + '</span><em>Game points come from your choices. They are not real measurements.</em></div>' +
      '<p class="tip"><b>SOL:</b> ' + tip + '</p>' +
      '<div class="real"><b>What really happened · real NASA data</b>' + o.fact + '</div>' +
      '<div class="row"><button class="go" type="button" id="again">Play again</button><button class="go alt" type="button" id="nextB">' + o.next[0] + '</button></div></div></div>');
    ov.querySelectorAll('video').forEach(function (v) { try { v.play(); } catch (e) { /* ignore */ } });
    $('again').onclick = function () { CC.hush(); CC['level' + o.lvl](); };
    $('nextB').onclick = function () { CC.hush(); o.next[1](); };
    if (CC.Sol) CC.Sol.mood(safe ? 'cheer' : 'worry');
    CC.World.shot('wide');
    CC.say([safe ? o.win : o.lose, o.factLine]);
  };

  CC.certificate = function () {
    CC.cancelTalk(); CC.World.setPlanet('moon'); CC.World.setSite(CC.G.site); CC.World.shot('wide');
    var S = CC.SAVE, total = S.l1 + S.l2 + S.l3 + S.l4;
    CC.overlay('<div class="cert"><p class="kicker">Junior Astronaut Mission Trainer</p><h2 class="big mid">CAPCOM Certified!</h2>' +
      '<p class="certtxt">You guided crews through four real solar storms from NASA records: September 2017, May 2024, October 2024, and the May 2024 storm at Mars.</p>' +
      '<p class="certstars">' + total + ' of 12 stars</p>' +
      '<div class="row"><button class="go" type="button" id="cMenu">All levels</button><button class="go alt" type="button" id="cAbout">About the data</button></div></div>');
    $('cMenu').onclick = CC.levelMenu; $('cAbout').onclick = CC.aboutScreen;
    if (CC.Sol) CC.Sol.mood('cheer');
    CC.say(['cert']);
  };

  /* ---------- live space weather (server function keeps the API key secret) ---------- */
  CC.liveScreen = function () {
    CC.cancelTalk();
    var ov = CC.overlay('<p class="kicker">NASA DONKI · LIVE</p><h2 class="big mid">Today’s real Sun</h2><div class="live" id="liveBox"><p>Asking NASA…</p></div><div class="row"><button class="go alt" type="button" id="liveBack">Back</button></div>');
    $('liveBack').onclick = CC.levelMenu;
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function day(t) { try { return new Date(t).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return esc(t); } }
    var ctl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctl) ctl.abort(); }, 9000);
    fetch('/api/donki', ctl ? { signal: ctl.signal } : {}).then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json(); }).then(function (d) {
      clearTimeout(to);
      var fast = (d.cme || []).filter(function (c) { return c.speed; }).sort(function (a, b) { return b.speed - a.speed; })[0];
      var html = '<p class="livestamp">LIVE from NASA DONKI · last 30 days · fetched ' + day(d.fetched) + '</p><div class="livegrid">' +
        '<div><b>' + (d.cme || []).length + '</b><span>clouds (CMEs) left the Sun</span></div>' +
        '<div><b>' + (fast ? Math.round(fast.speed).toLocaleString() + ' km/s' : '—') + '</b><span>fastest cloud' + (fast ? ' (' + day(fast.time) + ')' : '') + '</span></div>' +
        '<div><b>' + (d.sep || []).length + '</b><span>bursts of fast particles (SEP)</span></div>' +
        '<div><b>' + (d.gst || []).length + '</b><span>geomagnetic storms at Earth' + (d.gst && d.gst.length ? ', max Kp ' + esc(Math.max.apply(null, d.gst.map(function (g) { return g.kp || 0; }))) : '') + '</span></div></div>' +
        '<p>' + ((d.sep || []).length ? 'Fast particles were detected this month. A Moon crew would need a strong shelter!' : 'No particle bursts this month. A good month for moonwalks!') + '</p>';
      $('liveBox').innerHTML = html;
      CC.say(['live_1']);
    }).catch(function () {
      clearTimeout(to);
      $('liveBox').innerHTML = '<p>Live data needs the online version of the game (for example on Vercel). Right now NASA could not be reached, so nothing is shown. No numbers are made up.</p>';
      CC.say(['live_fail']);
    });
  };

  CC.aboutScreen = function () {
    CC.cancelTalk();
    CC.overlay('<p class="kicker">For judges, teachers and curious kids</p><h2 class="big mid">About the data</h2><div class="about">' +
      '<table><thead><tr><th scope="col">NASA source</th><th scope="col">What we used it for</th></tr></thead><tbody>' +
      '<tr><td><a href="https://kauai.ccmc.gsfc.nasa.gov/DONKI/" target="_blank" rel="noopener">DONKI</a> (Space Weather Database)</td><td>Real dates, cloud speeds, particle bursts and storm strength for every level; live panel</td></tr>' +
      '<tr><td><a href="https://osdr.nasa.gov/" target="_blank" rel="noopener">OSDR</a> (Open Science Data Repository)</td><td>Real studies on space radiation and cells (OSD-340) and plants grown in space (OSD-772)</td></tr>' +
      '<tr><td><a href="https://svs.gsfc.nasa.gov/4720" target="_blank" rel="noopener">CGI Moon Kit</a> (LRO colour, LOLA elevation)</td><td>The real 3D Moon in Level 0</td></tr>' +
      '<tr><td><a href="https://www.nasa.gov/news-release/nasa-provides-update-on-artemis-iii-moon-landing-regions/" target="_blank" rel="noopener">Artemis III landing regions</a></td><td>The nine real south-pole site names</td></tr>' +
      '<tr><td><a href="https://svs.gsfc.nasa.gov/12706" target="_blank" rel="noopener">SDO</a> via NASA SVS</td><td>Real videos and stills of the 2017 and 2024 flares</td></tr>' +
      '<tr><td><a href="https://svs.gsfc.nasa.gov/14835/" target="_blank" rel="noopener">NASA SVS: May 2024 storm</a></td><td>Aurora video and the two new radiation belts</td></tr>' +
      '<tr><td><a href="https://www.jpl.nasa.gov/news/nasa-watches-mars-light-up-during-epic-solar-storm/" target="_blank" rel="noopener">Curiosity RAD, MAVEN, Odyssey</a></td><td>The real Mars dose, camera “snow” and auroras in Level 4</td></tr>' +
      '<tr><td><a href="https://www.nasa.gov/missions/artemis/orion/scientists-and-engineers-evaluate-orion-radiation-protection-plan/" target="_blank" rel="noopener">Orion radiation protection</a> and <a href="https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon" target="_blank" rel="noopener">NASA Science</a></td><td>Why mass (water, food, Moon dirt) makes a shelter safer</td></tr>' +
      '<tr><td><a href="https://ntrs.nasa.gov/citations/20220013418" target="_blank" rel="noopener">NASA NTRS study</a></td><td>Mars radio delay of up to about 22 minutes one way</td></tr>' +
      '</tbody></table>' +
      '<p><b>Honest labels.</b> Storm records are archived NASA data, shown with their dates. Only the “Today’s real Sun” screen is live. The crews and bases are imagined, and the Dose, Power, Shelter and Mission numbers are game points from your choices, not real measurements.</p>' +
      '<p class="credit">SOL 3D model: team asset. Voices: Kokoro text-to-speech (Apache-2.0). NASA does not endorse this game.</p></div>' +
      '<div class="row"><button class="go alt" type="button" id="abBack">Back</button></div>');
    $('abBack').onclick = CC.levelMenu;
    CC.say(['about_1']);
  };
})(window.CC);
