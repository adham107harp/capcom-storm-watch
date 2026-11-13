/* Level 2 — The Big One, May 2024 (Moon). Four days in waves; every day in the shelter costs power. */
(function (CC) {
  'use strict';
  var $ = CC.$;

  CC.level2 = function () {
    var G = CC.startLevel(2, 'Level 2 · May 2024 · ' + CC.SITES[CC.G.site].name);
    G.clockMode = 'day'; G.day = 1; G.limit = 30; G.goal = 2; G.mission = Math.min(G.mission, 1);
    G.roverProg = 1; G.crewOut = false;
    CC.hud();
    CC.World.shot('sun'); CC.World.flare(); CC.boom(); CC.sfx('BOOM!');
    CC.factCard('REAL NASA DATA', '1,330 km/s', 'Speed of one of the clouds that left the Sun on 9 May 2024', 'NASA DONKI record CME 2024-05-09 · more fast clouds followed');
    CC.say(['l2_1', ['l2_2', function () { CC.sfx(null); }], 'l2_3', ['l2_4', function () { CC.card(null); CC.World.shot('wide'); }]], day1);
  };

  function drain() { var G = CC.G; G.power -= 15; if (G.power <= 0) { G.power = 0; G.failPower = true; } CC.hud(); }

  function day1() {
    var G = CC.G; G.day = 1; CC.World.sunDay(1); CC.hud();
    CC.say(['l2_c1_q'], ask1);
  }
  function ask1() {
    var G = CC.G, o = [
      { icon: 'tool', label: 'Fix the antenna first', cost: { power: -5, mission: 1 }, fx: function () { G.samiOutside = true; }, reply: ['l2_c1_fix'], next: wave1 },
      { icon: 'food', label: 'Stock the shelter', cost: { mission: -1, shield: 2, power: 10 }, fx: function () { G.inside = true; }, reply: ['l2_c1_stock'], next: wave1 }
    ];
    if (!G.flags.waves) o.push({ icon: 'ask', label: 'SOL, how many waves?', cost: { power: -3 }, fx: function () { G.flags.waves = 1; }, reply: ['l2_c1_sol'], next: ask1 });
    if (!G.flags.forecast) o.push({ nour: true, icon: 'idea', label: 'Ask Earth for a forecast!', say: 'l2_n_say', cost: { power: -3 }, fx: function () { G.flags.forecast = 1; }, reply: ['l2_n_sol'], next: ask1 });
    CC.ask(o);
  }
  function wave1() {
    var G = CC.G;
    G.day = 2; CC.World.sunDay(2); G.samiOutside = false; G.inside = true;
    CC.World.storm(true); CC.boom(); CC.sfx('WAVE 1!'); $('stage').classList.add('impact');
    G.dose += Math.round(16 / (1 + G.shield)) + Math.floor(Math.random() * 3);
    drain();
    CC.say([['l2_w1', function () { CC.sfx(null); }]], function () {
      CC.World.storm(false); $('stage').classList.remove('impact');
      if (G.failPower) return end();
      day2();
    });
  }
  function day2() {
    var G = CC.G;
    CC.World.shot('shelter');
    CC.say(['l2_c2_q'], function () {
      CC.ask([
        { icon: 'heat', label: 'Heater on, radio low', cost: { power: -8, risk: 'Weak radio later' }, fx: function () { G.radioLow = true; }, reply: ['l2_c2_heat'], next: day3 },
        { icon: 'radio', label: 'Strong radio, wear sweaters', cost: { power: -4, mission: -1 }, reply: ['l2_c2_radio'], next: day3 },
        { icon: 'panel', label: 'Fix the solar tower outside', cost: { power: 25, risk: 'Dose +10' }, fx: function () { G.dose += 10; G.samiOutside = true; }, reply: ['l2_c2_fix', 'l2_c2_fix_sol'], next: function () { G.samiOutside = false; day3(); } }
      ]);
    });
  }
  function day3() {
    var G = CC.G; G.day = 3; CC.World.sunDay(3); drain();
    if (G.failPower) return end();
    /* a different real fact on different playthroughs */
    if (Math.random() < 0.5) {
      CC.factCard('REAL NASA FACT', '~90 → +1,000', 'Cosmic particles through a golf-ball-sized space every second, and about how many more a solar storm can add', 'NASA Science: How NASA Will Protect Astronauts From Space Radiation at the Moon');
      CC.say(['l2_fact'], function () { CC.card(null); day4(); });
    } else {
      CC.factCard('REAL NASA SCIENCE · OSDR', 'OSD-340', 'A study in NASA’s Open Science Data Repository on how simulated space radiation affects blood-forming cells in mice', 'NASA OSDR, study OSD-340');
      CC.say(['osdr_l2'], function () { CC.card(null); day4(); });
    }
  }
  function day4() {
    var G = CC.G; G.day = 4; CC.World.sunDay(4); drain();
    if (G.failPower) return end();
    CC.World.shot('wide');
    CC.say(['l2_c3_q'], function () {
      var o = [
        { icon: 'shield', label: 'Stay in. SOL, check the data!', cost: { mission: -1 }, off: G.radioLow ? 'Radio too weak' : null, fx: function () { G.choice4 = 'stay'; }, reply: ['l2_c3_stay'], next: wave2 },
        { icon: 'door', label: 'Ten minutes outside', cost: { mission: 1, risk: 'If particles return' }, fx: function () { G.choice4 = 'short'; G.samiOutside = true; }, reply: ['l2_c3_short'], next: wave2 },
        { icon: 'rock', label: 'Out you go!', cost: { mission: 2, risk: 'Big dose if wrong' }, fx: function () { G.choice4 = 'out'; G.samiOutside = true; G.inside = false; }, reply: ['l2_c3_out'], next: wave2 }
      ];
      if (G.flags.forecast) o.push({ nour: true, icon: 'idea', label: 'Remember the forecast. Stay in!', cost: { mission: -1 }, fx: function () { G.choice4 = 'stay'; }, reply: ['l2_c3_stay'], next: wave2 });
      CC.ask(o);
    });
  }
  function wave2() {
    var G = CC.G;
    CC.World.storm(true); CC.boom(); CC.sfx('SURPRISE!'); $('stage').classList.add('impact');
    G.dose += G.choice4 === 'out' ? 24 : G.choice4 === 'short' ? 12 : Math.round(10 / (1 + G.shield));
    CC.hud();
    CC.say([['l2_w3', function () { CC.sfx(null); }]], function () { G.samiOutside = false; G.inside = true; end(); });
  }
  function end() {
    CC.debrief({
      lvl: 2, powerNeed: 20, win: 'l2_end_win', lose: 'l2_end_lose', factLine: 'l2_d_fact', next: ['Next: Level 3', CC.level3],
      media: '<video src="' + CC.url('l2Aurora') + '" muted loop playsinline autoplay></video><p class="credit">Real aurora over Bear Lake, USA, May 2024. Credit: NASA/Bill Dunford</p>' +
        '<img src="' + CC.url('l2Belts') + '" alt="Illustration of two new temporary radiation belts around Earth"><p class="credit">Two new temporary belts found after the May 2024 storm. Credit: NASA/GSFC/Kristen Perrin</p>',
      fact: 'In May 2024 Earth had its strongest geomagnetic storm in over 20 years (Kp 9 in DONKI). NASA found two new temporary radiation belts, and fast particles came back on 13 May. <a href="https://svs.gsfc.nasa.gov/14835/" target="_blank" rel="noopener">NASA SVS</a> · <a href="https://ccmc.gsfc.nasa.gov/DONKI/view/SEP/30817/-1" target="_blank" rel="noopener">DONKI 13 May</a>'
    });
  }
})(window.CC);
