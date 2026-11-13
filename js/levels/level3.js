/* Level 3 — Far From Home, October 2024 (Moon). Race the rover home in 98 minutes; power the shelter or the greenhouse. */
(function (CC) {
  'use strict';
  var $ = CC.$;

  CC.level3 = function () {
    var G = CC.startLevel(3, 'Level 3 · Oct 2024 · ' + CC.SITES[CC.G.site].name);
    G.clockMode = 'min'; G.clock = G.total = 98; G.secPerMin = 1;
    G.crewOut = true; G.roverProg = 0; G.drive = Math.round(70 * G.driveScale); G.shield = 1;
    G.stuckAt = Math.random() < 0.75 ? CC.rand(0.35, 0.6) : 2; /* the wheel does not always get stuck */
    G.onImpact = impact;
    CC.onCrewHome = function () { CC.World.shot('shelter'); };
    CC.World.setRoute(70, -55);
    CC.hud();
    CC.World.shot('sun'); CC.World.flare(); CC.boom(); CC.sfx('X9!');
    CC.mediaCard('REAL NASA IMAGE', 'img', 'l3Flare', 'X9.0 flare, 3 October 2024', 'NASA Solar Dynamics Observatory · NASA/SDO');
    CC.say(['l3_1', ['l3_2', function () { CC.sfx(null); }], 'l3_3', 'l3_4',
      ['l3_5', function () { CC.card(null); CC.G.running = true; CC.World.shot('rover'); }]], call1);
  };

  function startDrive(wait) { var G = CC.G; G.driving = true; G.waitMin = wait || 0; }

  function call1() { CC.say(['l3_c1_q'], function () { CC.ask(call1Opts()); }); }
  function call1Opts() {
    var G = CC.G, o = [
      { icon: 'rover', label: 'Drive home now!', cost: { min: 2 }, fx: function () { startDrive(0); }, reply: ['l3_c1_now'], next: halfway },
      { icon: 'shield', label: 'Park and stay in the cabin', cost: { min: 2, mission: 1, risk: 'Medium dose' }, fx: function () { G.cabin = true; }, reply: ['l3_c1_cabin', 'l3_c1_cabin_sol'], next: call3 },
      { icon: 'rock', label: '20 more minutes of rocks', cost: { min: 2, mission: 2, risk: '+20 min outside' }, fx: function () { startDrive(20); }, reply: ['l3_c1_more'], next: halfway }
    ];
    if (!G.flags.n1) o.push({ nour: true, icon: 'idea', label: 'Drive super fast!', say: 'l3_n1_say', cost: { min: 2 }, fx: function () { G.flags.n1 = 1; }, reply: ['l3_n1_sol'], next: function () { CC.ask(call1Opts()); } });
    return o;
  }
  /* jump ahead to the stuck wheel (or straight on if the wheel holds this time) */
  function halfway() {
    var G = CC.G;
    if (G.stuckAt > 1) return call3();
    var need = G.waitMin + (G.stuckAt - G.roverProg) * G.drive;
    if (need >= G.clock) return call3();
    CC.advance(Math.max(0, need)); G.stuck = true; CC.hud();
    CC.World.shot('rover');
    CC.say(['l3_c2_q'], function () {
      CC.ask([
        { icon: 'tool', label: 'Step out and push', cost: { min: 10, risk: 'Sami outside' }, fx: function () { G.stuck = false; }, reply: ['l3_c2_push'], next: call3 },
        { icon: 'radio', label: 'Use the winch, Lina guides', cost: { min: 5, power: -10 }, fx: function () { G.stuck = false; }, reply: ['l3_c2_winch'], next: call3 },
        { icon: 'shield', label: 'Wait in the cabin', cost: { risk: 'Medium dose' }, fx: function () { G.cabin = true; G.driving = false; }, reply: ['l3_c2_wait'], next: call3 }
      ]);
    });
  }
  function call3() {
    var G = CC.G;
    CC.World.shot('green');
    CC.say(['l3_c3_q'], function () {
      CC.ask([
        { icon: 'shield', label: 'Shelter first', cost: { power: -10, mission: -1 }, fx: function () { G.greenOff = true; }, reply: ['l3_c3_shelter', 'l3_c3_sol'], next: waitStorm },
        { icon: 'plant', label: 'Greenhouse first', cost: { mission: 1, risk: 'Lina outside' }, fx: function () { G.linaGreen = true; G.linaExtra = 8; }, reply: ['l3_c3_green', 'l3_c3_sol'], next: waitStorm },
        { icon: 'split', label: 'Half and half', cost: { power: -15 }, fx: function () { G.linaExtra = 3; }, reply: ['l3_c3_half', 'l3_c3_sol'], next: waitStorm }
      ]);
      CC.factCard('REAL NASA SCIENCE · OSDR', 'OSD-772', 'Chile peppers grown on the International Space Station. Plants need light, and light needs power.', 'NASA OSDR, study OSD-772');
    });
  }
  function waitStorm() {
    var G = CC.G; CC.card(null);
    CC.World.shot(G.crewOut && !G.cabin ? 'rover' : 'shelter');
    CC.say([G.crewOut && !G.cabin ? 'w_out' : 'w_in'], function () {
      CC.goBtn('Skip to the storm', function () { CC.advance(Math.max(0, CC.G.clock)); impact(); });
    });
  }
  function impact() {
    var G = CC.G;
    if (G.impacted) return;
    G.impacted = true; G.running = false; G.clock = 0;
    CC.cancelTalk(); $('answers').hidden = true; CC.hideArrow(); CC.clearIdle();
    var line, hit;
    if (!G.crewOut) { hit = Math.round(16 / (1 + G.shield)); line = 'l3_i_home'; G.inside = true; }
    else if (G.cabin) { hit = 12; line = 'l3_i_cabin'; }
    else { hit = 30; line = 'l3_i_out'; }
    G.dose += hit + (G.linaExtra || 0); G.linaGreen = false; G.power -= 10; CC.hud();
    CC.World.shot('wide'); CC.World.storm(true); CC.boom(); CC.sfx(hit >= 30 ? 'ZZZAP!' : 'FZZT!'); $('stage').classList.add('impact');
    CC.say([[line, function () { CC.sfx(null); }]], function () {
      CC.debrief({
        lvl: 3, powerNeed: 30, win: 'l3_end_win', lose: 'l3_end_lose', factLine: 'l3_d_fact', next: ['Next: Level 4 (Mars)', CC.level4],
        media: '<img src="' + CC.url('l3Flare') + '" alt="NASA SDO image of the X9.0 solar flare on 3 October 2024"><p class="credit">Real NASA SDO image, 3 Oct 2024. Credit: NASA/SDO</p>',
        fact: 'On 3 October 2024 NASA’s SDO filmed an X9.0 flare, the strongest of the solar cycle at that time. On 9 October a cloud left the Sun at about 1,509 km per second, and very fast particles were detected 1 hour 38 minutes later. <a href="https://svs.gsfc.nasa.gov/14701/" target="_blank" rel="noopener">NASA SVS</a> · <a href="https://ccmc.gsfc.nasa.gov/DONKI/view/SEP/33868/-1" target="_blank" rel="noopener">DONKI record</a>'
      });
    });
  }
})(window.CC);
