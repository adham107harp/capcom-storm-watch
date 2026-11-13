/* Level 4 — Too Far to Talk, 20 May 2024 (Mars). Messages take 12 minutes, so the player writes flight rules first. */
(function (CC) {
  'use strict';
  var $ = CC.$;

  CC.level4 = function () {
    var G = CC.startLevel(4, 'Level 4 · 20 May 2024 · Mars');
    G.clockMode = 'delay'; G.power = 70; G.limit = 40; G.goal = 1; G.mission = 0; G.shield = 1;
    G.roverProg = 1; G.crewOut = false; G.samiOutside = true; G.rules = [];
    CC.hud();
    CC.World.shot('sun'); CC.World.flare(); CC.boom(); CC.sfx('X12!');
    CC.factCard('REAL NASA DATA', 'X12 (estimated)', 'Size of the flare on 20 May 2024 that sent particles to Mars', 'NASA JPL: NASA Watches Mars Light Up During Epic Solar Storm');
    CC.say(['l4_1', ['l4_2', function () { CC.sfx(null); }], 'l4_3', 'l4_4', 'l4_sol', ['l4_5', function () { CC.card(null); CC.World.shot('wide'); }]], rule1);
  };

  function rule(q, opts, next) {
    CC.say([q], function () {
      CC.ask(opts.map(function (o) { return { icon: o[0], label: o[1], cost: o[2], fx: function () { CC.G.rules.push(o[3]); }, reply: o[4] || [], next: next }; }));
    });
  }
  function rule1() {
    rule('l4_r1_q', [
      ['shield', 'Go to the shelter at once', { mission: -1 }, 'shelter', ['l4_nour_r']],
      ['rover', 'Finish the drive first', { mission: 1, risk: 'Dose' }, 'drive', ['l4_nour_r']],
      ['clock', 'Wait for Earth’s answer', { risk: '24 min round trip' }, 'wait', ['l4_nour_r']]
    ], rule2);
  }
  function rule2() {
    rule('l4_r2_q', [
      ['shield', 'Shelter first', { power: -10, mission: -1 }, 'shelter'],
      ['radio', 'Radio first', { power: -5, risk: 'Some dose' }, 'radio'],
      ['lab', 'Experiments first', { mission: 1, risk: 'Power and dose' }, 'lab']
    ], rule3);
  }
  function rule3() {
    rule('l4_r3_q', [
      ['clock', 'Wait up to an hour', { risk: 'Crew waits' }, 'wait'],
      ['map', 'Drive back by map', { mission: 1, risk: 'Some dose' }, 'map'],
      ['stop', 'Stop all work', { mission: -1 }, 'stop']
    ], play);
  }

  function play() {
    var G = CC.G, R = G.rules;
    G.radioPing = true;
    CC.say(['l4_go'], function () {
      G.radioPing = false;
      CC.World.storm(true); CC.boom(); CC.sfx('SNOW!'); $('stage').classList.add('impact');
      if (R[0] === 'shelter') { G.dose += 4; G.samiOutside = false; G.inside = true; }
      else if (R[0] === 'drive') { G.dose += 12 + Math.floor(Math.random() * 3); G.samiOutside = false; G.inside = true; }
      else { G.dose += 20 + Math.floor(Math.random() * 3); }
      CC.hud();
      CC.say([['l4_e1', function () { CC.sfx(null); }], 'l4_send_q'], function () {
        CC.goBtn('Send Omar a message', function () { CC.say(['l4_send', 'l4_late'], part2); }, ['Trust the rules', part2]);
      });
    });
  }
  function part2() {
    var G = CC.G, R = G.rules;
    if (R[1] === 'shelter') { G.samiOutside = false; G.inside = true; }
    else if (R[1] === 'radio') { G.dose += 6; }
    else { G.dose += 10; G.power -= 25; }
    G.power -= 15; CC.hud();
    CC.say(['l4_e2', 'l4_relay'], function () {
      if (R[2] === 'map') G.dose += 6;
      CC.hud();
      CC.say(['l4_e3'], function () {
        if (G.power <= 0) { G.power = 0; G.failPower = true; }
        G.samiOutside = false; G.inside = true; CC.hud();
        var ok = G.dose < G.limit && !G.failPower;
        CC.say([ok ? 'l4_safe' : 'l4_hurt'], end);
      });
    });
  }
  function end() {
    CC.debrief({
      lvl: 4, powerNeed: 20, win: 'l4_end_win', lose: 'l4_end_lose', factLine: 'l4_d_fact', next: ['Get your certificate', CC.certificate],
      media: '<video src="' + CC.url('l4Maven') + '" muted loop playsinline autoplay></video><p class="credit">Real NASA MAVEN data: aurora over Mars during the May 2024 storm (PIA26304). Credit: NASA/University of Colorado/LASP</p>' +
        '<img src="' + CC.url('l4Snow') + '" alt="Curiosity navigation camera image speckled with white dots from solar particles"><p class="credit">Real Curiosity camera image with “snow” from particles (PIA26302). Credit: NASA/JPL-Caltech</p>',
      fact: 'On 20 May 2024 a flare later estimated at X12 erupted. Curiosity’s RAD instrument measured that an astronaut next to the rover would have received 8,100 micrograys, about 30 chest X-rays. MAVEN saw auroras over all of Mars, and Mars Odyssey’s star camera was knocked out and came back within an hour. <a href="https://www.jpl.nasa.gov/news/nasa-watches-mars-light-up-during-epic-solar-storm/" target="_blank" rel="noopener">NASA JPL</a>'
    });
  }
})(window.CC);
