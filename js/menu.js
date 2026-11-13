/* Menus and shared screens: level menu, debrief, certificate, live space weather, about the data. */
(function (CC) {
  'use strict';
  var $ = CC.$;

  CC.title = function () {
    CC.hideOverlays(); $('ovTitle').hidden = false; $('hud').hidden = true;
    CC.World.mode('globe'); CC.World.globeShot('far');
  };

  /* A level opens only after the one before it is passed (at least 1 star). Passed levels can be replayed any time. */
  CC.unlocked = function (n) { return n === 1 || CC.SAVE['l' + (n - 1)] > 0; };
  CC.allPassed = function () { return CC.SAVE.l1 > 0 && CC.SAVE.l2 > 0 && CC.SAVE.l3 > 0 && CC.SAVE.l4 > 0; };

  CC.levelMenu = function () {
    CC.cancelTalk(); CC.card(null); $('hud').hidden = true;
    CC.G = CC.reset(0); CC.World.setPlanet('moon'); CC.World.setSite(CC.G.site); CC.World.mode('surface'); CC.World.shot('wide');
    var S = CC.SAVE, total = S.l1 + S.l2 + S.l3 + S.l4;
    var lv = [
      [1, 'Level 1 · Sept 2017 · Moon', 'Get Sami home before the particles hit'],
      [2, 'Level 2 · May 2024 · Moon', 'Last four days of storm waves'],
      [3, 'Level 3 · July 2012 · Moon', 'Read the forecast, feed the crew'],
      [4, 'Level 4 · June 2018 · Mars', 'Keep the power on in a dust storm']
    ];
    CC.overlay('<p class="kicker">Base: ' + CC.SITES[CC.G.site].name + ' · Total stars ' + total + ' of 12</p>' +
      '<h2 class="big mid">Choose a storm</h2>' +
      '<div class="levels">' + lv.map(function (l) {
        var open = CC.unlocked(l[0]);
        return '<button class="lvbtn' + (open ? '' : ' locked') + '" type="button" id="lv' + l[0] + '"' + (open ? '' : ' disabled aria-disabled="true"') + '><span>' + l[1] +
          '<small>' + (open ? l[2] : 'Pass Level ' + (l[0] - 1) + ' to unlock') + '</small>' + '</span><b>' + (open ? CC.stars(S['l' + l[0]]) : '🔒') + '</b></button>';
      }).join('') + '</div>' +
      '<div class="row"><button class="go alt sm" type="button" id="lvRules">How to play</button><button class="go alt sm" type="button" id="lvLive">Today’s real Sun (LIVE)</button><button class="go alt sm" type="button" id="lvAbout">About the data</button><button class="go alt sm" type="button" id="lvSite">Change site</button>' +
      (total ? '<button class="go alt sm" type="button" id="lvReset">Start over</button>' : '') +
      (CC.allPassed() ? '<button class="go alt sm" type="button" id="lvCert">My certificate</button>' : '') + '</div>' +
      '<div id="resetAsk"></div>' +
      (S.l1 ? '' : '<p class="credit">Start with Level 1. Pass a level to open the next one.</p>'));
    [1, 2, 3, 4].forEach(function (n) { if (CC.unlocked(n)) $('lv' + n).onclick = n === 1 && !rulesSeen() ? function () { CC.rulesScreen(CC.level1); } : CC['level' + n]; });
    $('lvRules').onclick = function () { CC.rulesScreen(CC.levelMenu); };
    $('lvLive').onclick = CC.liveScreen; $('lvAbout').onclick = CC.aboutScreen;
    $('lvSite').onclick = function () { CC.hideOverlays(); CC.World.shot('site'); CC.siteScreen(); };
    if ($('lvCert')) $('lvCert').onclick = CC.certificate;
    if ($('lvReset')) $('lvReset').onclick = askReset;
    var next = [1, 2, 3, 4].filter(function (n) { return CC.unlocked(n) && !S['l' + n]; })[0];
    if (next) CC.pointAt($('lv' + next));
  };

  /* How to play: four short rules, shown before the first Level 1 and from the menu. */
  function rulesSeen() { try { return CC.rulesOk || localStorage.getItem('capcom_rules') === '1'; } catch (e) { return CC.rulesOk; } }
  CC.rulesScreen = function (then) {
    CC.cancelTalk(); CC.hideArrow(); CC.rulesOk = true;
    try { localStorage.setItem('capcom_rules', '1'); } catch (e) { /* ignore */ }
    var DOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="#0b0f1a" stroke-width="2.4"><circle cx="12" cy="12" r="2.5" fill="#0b0f1a"/><path d="M12 3a9 9 0 0 1 7.8 4.5L14.6 10.5M4.2 7.5A9 9 0 0 1 12 3M12 21a9 9 0 0 1-7.8-4.5l5.2-3M19.8 16.5A9 9 0 0 1 12 21"/></svg>';
    var BOLT = '<svg viewBox="0 0 24 24" fill="#0b0f1a"><path d="M13 2L5 14h6l-1 8 8-12h-6z"/></svg>';
    var CARD = '<svg viewBox="0 0 40 40">' + CC.ICON.ask + '</svg>';
    CC.overlay('<p class="kicker">Before you play</p><h2 class="big mid">How to play</h2><ul class="rules">' +
      '<li><span class="ri" style="--c:var(--dose)">' + DOSE + '</span><span><b>Dose</b> is radiation the crew soaks up. Keep it <b>left of the white line</b>.</span></li>' +
      '<li><span class="ri" style="--c:var(--power)">' + BOLT + '</span><span><b>Power</b> runs the air and heat. If it hits <b>0</b>, you lose.</span></li>' +
      '<li><span class="ri" style="--c:var(--paper)">' + CARD + '</span><span>Every card has a <b>cost</b>. Read the little tags before you tap.</span></li>' +
      '<li><span class="ri" style="--c:var(--mission)"><b class="rs">★</b></span><span>Crew safe = <b>★</b>. Power left = <b>★★</b>. Mission done = <b>★★★</b>. Pass a level to open the next.</span></li>' +
      '</ul><div class="row"><button class="go" type="button" id="rulesGo">Got it!</button></div>');
    $('rulesGo').onclick = function () { CC.hush(); then(); };
    CC.pointAt($('rulesGo'));
    CC.say(['rules_1']);
  };

  /* Start over: asked on the page itself (browser confirm boxes are not used). */
  function askReset() {
    CC.hideArrow();
    $('resetAsk').innerHTML = '<div class="ask"><p>Erase all your stars and start again from the beginning?</p><div class="row">' +
      '<button class="go sm" type="button" id="rsYes">Yes, start over</button><button class="go alt sm" type="button" id="rsNo">No, keep my stars</button></div></div>';
    $('rsYes').onclick = function () {
      for (var k in CC.SAVE) CC.SAVE[k] = 0;
      CC.saveStars(); CC.hush(); CC.startGame();
    };
    $('rsNo').onclick = function () { $('resetAsk').innerHTML = ''; };
    $('rsNo').focus();
  }

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
      '<div class="score"><b>Your game points</b>' + (o.noDose ? '' : '<span>Dose ' + Math.round(G.dose) + ' (limit ' + G.limit + ')</span>') + '<span>Power ' + Math.max(0, Math.round(G.power)) + '</span><span>Mission ' + G.mission + ' of ' + G.goal + '</span><em>Game points come from your choices. They are not real measurements.</em></div>' +
      '<p class="tip"><b>SOL:</b> ' + tip + '</p>' +
      '<div class="real"><b>What really happened · real NASA data</b>' + o.fact + '</div>' +
      '<div class="row">' + (safe ? '<button class="go" type="button" id="nextB">' + o.next[0] + '</button><button class="go alt" type="button" id="again">Play again</button>'
        : '<button class="go" type="button" id="again">Try again</button>') +
      '<button class="go alt" type="button" id="menuB">All levels</button></div>' +
      (safe ? '' : '<p class="credit">Get the crew home safe to unlock the next level.</p>') + '</div></div>');
    ov.querySelectorAll('video').forEach(function (v) { try { v.play(); } catch (e) { /* ignore */ } });
    $('again').onclick = function () { CC.hush(); CC['level' + o.lvl](); };
    if ($('nextB')) $('nextB').onclick = function () { CC.hush(); o.next[1](); };
    $('menuB').onclick = function () { CC.hush(); CC.levelMenu(); };
    if (CC.Sol) CC.Sol.mood(safe ? 'cheer' : 'worry');
    CC.World.shot('wide');
    CC.say([safe ? o.win : o.lose, o.factLine]);
  };

  CC.certificate = function () {
    CC.cancelTalk(); CC.World.setPlanet('moon'); CC.World.setSite(CC.G.site); CC.World.shot('wide');
    var S = CC.SAVE, total = S.l1 + S.l2 + S.l3 + S.l4;
    CC.overlay('<div class="cert"><p class="kicker">Junior Astronaut Mission Trainer</p><h2 class="big mid">CAPCOM Certified!</h2>' +
      '<p class="certtxt">You guided crews through four real space weather events from NASA records: the solar storms of September 2017 and May 2024 and the July 2012 near miss on the Moon, and the 2018 dust storm that covered all of Mars.</p>' +
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
      '<tr><td><a href="https://svs.gsfc.nasa.gov/12706" target="_blank" rel="noopener">SDO</a> via NASA SVS</td><td>Real video of the September 2017 flare</td></tr>' +
      '<tr><td><a href="https://svs.gsfc.nasa.gov/4177/" target="_blank" rel="noopener">STEREO-A</a> and <a href="https://svs.gsfc.nasa.gov/4167/" target="_blank" rel="noopener">CCMC Enlil model</a> (NASA SVS), <a href="https://science.nasa.gov/science-news/science-at-nasa/2014/23jul_superstorm/" target="_blank" rel="noopener">NASA Science</a></td><td>Level 3: the July 2012 cloud, its speed and the real forecast map</td></tr>' +
      '<tr><td><a href="https://svs.gsfc.nasa.gov/14835/" target="_blank" rel="noopener">NASA SVS: May 2024 storm</a></td><td>Aurora video and the two new radiation belts</td></tr>' +
      '<tr><td><a href="https://www.jpl.nasa.gov/news/opportunity-hunkers-down-during-dust-storm/" target="_blank" rel="noopener">NASA JPL: Opportunity and the 2018 dust storm</a>, PIA22521, PIA22487</td><td>Level 4: how dark the sky got (tau 10.8), Opportunity’s last signal, Curiosity’s nuclear power</td></tr>' +
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
