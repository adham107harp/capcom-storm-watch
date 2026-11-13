/* Level 4 — Dark Skies, June 2018 (Mars). A global dust storm blocks the Sun. The base runs on solar power, and
   messages take 12 minutes, so the player writes three rules in advance and Dr. Omar follows them on his own. */
(function (CC) {
  'use strict';
  var $ = CC.$;

  /* Solar power in (game points) on each sol as the dust thickens, then clears. tau = how dusty the sky is. */
  var SOLS = [
    { tau: 3, sun: 22, line: 'l4_d1' },
    { tau: 5, sun: 12, line: 'l4_d2' },
    { tau: 9, sun: 4, line: 'l4_d3' },
    { tau: 11, sun: 1, line: 'l4_d4' },
    { tau: 4, sun: 8, line: 'l4_d5' }
  ];
  var LIFE = 18;   /* air and heat, every sol */
  var SCIENCE = 8; /* experiments running */
  var RADIO = 6;   /* strong radio link */
  var LOW = 25;    /* "very low battery" for rule three */

  CC.level4 = function () {
    var G = CC.startLevel(4, 'Level 4 · June 2018 · Mars');
    G.clockMode = 'delay'; G.power = 60; G.limit = 40; G.goal = 1; G.mission = 0; G.shield = 1;
    G.roverProg = 1; G.crewOut = false; G.samiOutside = true; G.rules = [];
    $('mD').hidden = true; /* no radiation in this level: the danger is losing power */
    CC.hud();
    CC.World.shot('wide');
    CC.mediaCard('REAL NASA IMAGE', 'img', 'l4Dark', 'How a Mars sky darkens as dust grows, from bright (left) to almost no Sun (right)', 'Simulated view from Opportunity · NASA/JPL-Caltech/TAMU (PIA22521)');
    CC.say(['l4_1', 'l4_2', 'l4_3', 'l4_4', 'l4_sol', ['l4_5', function () { CC.card(null); }]], rule1);
  };

  function rule(q, opts, next) {
    CC.say([q], function () {
      CC.ask(opts.map(function (o) {
        return { icon: o[0], label: o[1], cost: o[2], fx: function () { CC.G.rules.push(o[3]); }, reply: o[4] || [], next: next };
      }));
    });
  }
  function rule1() {
    rule('l4_r1_q', [
      ['shield', 'Stop experiments, save power', { mission: -1 }, 'off', ['l4_nour_r']],
      ['lab', 'Keep working while there is light', { mission: 1, risk: 'Uses power' }, 'work', ['l4_nour_r']],
      ['clock', 'Wait for Earth’s answer', { risk: '24 min round trip' }, 'wait', ['l4_nour_r']]
    ], rule2);
  }
  function rule2() {
    rule('l4_r2_q', [
      ['heat', 'Air and heaters first', { mission: -1 }, 'heat'],
      ['radio', 'Radio to Earth first', { risk: 'Uses power' }, 'radio'],
      ['lab', 'Experiments first', { mission: 1, risk: 'Uses power' }, 'lab']
    ], rule3);
  }
  function rule3() {
    rule('l4_r3_q', [
      ['clock', 'Sleep, wake up to check', { risk: 'Mission −1, no radio' }, 'sleep'],
      ['radio', 'Keep calling Earth', { risk: 'Big power use' }, 'radio'],
      ['rover', 'Drive to the nuclear rover', { risk: 'Power −14, Mission −1' }, 'nuke']
    ], play);
  }

  /* One sol of the storm, following the player's rules. */
  function sol(i) {
    var G = CC.G, R = G.rules, S = SOLS[i];
    if (!S) return finish();
    G.sol = i + 1;
    CC.World.dust(S.tau);
    var use;
    if (G.mode === 'nuke') use = 0;
    else if (G.mode === 'sleep') use = 10;
    else if (G.mode === 'radio') use = LIFE + 8;
    else {
      use = LIFE;
      var science = (R[0] === 'work' && i < 2) || (R[0] === 'wait' && i < 2) || (R[1] === 'lab' && G.power >= 30);
      if (science) use += SCIENCE;
      if (R[1] === 'radio') use += RADIO;
    }
    G.power += S.sun - use;
    var lines = [S.line];
    if (G.power <= 0) { G.power = 0; G.failPower = true; CC.hud(); return CC.say(lines, finish); }
    if (G.power < LOW && !G.mode) {
      G.mode = R[2];
      if (G.mode === 'nuke') { G.power = Math.max(0, G.power - 14); G.mission = Math.max(0, G.mission - 1); }
      if (G.mode === 'sleep') G.mission = Math.max(0, G.mission - 1); /* science stops while asleep */
      lines.push('l4_' + G.mode);
      if (G.power <= 0) { G.failPower = true; CC.hud(); return CC.say(lines, finish); }
    }
    CC.hud();
    if (i === 1) lines.push('l4_curio');
    CC.say(lines, function () {
      if (i === 1) return CC.say(['l4_send_q'], function () {
        CC.goBtn('Send Omar a message', function () { CC.say(['l4_send', 'l4_late'], function () { sol(i + 1); }); }, ['Trust the rules', function () { sol(i + 1); }]);
      });
      sol(i + 1);
    });
  }

  function play() {
    var G = CC.G, R = G.rules;
    G.radioPing = true;
    CC.say(['l4_go'], function () {
      G.radioPing = false; G.samiOutside = false; G.inside = true;
      CC.World.storm(true); CC.sfx('DUST!');
      sol(0);
    });
  }

  function finish() {
    var G = CC.G;
    CC.sfx(null); CC.World.storm(false); CC.World.dust(0);
    CC.say([G.failPower ? 'l4_hurt' : 'l4_safe'], end);
  }

  function end() {
    CC.debrief({
      lvl: 4, powerNeed: 15, noDose: true, win: 'l4_end_win', lose: 'l4_end_lose', factLine: 'l4_d_fact', next: ['Get your certificate', CC.certificate],
      media: '<img src="' + CC.url('l4Globe') + '" alt="Mars seen from orbit in May 2018 with clear surface features, and in July 2018 hidden by a planet-wide dust cloud"><p class="credit">Real NASA MRO images of Mars before (May) and during (July) the 2018 dust storm (PIA22487). Credit: NASA/JPL-Caltech/MSSS</p>' +
        '<img src="' + CC.url('l4Dark') + '" alt="Six simulated views of the Mars sky getting darker as dust grows"><p class="credit">How the sky over Opportunity darkened, dust level (tau) 1 to 11 (PIA22521). Credit: NASA/JPL-Caltech/TAMU</p>',
      fact: 'In June 2018 a dust storm grew until it covered all of Mars. Over NASA’s solar-powered Opportunity rover the dust level (tau) reached about 10.8 on 10 June, so its panels got almost no sunlight. That day it sent its last signal. NASA listened for months, and in February 2019 declared the mission complete, after almost 15 years on a 90-day plan. Curiosity, which runs on nuclear power, kept working. <a href="https://www.jpl.nasa.gov/news/opportunity-hunkers-down-during-dust-storm/" target="_blank" rel="noopener">NASA JPL</a>'
    });
  }
})(window.CC);
