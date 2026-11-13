/* CAPCOM: Storm Watch — core: namespace, assets, game state, small helpers. */
window.CC = window.CC || {};
(function (CC) {
  'use strict';

  CC.$ = function (id) { return document.getElementById(id); };

  /* ---------- assets ----------
     Multi-file version loads files from /assets.
     The single-file build sets window.CC_EMBED = { key: dataURI } and everything is read from there. */
  CC.ASSETS = {
    titleImg: 'assets/media/title_orion.jpg',
    moonColor: 'assets/media/moon_color.jpg',
    moonDem: 'assets/media/moon_dem.jpg',
    l1Video: 'assets/media/l1_x8.webm',
    l2Belts: 'assets/media/l2_belts.jpg',
    l2Aurora: 'assets/media/l2_aurora.webm',
    l3Stereo: 'assets/media/l3_stereo.webm',
    l3Map: 'assets/media/l3_map.jpg',
    l3Enlil: 'assets/media/l3_enlil.webm',
    l3Cme: 'assets/media/l3_cme.jpg',
    l4Dark: 'assets/media/l4_dark.jpg',
    l4Globe: 'assets/media/l4_globe.jpg',
    solModel: 'assets/models/sol.glb'
  };
  var blobCache = {};
  function dataToBlobURL(d) {
    var parts = d.split(','), mime = parts[0].split(':')[1].split(';')[0], bin = atob(parts[1]);
    var u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([u], { type: mime }));
  }
  /* URL for an asset key, or an audio line id ("audio:<id>") */
  CC.url = function (key) {
    var E = window.CC_EMBED;
    if (E && E[key]) {
      if (!blobCache[key]) { try { blobCache[key] = dataToBlobURL(E[key]); } catch (e) { blobCache[key] = E[key]; } }
      return blobCache[key];
    }
    if (key.indexOf('audio:') === 0) return 'assets/audio/' + key.slice(6) + '.mp3';
    return CC.ASSETS[key];
  };
  CC.arrayBuffer = function (key) {
    var E = window.CC_EMBED;
    if (E && E[key]) {
      var bin = atob(E[key].split(',')[1]), u = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      return Promise.resolve(u.buffer);
    }
    return fetch(CC.ASSETS[key]).then(function (r) { if (!r.ok) throw new Error('asset ' + key); return r.arrayBuffer(); });
  };

  /* ---------- base sites (Level 0) ---------- */
  CC.SITES = {
    sunny:  { name: 'Sunny ridge',     good: 'Lots of sun = lots of power', bad: 'Far from icy craters', fx: 'Start power 95 · Need 2 mission stars', apply: function (g) { g.power = 95; g.goal = 2; } },
    crater: { name: 'Shadowed crater', good: 'Ice and big science',         bad: 'Less sun = less power', fx: 'Start power 60 · 1 mission star free', apply: function (g) { g.power = 60; g.mission = 1; g.goal = 2; } },
    plain:  { name: 'Flat plain',      good: 'Safe landing, short drives',  bad: 'Low Earth = weak radio', fx: 'Start power 80 · Drives 25% shorter · Radio static', apply: function (g) { g.power = 80; g.driveScale = 0.75; g.radioDrop = true; } }
  };
  CC.REGIONS = ['Peak near Cabeus B', 'Haworth', 'Malapert Massif', 'Mons Mouton Plateau', 'Mons Mouton', 'Nobile Rim 1', 'Nobile Rim 2', 'de Gerlache Rim 2', 'Slater Plain'];

  /* ---------- game state ---------- */
  CC.G = { site: 'sunny', lvl: 0 };
  CC.reset = function (lvl) {
    var site = CC.G.site;
    var G = {
      site: site, lvl: lvl, planet: lvl === 4 ? 'mars' : 'moon',
      power: 80, dose: 0, limit: 30, mission: 0, goal: 1, shield: 0,
      clock: 0, total: 0, running: false, impacted: false, impactPending: false,
      driveScale: 1, radioDrop: false, flags: {},
      /* rover: crew outside until progress reaches 1 */
      crewOut: false, driving: false, waitMin: 0, drive: 8, roverProg: 1, stuck: false,
      linaOut: 0, day: 1
    };
    if (lvl !== 4) CC.SITES[site].apply(G);
    CC.G = G;
    return G;
  };
  /* advance game time (minutes). Moves the rover and Lina's outdoor job. */
  CC.advance = function (min) {
    var G = CC.G;
    if (min <= 0) return;
    G.clock -= min;
    if (G.driving && !G.stuck) {
      var m = min;
      if (G.waitMin > 0) { var w = Math.min(G.waitMin, m); G.waitMin -= w; m -= w; }
      if (m > 0) { G.roverProg = Math.min(1, G.roverProg + m / G.drive); }
      if (G.roverProg >= 1 && G.crewOut) { G.crewOut = false; G.driving = false; if (CC.onCrewHome) CC.onCrewHome(); }
    }
    if (G.linaOut > 0) { G.linaOut = Math.max(0, G.linaOut - min); if (G.linaOut === 0) { G.shield = Math.min(3, G.shield + 2); } }
  };

  /* ---------- saved stars (per viewer, optional) ---------- */
  CC.SAVE = { l1: 0, l2: 0, l3: 0, l4: 0 };
  try { var sv = JSON.parse(localStorage.getItem('capcom_stars') || '{}'); for (var k in CC.SAVE) CC.SAVE[k] = sv[k] || 0; } catch (e) { /* storage blocked: play without saving */ }
  CC.saveStars = function () { try { localStorage.setItem('capcom_stars', JSON.stringify(CC.SAVE)); } catch (e) { /* ignore */ } };

  CC.rand = function (a, b) { return a + Math.random() * (b - a); };
})(window.CC);
