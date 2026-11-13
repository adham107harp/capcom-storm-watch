/* Level 1 — Training Day, 10 September 2017 (Moon). Get Sami home and thicken the shelter in 16 minutes. */
(function (CC) {
  'use strict';
  var $ = CC.$;

  function startLevel(lvl, label) {
    CC.cancelTalk(); CC.hideOverlays(); CC.hideArrow();
    var G = CC.reset(lvl);
    $('hud').hidden = false; $('lvlName').textContent = label;
    CC.World.mode('surface');
    if (G.planet === 'mars') CC.World.setPlanet('mars'); else CC.World.setSite(G.site);
    CC.World.reset();
    return G;
  }
  CC.startLevel = startLevel;

  function startDrive(wait) { var G = CC.G; G.driving = true; G.waitMin = wait || 0; }

  CC.level1 = function () {
    var G = startLevel(1, 'Level 1 · 10 Sep 2017 · ' + CC.SITES[CC.G.site].name);
    G.clockMode = 'min'; G.clock = G.total = 16; G.secPerMin = 6;
    G.crewOut = true; G.roverProg = 0; G.drive = Math.round(8 * G.driveScale);
    G.onImpact = impact;
    CC.onCrewHome = function () { CC.World.shot('shelter'); };
    CC.World.setRoute(28, -14);
    CC.hud();
    CC.World.shot('sun'); CC.World.flare(); CC.boom(); CC.sfx('FLASH!');
    CC.mediaCard('REAL NASA VIDEO', 'video', 'l1Video', 'The Sun on 10 September 2017', 'NASA Solar Dynamics Observatory · NASA/GSFC/SDO');
    CC.say(['a_1', ['a_2', function () { CC.sfx(null); }], 'a_3', 'a_4', 'a_5', 'a_6', 't_dose',
      ['a_7', function () { CC.card(null); CC.G.running = true; CC.World.shot('rover'); }]], call1);
  };

  function call1() {
    var l = ['c1_q'];
    if (CC.G.radioDrop) l.unshift(['c1_static', function () { CC.advance(1); CC.hud(); }]);
    CC.say(l, function () { CC.ask(call1Opts()); });
  }
  function call1Opts() {
    var G = CC.G, o = [
      { icon: 'home', label: 'Come home now!', cost: { min: 1, mission: -1 }, fx: function () { startDrive(0); }, reply: ['c1_home'], next: call2 },
      { icon: 'rock', label: 'Grab it, then drive!', cost: { min: 1, mission: 1, risk: '+5 min outside' }, fx: function () { startDrive(5); }, reply: ['c1_grab'], next: call2 }
    ];
    if (!G.flags.asked) o.push({ icon: 'ask', label: 'Lina, how long is the drive?', cost: { min: 1 }, fx: function () { G.flags.asked = 1; }, reply: [G.drive <= 6 ? 'c1_ask6' : 'c1_ask8', 'c1_ask_sol'], next: function () { CC.ask(call1Opts()); } });
    if (!G.flags.n1) o.push({ nour: true, icon: 'idea', label: 'Run home on foot!', say: 'c1_n_say', cost: { min: 1 }, fx: function () { G.flags.n1 = 1; }, reply: ['c1_n_sol', 'c1_n_ok'], next: function () { CC.ask(call1Opts()); } });
    return o;
  }
  function call2() {
    var G = CC.G;
    CC.World.shot('shelter');
    CC.say(['c2_q'], function () {
      var o = [
        { icon: 'water', label: 'Stack water bags', cost: { min: 2, mission: -1, shield: 2 }, reply: ['c2_water', 'c2_water_sol'], next: waitStorm },
        { icon: 'food', label: 'Stack food boxes', cost: { min: 1, shield: 1 }, reply: ['c2_food', 'c2_food_sol'], next: waitStorm },
        { icon: 'dirt', label: 'Pile more Moon dirt', cost: { min: 1, power: -8, risk: 'Lina outside 4 min' }, fx: function () { G.linaOut = 4; }, reply: ['c2_dirt', 'c2_dirt_sol'], next: waitStorm }
      ];
      if (!G.flags.n2) o.push({ nour: true, icon: 'idea', label: 'Hide behind the solar tower!', say: 'c2_n_say', cost: { min: 1 }, fx: function () { G.flags.n2 = 1; }, reply: ['c2_n_sol'], next: call2 });
      CC.ask(o);
    });
  }
  function waitStorm() {
    var G = CC.G, lines = [];
    if (G.crewOut) lines.push('w_out', 'fx_gravity'); else if (G.linaOut > 0) lines.push('w_lina'); else lines.push('w_in');
    CC.World.shot(G.crewOut ? 'rover' : 'shelter');
    CC.say(lines, function () { CC.goBtn('Skip to the storm', function () { CC.advance(Math.max(0, CC.G.clock)); impact(); }); });
  }
  function impact() {
    var G = CC.G;
    if (G.impacted) return;
    G.impacted = true; G.running = false; G.clock = 0; G.inside = !G.crewOut;
    CC.cancelTalk(); $('answers').hidden = true; CC.hideArrow(); CC.clearIdle();
    var hit, r;
    if (G.crewOut) { hit = 34; r = 'i_r_out'; }
    else if (G.linaOut > 0) { hit = 26; r = 'i_r_out'; }
    else { hit = Math.round(16 / (1 + G.shield)); r = G.shield === 0 ? 'i_r_none' : G.shield === 1 ? 'i_r_med' : 'i_r_strong'; }
    G.dose += hit; G.power -= 10; CC.hud();
    CC.World.shot('wide'); CC.World.storm(true); CC.boom(); CC.sfx(G.crewOut || G.linaOut > 0 ? 'ZZZAP!' : 'FZZT!'); $('stage').classList.add('impact');
    CC.say([G.crewOut ? 'i_out' : 'i_in', [r, function () { CC.sfx(null); }]], function () {
      CC.debrief({
        lvl: 1, powerNeed: 30, win: 'd_win', lose: 'd_lose', factLine: 'd_fact1', next: ['Next: Level 2', CC.level2],
        media: '<video src="' + CC.url('l1Video') + '" muted loop playsinline autoplay></video><p class="credit">Real NASA SDO video, 10 Sep 2017. Credit: NASA/GSFC/SDO</p>',
        fact: 'On 10 September 2017 NASA’s SDO filmed this flare. A cloud left the Sun at about 2,650 km per second, and 16 minutes later satellites near Earth detected very fast particles. <a href="https://ccmc.gsfc.nasa.gov/DONKI/view/SEP/13101/-1" target="_blank" rel="noopener">DONKI record</a> · <a href="https://svs.gsfc.nasa.gov/12706" target="_blank" rel="noopener">NASA SVS</a>'
      });
    });
  }
})(window.CC);
