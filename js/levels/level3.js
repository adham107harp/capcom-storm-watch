/* Level 3 — The Near Miss, 23 July 2012 (Moon). One of the fastest clouds ever seen leaves the Sun.
   Is it coming to the Moon? The player waits for the forecast, reads NASA's real model map, runs the
   greenhouse (food) on a tight power budget, then faces a clearly labelled "what if" round. */
(function (CC) {
  'use strict';
  var $ = CC.$;
  var DAY_POWER = 10; /* air and heat for one day */

  CC.level3 = function () {
    var G = CC.startLevel(3, 'Level 3 · 23 July 2012 · ' + CC.SITES[CC.G.site].name);
    G.clockMode = 'day'; G.day = 1; G.limit = 30; G.goal = Math.max(G.goal, 2);
    G.roverProg = 1; G.crewOut = false; G.shield = 0;
    CC.hud();
    CC.World.shot('sun'); CC.World.flare(); CC.boom(); CC.sfx('WHOOSH!');
    CC.mediaCard('REAL NASA VIDEO', 'video', 'l3Stereo', 'The Sun on 23 July 2012, seen by STEREO-A. The white scratches are fast particles hitting its camera.', 'NASA STEREO · NASA’s Scientific Visualization Studio');
    CC.say(['l3_1', ['l3_2', function () { CC.sfx(null); }], 'l3_3', 'l3_4', ['l3_5', function () { CC.card(null); CC.World.shot('wide'); }]], call1);
  };

  function day(n) {
    var G = CC.G; G.day = n; CC.World.sunDay(n);
    G.power -= DAY_POWER;
    if (G.power <= 0) { G.power = 0; G.failPower = true; }
    CC.hud();
    return !G.failPower;
  }

  /* 1. Before the forecast */
  function call1() {
    var G = CC.G;
    CC.say(['l3_c1_q'], function () {
      CC.ask([
        { icon: 'shield', label: 'Everyone into the shelter now', cost: { power: -10, mission: -1 }, fx: function () { G.inside = true; G.hid = true; }, reply: ['l3_c1_hide'], next: forecast },
        { icon: 'radio', label: 'Call Earth for a forecast', cost: { power: -5 }, reply: ['l3_c1_ask'], next: forecast },
        { icon: 'rock', label: 'Keep working, it’s probably fine', cost: { mission: 1, risk: 'If it’s coming' }, fx: function () { G.gamble = true; G.samiOutside = true; }, reply: ['l3_c1_work'], next: forecast }
      ]);
    });
  }

  /* 2. Read NASA's real model map */
  function forecast() {
    var G = CC.G;
    if (!day(2)) return end();
    G.samiOutside = false;
    CC.mediaCard('REAL NASA MODEL', 'img', 'l3Map', 'Forecast model of the clouds on 25 July 2012 (labels added by us)', 'NASA CCMC Enlil model · NASA’s Scientific Visualization Studio');
    CC.say(['l3_map'], ask2);
  }
  function ask2() {
    var G = CC.G, o = [
      { icon: 'map', label: 'It’s going away. Back to work!', cost: { mission: 1 }, reply: ['l3_c2_away'], next: greenhouse },
      { icon: 'shield', label: 'It’s coming! Hide!', cost: { power: -15, mission: -1 }, fx: function () { G.inside = true; }, reply: ['l3_c2_hide'], next: greenhouse }
    ];
    if (!G.flags.help) o.push({ nour: true, icon: 'idea', label: 'SOL, how do I read this map?', say: 'l3_n_say', cost: { power: -3 }, fx: function () { G.flags.help = 1; }, reply: ['l3_n_sol'], next: ask2 });
    CC.say(['l3_c2_q'], function () { CC.ask(o); });
  }

  /* 3. Food: the greenhouse needs power */
  function greenhouse() {
    var G = CC.G;
    CC.card(null); G.inside = false;
    CC.World.shot('green');
    CC.factCard('REAL NASA SCIENCE · OSDR', 'OSD-772', 'Chile peppers grown on the International Space Station. Plants need light, and light needs power.', 'NASA OSDR, study OSD-772');
    CC.say(['l3_c3_q'], function () {
      CC.ask([
        { icon: 'plant', label: 'Full lamps, big harvest', cost: { power: -25, mission: 1 }, reply: ['l3_c3_full', 'l3_c3_sol'], next: whatIf },
        { icon: 'split', label: 'Half lamps', cost: { power: -12 }, reply: ['l3_c3_half', 'l3_c3_sol'], next: whatIf },
        { icon: 'stop', label: 'Lamps off, eat stored food', cost: { mission: -1 }, fx: function () { G.greenOff = true; }, reply: ['l3_c3_off', 'l3_c3_sol'], next: whatIf }
      ]);
    });
  }

  /* 4. What if it had been aimed at us? Clearly labelled as imagined. */
  function whatIf() {
    var G = CC.G;
    CC.card(null);
    if (!day(3)) return end();
    CC.factCard('WHAT IF? · IMAGINED', '1 week', 'NASA scientists said: if this cloud had left the Sun one week earlier, Earth would have been in its path.', 'NASA Science: Near Miss, The Solar Superstorm of July 2012');
    CC.World.shot('shelter');
    CC.say(['l3_whatif', 'l3_whatif2'], function () {
      CC.card(null);
      CC.ask([
        { icon: 'water', label: 'Stack water bags', cost: { shield: 2, mission: -1 }, reply: ['l3_w_water'], next: impact },
        { icon: 'food', label: 'Stack food boxes', cost: { shield: 1 }, reply: ['l3_w_food'], next: impact },
        { icon: 'dirt', label: 'Shovel Moon dirt on the roof', cost: { shield: 2, power: -10, risk: 'Lina outside' }, fx: function () { G.linaOut = 1; G.dose += 6; }, reply: ['l3_w_dirt'], next: impact },
        { icon: 'clock', label: 'It missed last time. Relax!', cost: { risk: 'No walls' }, reply: ['l3_w_none'], next: impact }
      ]);
    });
  }

  function impact() {
    var G = CC.G;
    G.linaOut = 0; G.inside = true;
    if (G.power <= 0) { G.power = 0; G.failPower = true; }
    G.dose += Math.round(36 / (1 + G.shield));
    CC.hud();
    CC.World.storm(true); CC.boom(); CC.sfx('PRETEND ZAP!'); $('stage').classList.add('impact');
    CC.say([[G.dose < G.limit ? 'l3_i_ok' : 'l3_i_bad', function () { CC.sfx(null); }]], end);
  }

  function end() {
    CC.debrief({
      lvl: 3, powerNeed: 25, win: 'l3_end_win', lose: 'l3_end_lose', factLine: 'l3_d_fact', next: ['Next: Level 4 (Mars)', CC.level4],
      media: '<video src="' + CC.url('l3Enlil') + '" muted loop playsinline autoplay></video><p class="credit">Real NASA model of July 2012: the big cloud misses Earth and reaches STEREO-A. Credit: NASA’s Scientific Visualization Studio, the Space Weather Research Center and CCMC (Enlil)</p>' +
        '<img src="' + CC.url('l3Cme') + '" alt="NASA image of a huge cloud of solar material bursting off the side of the Sun"><p class="credit">The July 2012 eruption. Credit: NASA/SDO/STEREO/ESA/SOHO/Wiessinger</p>',
      fact: 'On 23 July 2012 a cloud left the Sun at about 3,000 km per second, the fastest NASA’s STEREO mission had seen. It missed Earth and the Moon and hit the STEREO-A spacecraft instead. NASA scientists said it was at least as strong as the 1859 Carrington storm, and that one week earlier Earth would have been in its path. The pretend storm at the end was a “what if”. <a href="https://science.nasa.gov/science-news/science-at-nasa/2014/23jul_superstorm/" target="_blank" rel="noopener">NASA Science</a> · <a href="https://svs.gsfc.nasa.gov/4167/" target="_blank" rel="noopener">NASA SVS</a>'
    });
  }
})(window.CC);
