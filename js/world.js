/* CAPCOM: Storm Watch — 3D world: the real Moon globe (NASA LRO/LOLA maps) and the surface (Moon or Mars). */
(function (CC) {
  'use strict';
  var noop = function () {};
  CC.World = { mode: noop, globeShot: noop, shot: noop, flare: noop, storm: noop, setSite: noop, setPlanet: noop, setRoute: noop, reset: noop, wave: noop, sunDay: noop, kickAt: noop };

  CC.initWorld = function () {
    if (typeof THREE === 'undefined') return;
    var cv = CC.$('gl'), R;
    try { R = new THREE.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e) { return; }
    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
    R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
    var clk = new THREE.Clock(), MODE = 'globe';
    var cam = new THREE.PerspectiveCamera(42, 1.6, 0.1, 1200);
    function loadTex(key, cb) { var i = new Image(); i.onload = function () { cb(i); }; i.src = CC.url(key); }
    function starField(n, upper) {
      var p = new Float32Array(n * 3);
      for (var i = 0; i < n; i++) { var u = Math.random() * 6.28, v = Math.acos(2 * Math.random() - 1), y = 500 * Math.cos(v); p[i * 3] = 500 * Math.sin(v) * Math.cos(u); p[i * 3 + 1] = upper ? Math.abs(y) : y; p[i * 3 + 2] = 500 * Math.sin(v) * Math.sin(u); }
      var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.3, sizeAttenuation: false }));
    }
    function glowTex(c1, c2) {
      var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, c1); gr.addColorStop(0.25, c2); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    }

    /* ---------- globe ---------- */
    var GS = new THREE.Scene(); GS.background = new THREE.Color(0x000000);
    var gsun = new THREE.DirectionalLight(0xffffff, 1.6); gsun.position.set(-18, -8, 30); GS.add(gsun); GS.add(new THREE.AmbientLight(0x334466, 0.45));
    var moonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0, displacementScale: 0.35 });
    var moon = new THREE.Mesh(new THREE.SphereGeometry(10, 160, 80), moonMat); GS.add(moon);
    loadTex('moonColor', function (i) { var t = new THREE.Texture(i); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; t.needsUpdate = true; moonMat.map = t; moonMat.needsUpdate = true; });
    loadTex('moonDem', function (i) { var t = new THREE.Texture(i); t.needsUpdate = true; moonMat.displacementMap = t; moonMat.bumpMap = t; moonMat.bumpScale = 0.6; moonMat.needsUpdate = true; });
    var ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.05, 8, 64), new THREE.MeshBasicMaterial({ color: 0xffc21a })); ring.rotation.x = Math.PI / 2; ring.position.y = -10.25; GS.add(ring);
    GS.add(starField(1500, false));
    var gShot = 'far', gPos = new THREE.Vector3(0, 4, 40), gLook = new THREE.Vector3();

    /* ---------- surface ---------- */
    var S = new THREE.Scene(); S.background = new THREE.Color(0x000000);
    var SUNPOS = new THREE.Vector3(), sunAz = 0, TH0 = Math.atan2(-150, -260);
    var hemi = new THREE.HemisphereLight(0x8ea4ff, 0x2a2730, 0.25); S.add(hemi);
    var sun = new THREE.DirectionalLight(0xfff3dc, 2.2); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    var sc = sun.shadow.camera; sc.left = -34; sc.right = 34; sc.top = 34; sc.bottom = -34; sc.near = 1; sc.far = 300; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04;
    S.add(sun); S.add(sun.target);
    var sunBall = new THREE.Mesh(new THREE.SphereGeometry(9, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff6dc })); S.add(sunBall);
    var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,248,230,1)', 'rgba(255,190,110,.5)'), blending: THREE.AdditiveBlending, depthWrite: false })); halo.scale.set(80, 80, 1); S.add(halo);
    var stars = starField(1400, true); S.add(stars);
    var earthTex = (function () {
      var c = document.createElement('canvas'); c.width = 256; c.height = 128; var g = c.getContext('2d'); g.fillStyle = '#1e5fc4'; g.fillRect(0, 0, 256, 128);
      g.fillStyle = '#3f9a5a'; for (var i = 0; i < 14; i++) { g.beginPath(); g.ellipse(Math.random() * 256, 20 + Math.random() * 90, 10 + Math.random() * 24, 6 + Math.random() * 12, Math.random() * 3, 0, 6.3); g.fill(); }
      g.fillStyle = 'rgba(255,255,255,.8)'; for (i = 0; i < 16; i++) { g.beginPath(); g.ellipse(Math.random() * 256, Math.random() * 128, 14 + Math.random() * 28, 2 + Math.random() * 4, 0, 0, 6.3); g.fill(); }
      var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
    })();
    var earth = new THREE.Mesh(new THREE.SphereGeometry(7, 32, 24), new THREE.MeshStandardMaterial({ map: earthTex, emissive: 0x0d2a66, emissiveIntensity: 0.5, roughness: 0.8 })); S.add(earth);

    /* regolith texture: tileable noise -> colour + normal map */
    var N = 256, hn = (function () {
      var a = new Float32Array(N * N), waves = [];
      for (var w = 0; w < 26; w++) { var span = w < 8 ? 4 : w < 16 ? 12 : 40; var k = 1 + Math.floor(Math.random() * span), l = Math.floor(Math.random() * span) - span / 2; waves.push([k, l, Math.random() * 6.28, 1 / (1 + Math.sqrt(k * k + l * l) * 0.6)]); }
      for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { var v = 0; for (var i = 0; i < waves.length; i++) { var W = waves[i]; v += W[3] * Math.sin(6.2832 * (W[0] * x + W[1] * y) / N + W[2]); } a[y * N + x] = v; }
      var mn = 1e9, mx = -1e9; for (var j = 0; j < a.length; j++) { mn = Math.min(mn, a[j]); mx = Math.max(mx, a[j]); }
      for (j = 0; j < a.length; j++) a[j] = ((a[j] - mn) / (mx - mn)) * 0.75 + Math.random() * 0.25;
      return a;
    })();
    function texFrom(fn) {
      var c = document.createElement('canvas'); c.width = c.height = N; var g = c.getContext('2d'), d = g.createImageData(N, N);
      for (var i = 0; i < N * N; i++) { var p = fn(i); d.data[i * 4] = p[0]; d.data[i * 4 + 1] = p[1]; d.data[i * 4 + 2] = p[2]; d.data[i * 4 + 3] = 255; }
      g.putImageData(d, 0, 0); var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(24, 24); t.anisotropy = 8; return t;
    }
    var colTex = texFrom(function (i) { var v = 118 + hn[i] * 70; return [v, v * 0.98, v * 0.95]; }); colTex.encoding = THREE.sRGBEncoding;
    var nrmTex = texFrom(function (i) {
      var x = i % N, y = (i / N) | 0, l = hn[y * N + (x + N - 1) % N], r = hn[y * N + (x + 1) % N], u = hn[((y + N - 1) % N) * N + x], dn = hn[((y + 1) % N) * N + x];
      var nx = (l - r) * 3, ny = (u - dn) * 3, nz = 1, len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      return [(nx / len * 0.5 + 0.5) * 255, (ny / len * 0.5 + 0.5) * 255, (nz / len * 0.5 + 0.5) * 255];
    });
    var groundMat = new THREE.MeshStandardMaterial({ map: colTex, normalMap: nrmTex, normalScale: new THREE.Vector2(1.4, 1.4), roughness: 1, metalness: 0, vertexColors: true });

    var SITE = 'sunny', PLANET = 'moon', BY = 0, CC_ = { x: -18, z: -16 }, craters = [];
    for (var q = 0; q < 34; q++) { var cr = { x: (Math.random() - 0.5) * 220, z: (Math.random() - 0.5) * 220, r: 1.5 + Math.pow(Math.random(), 2) * 9 }; if (Math.hypot(cr.x, cr.z) > 15) craters.push(cr); }
    function ss(e0, e1, x) { var k = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return k * k * (3 - 2 * k); }
    function craterH(x, z) { var h = 0; for (var i = 0; i < craters.length; i++) { var c = craters[i], d = Math.hypot(x - c.x, z - c.z) / c.r; if (d < 1) h += -(1 - d * d) * c.r * 0.28; else if (d < 1.6) h += Math.exp(-(d - 1) * (d - 1) * 14) * c.r * 0.1; } return h; }
    function H(x, z) {
      var d = Math.hypot(x, z), n = Math.sin(x * 0.07) * Math.cos(z * 0.06) * 0.9 + Math.sin(x * 0.19 + z * 0.13) * 0.3, e = d > 55 ? (d - 55) * 0.08 : 0, cH = craterH(x, z);
      if (PLANET === 'mars') return n * 1.2 + e * 0.6 + cH * 0.4 + 5 * Math.exp(-((x + 50) * (x + 50) + (z + 90) * (z + 90)) / 900);
      if (SITE === 'sunny') return 7 * ss(28, 13, d) + n + e + cH * 0.7 + 3 * Math.exp(-((x - 34) * (x - 34) + (z + 44) * (z + 44)) / 600);
      if (SITE === 'crater') { var dc = Math.hypot(x - CC_.x, z - CC_.z); return n + e + cH * 0.7 + (dc < 15 ? -8 * (1 - (dc / 15) * (dc / 15)) : 0) + 2 * Math.exp(-(dc - 15) * (dc - 15) / 7); }
      return n * 0.3 + e * 0.5 + cH * 0.5 + 16 * Math.exp(-((x - 36) * (x - 36) + (z + 125) * (z + 125)) / 800);
    }
    var gg = new THREE.PlaneGeometry(320, 320, 110, 110); gg.rotateX(-Math.PI / 2);
    var gpos = gg.attributes.position; gg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(gpos.count * 3), 3));
    var ground = new THREE.Mesh(gg, groundMat); ground.receiveShadow = true; S.add(ground);
    var rockGeo = new THREE.DodecahedronGeometry(1, 1);
    (function () { var p = rockGeo.attributes.position; for (var i = 0; i < p.count; i++) { var f = 0.75 + Math.random() * 0.5; p.setXYZ(i, p.getX(i) * f, p.getY(i) * f * 0.7, p.getZ(i) * f); } rockGeo.computeVertexNormals(); })();
    var rockMat = new THREE.MeshStandardMaterial({ color: 0x8e8b90, roughness: 0.95, map: colTex });
    var rocks = new THREE.InstancedMesh(rockGeo, rockMat, 160); rocks.receiveShadow = true; S.add(rocks);
    var rockData = []; for (var r2 = 0; r2 < 160; r2++) { var a = Math.random() * 6.28, dd = 8 + Math.pow(Math.random(), 0.7) * 110; rockData.push([Math.cos(a) * dd, Math.sin(a) * dd, 0.12 + Math.pow(Math.random(), 3) * 1.4, Math.random() * 6.28]); }
    function buildGround() {
      var col = gg.attributes.color, mars = PLANET === 'mars';
      for (var i = 0; i < gpos.count; i++) {
        var x = gpos.getX(i), z = gpos.getZ(i); gpos.setY(i, H(x, z));
        var t = 0.82 + 0.18 * Math.sin(x * 0.9 + z * 1.3) * Math.cos(z * 0.7), dk = 0;
        if (!mars && SITE === 'crater') { var dc = Math.hypot(x - CC_.x, z - CC_.z); if (dc < 14) dk = 0.65 * (1 - dc / 14); }
        var c = Math.max(0.2, t - dk);
        if (mars) col.setXYZ(i, c * 1.0, c * 0.52, c * 0.32); else col.setXYZ(i, c, c, c * (SITE === 'crater' ? 1.04 : 1));
      }
      gpos.needsUpdate = true; col.needsUpdate = true; gg.computeVertexNormals();
      var m = new THREE.Matrix4(), qq = new THREE.Quaternion(), sc2 = new THREE.Vector3(), ps = new THREE.Vector3();
      for (var k = 0; k < rockData.length; k++) {
        var R2 = rockData[k], s = Math.hypot(R2[0], R2[1]) < 12 ? 0 : R2[2];
        ps.set(R2[0], H(R2[0], R2[1]) + s * 0.25, R2[1]); qq.setFromEuler(new THREE.Euler(R2[3] * 0.3, R2[3], 0)); sc2.set(s, s, s); m.compose(ps, qq, sc2); rocks.setMatrixAt(k, m);
      }
      rocks.instanceMatrix.needsUpdate = true;
      rockMat.color.setHex(mars ? 0x8a4a30 : 0x8e8b90);
    }
    var NI = 200, ip = new Float32Array(NI * 3), ig = new THREE.BufferGeometry(); ig.setAttribute('position', new THREE.BufferAttribute(ip, 3));
    var ice = new THREE.Points(ig, new THREE.PointsMaterial({ color: 0xcff2ff, size: 0.32, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); ice.visible = false; S.add(ice);

    /* ---------- base ---------- */
    function M(c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.1 }, o || {})); }
    var base = new THREE.Group(); S.add(base);
    var hab = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 7, 40), M(0xf2f2f6, { roughness: 0.45 })); hab.rotation.z = Math.PI / 2; hab.position.set(0, 2.1, 0); hab.castShadow = hab.receiveShadow = true; base.add(hab);
    [-3.5, 3.5].forEach(function (x) { var cap = new THREE.Mesh(new THREE.SphereGeometry(1.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), M(0xf2f2f6, { roughness: 0.45 })); cap.rotation.z = x > 0 ? -Math.PI / 2 : Math.PI / 2; cap.position.set(x, 2.1, 0); cap.castShadow = true; base.add(cap); });
    [-2, 0, 2].forEach(function (x) { var b = new THREE.Mesh(new THREE.TorusGeometry(1.93, 0.07, 8, 40), M(0xb9bcc8, { metalness: 0.6 })); b.rotation.y = Math.PI / 2; b.position.set(x, 2.1, 0); base.add(b); });
    var foil = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 1, 40, 1, true, 0, Math.PI), M(0xd9a531, { metalness: 0.9, roughness: 0.3 })); foil.rotation.z = Math.PI / 2; foil.position.set(-1, 2.1, 0); base.add(foil);
    [[-2.6, -1.2], [-2.6, 1.2], [2.6, -1.2], [2.6, 1.2]].forEach(function (p) { var l = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.2, 10), M(0x9aa0b0, { metalness: 0.7 })); l.position.set(p[0], 0.6, p[1]); base.add(l); });
    var lamps = []; for (var k3 = 0; k3 < 4; k3++) { var lw = new THREE.Mesh(new THREE.CircleGeometry(0.24, 16), new THREE.MeshBasicMaterial({ color: 0xffd27a })); lw.position.set(-2.4 + k3 * 1.6, 2.3, 1.93); base.add(lw); lamps.push(lw); }
    var habLight = new THREE.PointLight(0xffc77a, 0.8, 8); habLight.position.set(0, 2.2, 3); base.add(habLight);
    var shelter = new THREE.Group(); shelter.position.set(-7, 0, 2); base.add(shelter);
    var berm = new THREE.Mesh(new THREE.SphereGeometry(3, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), groundMat); berm.scale.set(1, 0.75, 1); berm.castShadow = berm.receiveShadow = true; shelter.add(berm);
    berm.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(berm.geometry.attributes.position.count * 3).fill(0.8), 3));
    var doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 0.5), M(0xd8d8e2, { metalness: 0.5 })); doorFrame.position.set(0, 0.85, 2.75); shelter.add(doorFrame);
    var door = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 0.2), M(0x48d1ff, { emissive: 0x0b3a5a, emissiveIntensity: 0.5 })); door.position.set(0, 0.75, 3.02); shelter.add(door);
    var shLight = new THREE.PointLight(0x48d1ff, 0, 7); shLight.position.set(0, 1.2, 3.6); shelter.add(shLight);
    var walls = []; for (var w2 = 0; w2 < 3; w2++) { var wl = new THREE.Mesh(new THREE.SphereGeometry(3.15 + w2 * 0.2, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x48d1ff, transparent: true, opacity: 0, depthWrite: false, wireframe: true })); wl.scale.set(1, 0.75, 1); shelter.add(wl); walls.push(wl); }
    /* greenhouse (food production) */
    var green = new THREE.Group(); green.position.set(5.5, 0, 4.5); base.add(green);
    var gBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.7, 0.4, 24), M(0xdedfe8)); gBase.position.y = 0.2; green.add(gBase);
    var gDome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xbfffd4, transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false })); gDome.position.y = 0.4; green.add(gDome);
    var plants = []; for (var pi = 0; pi < 7; pi++) { var pl = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 6), new THREE.MeshStandardMaterial({ color: 0x3fd16b, emissive: 0x1d7a3a, emissiveIntensity: 0.4 })); pl.position.set((Math.random() - 0.5) * 2, 0.7, (Math.random() - 0.5) * 2); green.add(pl); plants.push(pl); }
    var gLight = new THREE.PointLight(0xff66ff, 0.8, 5); gLight.position.set(0, 1.5, 0); green.add(gLight);
    var tower = new THREE.Group(); tower.position.set(6.5, 0, -3.5); base.add(tower);
    var mast = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 10, 12), M(0xd8d8e2, { metalness: 0.6 })); mast.position.y = 5; mast.castShadow = true; tower.add(mast);
    var arrTex = (function () { var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d'); g.fillStyle = '#1b2f7a'; g.fillRect(0, 0, 128, 128); g.strokeStyle = '#8fa6ff'; g.lineWidth = 2; for (var i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 16, 0); g.lineTo(i * 16, 128); g.stroke(); g.beginPath(); g.moveTo(0, i * 16); g.lineTo(128, i * 16); g.stroke(); } var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t; })();
    var arr = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5.6, 2.8), M(0xffffff, { map: arrTex, metalness: 0.6, roughness: 0.25 })); arr.position.y = 6.6; arr.castShadow = true; tower.add(arr);
    var dish = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 12, 0, Math.PI * 2, 0, 1.05), M(0xffffff, { side: THREE.DoubleSide, roughness: 0.4 })); dish.position.set(3.4, 4.4, 1.2); dish.rotation.set(-1, 0.5, 0); base.add(dish);
    var dpole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.8, 10), M(0xd8d8e2, { metalness: 0.6 })); dpole.position.set(3.4, 2.1, 1.2); base.add(dpole);
    var ping = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 6, 40), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0 })); ping.position.set(3.4, 5.2, 1.2); ping.rotation.x = Math.PI / 2; base.add(ping);

    /* ---------- rover ---------- */
    var rover = new THREE.Group();
    var body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 2), M(0xf2f2f6)); body.position.y = 1.15; body.castShadow = true; rover.add(body);
    var cab = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M(0x1a2847, { metalness: 0.6, roughness: 0.15 })); cab.scale.set(1.1, 0.6, 0.95); cab.position.set(0.7, 1.72, 0); rover.add(cab);
    var rs = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.16, 2.02), M(0xff6b1a)); rs.position.y = 0.78; rover.add(rs);
    var wheels = [];
    [[-1.15, -1.1], [-1.15, 1.1], [1.15, -1.1], [1.15, 1.1]].forEach(function (w) {
      var wh = new THREE.Group(), tire = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.38, 20), M(0x2a2a30, { roughness: 0.9 })); tire.rotation.x = Math.PI / 2; wh.add(tire);
      var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.4, 12), M(0xc0c4d0, { metalness: 0.8 })); hub.rotation.x = Math.PI / 2; wh.add(hub);
      wh.position.set(w[0], 0.5, w[1]); rover.add(wh); wheels.push(wh);
    });
    rover.traverse(function (o) { o.userData.pick = 'rover'; }); S.add(rover);

    /* ---------- astronauts ---------- */
    function astro(c, name) {
      var g = new THREE.Group(), w = M(0xf4f4f6, { roughness: 0.7 });
      var torso = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.4, 0.9, 16), w); torso.position.y = 1.1; g.add(torso);
      var stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.41, 0.41, 0.12, 16), M(c)); stripe.position.y = 1.15; g.add(stripe);
      var helm = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 14), w); helm.position.y = 1.8; g.add(helm);
      var vis = new THREE.Mesh(new THREE.SphereGeometry(0.29, 20, 12), M(0xd8a43a, { metalness: 1, roughness: 0.12 })); vis.scale.set(1, 0.8, 0.62); vis.position.set(0, 1.8, 0.22); g.add(vis);
      var pk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.78, 0.34), M(0xdedfe8)); pk.position.set(0, 1.15, -0.38); g.add(pk);
      var legs = [], arms = [];
      [-1, 1].forEach(function (s) {
        var lp = new THREE.Group(); lp.position.set(s * 0.17, 0.68, 0);
        var lg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.62, 10), w); lg.position.y = -0.31; lp.add(lg);
        var bt = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.36), M(0x9a9aa6)); bt.position.set(0, -0.62, 0.05); lp.add(bt); g.add(lp); legs.push(lp);
        var ap = new THREE.Group(); ap.position.set(s * 0.48, 1.45, 0);
        var am = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.65, 10), w); am.position.y = -0.32; ap.add(am);
        var gl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), M(c)); gl.position.y = -0.66; ap.add(gl); g.add(ap); arms.push(ap);
      });
      g.traverse(function (o) { if (o.isMesh) o.castShadow = true; o.userData.pick = name; });
      g.userData.legs = legs; g.userData.arms = arms;
      return g;
    }
    var sami = astro(0x3b82f6, 'sami'), lina = astro(0xff6b1a, 'lina'); S.add(sami); S.add(lina);

    /* ---------- dust (low-gravity arcs) ---------- */
    var ND = 160, dp = new Float32Array(ND * 3), dv = [], dl = [], dg = new THREE.BufferGeometry();
    for (var q2 = 0; q2 < ND; q2++) { dv.push([0, 0, 0]); dl.push(0); dp[q2 * 3 + 1] = -50; }
    dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    var dustMat = new THREE.PointsMaterial({ color: 0xcfc8b8, size: 0.18, transparent: true, opacity: 0.85 });
    var dust = new THREE.Points(dg, dustMat); dust.frustumCulled = false; S.add(dust); var dq = 0, GRAV = 1.62;
    function kick(x, y, z, n, spd) { for (var i = 0; i < n; i++) { var k = dq++ % ND; dp[k * 3] = x + (Math.random() - 0.5) * 0.6; dp[k * 3 + 1] = y; dp[k * 3 + 2] = z + (Math.random() - 0.5) * 0.6; dv[k] = [(Math.random() - 0.5) * spd, Math.random() * spd * 1.2 + 0.6, (Math.random() - 0.5) * spd]; dl[k] = 4; } }

    /* ---------- particles + CME cloud ---------- */
    var NP = 300, pp = new Float32Array(NP * 3), pv = [], pg = new THREE.BufferGeometry(), toBase = new THREE.Vector3();
    function spawn(i, near) {
      var t = near ? Math.random() * 0.6 + 0.3 : Math.random() * 0.2, o = new THREE.Vector3().copy(SUNPOS).multiplyScalar(1 - t);
      pp[i * 3] = o.x + (Math.random() - 0.5) * 40; pp[i * 3 + 1] = o.y + (Math.random() - 0.5) * 18 + 8; pp[i * 3 + 2] = o.z + (Math.random() - 0.5) * 40;
      var sp = 110 + Math.random() * 80; pv[i] = [toBase.x * sp, toBase.y * sp - 5, toBase.z * sp];
    }
    pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    var parts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffb066, size: 0.7, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); parts.visible = false; parts.frustumCulled = false; S.add(parts);
    var cme = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,220,170,.9)', 'rgba(255,120,40,.4)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); S.add(cme);
    var flareT = -10, storm = false, shakeT = 0;

    function placeSun() {
      var y = PLANET === 'mars' ? 34 : SITE === 'sunny' ? 42 : SITE === 'crater' ? 11 : 22;
      SUNPOS.set(Math.cos(TH0 + sunAz) * 300, y, Math.sin(TH0 + sunAz) * 300);
      sunBall.position.copy(SUNPOS); halo.position.copy(SUNPOS); cme.position.copy(SUNPOS);
      sun.position.copy(SUNPOS).normalize().multiplyScalar(120); sun.target.position.set(0, 0, 0);
      toBase.copy(SUNPOS).negate().normalize();
    }
    var FAR = new THREE.Vector3(28, 0, -14), HOME = new THREE.Vector3(-3, 0, 6.2); rover.position.copy(HOME);
    var shotName = 'site', cur = { pos: new THREE.Vector3(30, 30, 40), look: new THREE.Vector3() }, waveT = { sami: -9, lina: -9 }, hop = { sami: -9, lina: -9 };
    function shotFor(n, t) {
      if (n === 'site') return [new THREE.Vector3(26 + Math.sin(t * 0.05) * 4, 24, 34), new THREE.Vector3(-4, 0, -6)];
      if (n === 'sun') return [new THREE.Vector3(9, 3.5, 14), new THREE.Vector3().copy(SUNPOS).multiplyScalar(0.12).add(new THREE.Vector3(0, 3, 0))];
      if (n === 'rover') { var r = rover.position; return [new THREE.Vector3(r.x + 8, r.y + 4 - BY, r.z + 9), new THREE.Vector3(r.x - 1, r.y + 1.4 - BY, r.z)]; }
      if (n === 'shelter') return [new THREE.Vector3(-2, 4.5, 15), new THREE.Vector3(-6, 1.5, 2)];
      if (n === 'green') return [new THREE.Vector3(10, 4, 13), new THREE.Vector3(5, 1, 4)];
      return [new THREE.Vector3(Math.sin(t * 0.06) * 7 + 9, 8, 31), new THREE.Vector3(-2, 2.5, -2)];
    }
    function size() { var r = cv.getBoundingClientRect(), W = Math.max(1, r.width), Hh = Math.max(1, r.height); R.setSize(W, Hh, false); cam.aspect = W / Hh; cam.updateProjectionMatrix(); }
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv); else window.addEventListener('resize', size);

    /* tap the crew or the rover */
    var ray = new THREE.Raycaster(), down = null;
    cv.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; });
    cv.addEventListener('pointerup', function (e) {
      if (!down || MODE !== 'surface') return;
      if (Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
      var r = cv.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), cam);
      var hit = ray.intersectObjects([sami, lina, rover], true).filter(function (h) { var o = h.object; while (o) { if (!o.visible) return false; o = o.parent; } return true; })[0];
      if (!hit) return;
      var p = hit.object.userData.pick, who = p === 'sami' ? sami : p === 'lina' ? lina : null;
      if (who) { waveT[p] = clk.elapsedTime; hop[p] = clk.elapsedTime; kick(who.position.x, who.position.y, who.position.z, 12, 1.2); }
      if (CC.$('sub').hidden && PLANET === 'moon') CC.play('tap_' + p);
    });

    function animAstro(a, t, walk, name) {
      var L = a.userData.legs, A = a.userData.arms, s = Math.sin(t * 5);
      L[0].rotation.x = walk ? s * 0.6 : 0; L[1].rotation.x = walk ? -s * 0.6 : 0;
      var wv = t - waveT[name]; A[1].rotation.z = wv < 2 ? -2.6 + Math.sin(t * 12) * 0.35 : 0; A[0].rotation.x = walk ? -s * 0.4 : 0;
      var hp = t - hop[name]; return hp < 1.2 ? Math.sin(hp / 1.2 * Math.PI) * 1.2 : (walk ? Math.abs(Math.sin(t * 2.5)) * 0.35 : 0);
    }
    function frame() {
      var dt = Math.min(clk.getDelta(), 0.05), t = clk.elapsedTime;
      if (MODE === 'globe') {
        var tg = gShot === 'far' ? [new THREE.Vector3(Math.sin(t * 0.1) * 34, 6, Math.cos(t * 0.1) * 34), new THREE.Vector3()] : [new THREE.Vector3(Math.sin(t * 0.05) * 6, -21, 13), new THREE.Vector3(0, -8.5, 0)];
        gPos.lerp(tg[0], 1 - Math.pow(0.15, dt)); gLook.lerp(tg[1], 1 - Math.pow(0.15, dt)); cam.position.copy(gPos); cam.lookAt(gLook);
        moon.rotation.y += dt * 0.02; ring.material.color.setHSL(0.12, 1, 0.5 + Math.sin(t * 4) * 0.2);
        R.render(GS, cam); requestAnimationFrame(frame); return;
      }
      var g = CC.G;
      var sh = shotFor(shotName, t); sh[0].y += BY; sh[1].y += BY;
      cur.pos.lerp(sh[0], 1 - Math.pow(0.03, dt)); cur.look.lerp(sh[1], 1 - Math.pow(0.03, dt));
      cam.position.copy(cur.pos);
      if (shakeT > 0) { shakeT -= dt; cam.position.x += (Math.random() - 0.5) * 0.5; cam.position.y += (Math.random() - 0.5) * 0.35; }
      cam.lookAt(cur.look);
      /* rover follows the game's rover progress, wheels hug the terrain */
      var prev = rover.position.clone(); rover.position.lerpVectors(FAR, HOME, g.roverProg);
      var moving = g.driving && !g.stuck && g.waitMin <= 0 && prev.distanceTo(rover.position) > 0.0005;
      var heading = Math.atan2(HOME.x - FAR.x, HOME.z - FAR.z) - Math.PI / 2; rover.rotation.y = heading;
      var fx = rover.position.x, fz = rover.position.z, ca = Math.cos(heading), sa = Math.sin(heading);
      var hF = H(fx + ca * 1.2, fz - sa * 1.2), hB = H(fx - ca * 1.2, fz + sa * 1.2), hL = H(fx + sa, fz + ca), hR = H(fx - sa, fz - ca);
      rover.position.y = (hF + hB + hL + hR) / 4 + (moving ? Math.sin(t * 23) * 0.03 : 0) - (g.stuck ? 0.25 : 0);
      rover.rotation.z = Math.atan2(hF - hB, 2.4); rover.rotation.x = Math.atan2(hR - hL, 2) * 0.6 + (g.stuck ? Math.sin(t * 20) * 0.03 : 0);
      wheels.forEach(function (w, i) { w.children[0].rotation.y += (moving || g.stuck) ? dt * 9 : 0; w.position.y = 0.5 + (moving ? Math.sin(t * 17 + i * 1.7) * 0.05 : 0); });
      if ((moving && Math.random() < 0.9) || (g.stuck && Math.random() < 0.6)) kick(fx - ca * 1.6, rover.position.y + 0.2, fz + sa * 1.6, 2, 1.6);
      for (var i = 0; i < ND; i++) {
        if (dl[i] > 0) { dl[i] -= dt; dv[i][1] -= GRAV * dt; dp[i * 3] += dv[i][0] * dt; dp[i * 3 + 1] += dv[i][1] * dt; dp[i * 3 + 2] += dv[i][2] * dt; if (dp[i * 3 + 1] < H(dp[i * 3], dp[i * 3 + 2])) { dl[i] = 0; dp[i * 3 + 1] = -50; } }
      }
      dg.attributes.position.needsUpdate = true;
      /* Sami */
      var sx, sz;
      if (g.lvl === 0) { sami.visible = true; sx = 2 + Math.cos(t * 0.3) * 5; sz = 7 + Math.sin(t * 0.3) * 3; sami.position.set(sx, H(sx, sz) + animAstro(sami, t, true, 'sami'), sz); sami.rotation.y = -t * 0.3 + Math.PI; }
      else if (g.crewOut && (!moving || g.stuck)) { sami.visible = true; sx = rover.position.x + 2.4; sz = rover.position.z + 1.2; sami.position.set(sx, H(sx, sz) + animAstro(sami, t, false, 'sami'), sz); sami.rotation.y = Math.sin(t * 0.6) * 0.6; sami.userData.arms[1].rotation.x = g.stuck ? -1.6 + Math.sin(t * 6) * 0.5 : -1.2 + Math.sin(t * 5) * 0.4; }
      else if (g.samiOutside) { sami.visible = true; sx = -1 + Math.cos(t * 0.4) * 4; sz = 6 + Math.sin(t * 0.4) * 2.5; sami.position.set(sx, H(sx, sz) + animAstro(sami, t, true, 'sami'), sz); sami.rotation.y = -t * 0.4; }
      else sami.visible = false;
      /* Lina */
      if (g.linaOut > 0) { lina.visible = true; lina.position.set(-7, BY + 3.1 + animAstro(lina, t, false, 'lina'), 2); lina.userData.arms[0].rotation.x = -1.6 + Math.sin(t * 6) * 0.5; if (Math.random() < 0.3) kick(-7 + (Math.random() - 0.5) * 3, BY + 2.4, 2 + (Math.random() - 0.5) * 3, 1, 1); }
      else if (g.linaGreen) { lina.visible = true; lina.position.set(5.5, BY + animAstro(lina, t, false, 'lina'), 7); lina.rotation.y = Math.PI; }
      else if (g.inside || g.impacted) lina.visible = false;
      else { lina.visible = true; lina.position.set(-2.2, BY + animAstro(lina, t, false, 'lina'), 4.2); lina.rotation.y = Math.sin(t * 0.7) * 0.5; lina.userData.arms[0].rotation.x = g.running ? -1 + Math.sin(t * 4) * 0.4 : 0; }
      /* power, shelter, greenhouse */
      var pw = Math.max(0, g.power) / 100, fl = pw < 0.3 ? (Math.random() < 0.3 ? 0.2 : 1) : 1;
      lamps.forEach(function (l) { l.material.color.setRGB(pw * fl + 0.08, 0.82 * pw * fl + 0.06, 0.48 * pw * fl + 0.04); }); habLight.intensity = 0.8 * pw * fl;
      var sv = g.shield || 0; walls.forEach(function (w, k) { w.material.opacity = k < sv ? 0.18 + Math.sin(t * 3 + k) * 0.06 + (storm ? 0.15 : 0) : 0; });
      var shelterOn = g.inside || (g.lvl && !g.crewOut && g.running);
      shLight.intensity = shelterOn ? 0.8 + Math.sin(t * 3) * 0.3 : 0;
      gLight.intensity = g.greenOff ? 0 : 0.8; plants.forEach(function (p, n) { p.material.emissiveIntensity = g.greenOff ? 0.05 : 0.35 + Math.sin(t * 2 + n) * 0.1; });
      if (g.radioPing) { var ph = (t % 1.6) / 1.6; ping.material.opacity = 1 - ph; ping.scale.setScalar(0.5 + ph * 3); } else ping.material.opacity = 0;
      /* flare + storm */
      var ft = t - flareT;
      if (ft >= 0 && ft < 6) { halo.scale.setScalar(80 + Math.max(0, 1 - ft) * 160); cme.material.opacity = Math.min(1, ft) * 0.85 * (1 - ft / 6); var f2 = Math.min(1, ft / 6); cme.position.copy(SUNPOS).multiplyScalar(1 - f2 * 0.85); cme.scale.setScalar(30 + f2 * 100); }
      else { halo.scale.setScalar(80 + Math.sin(t * 2) * 3); cme.material.opacity = 0; }
      parts.visible = storm;
      if (storm) { for (var j = 0; j < NP; j++) { pp[j * 3] += pv[j][0] * dt; pp[j * 3 + 1] += pv[j][1] * dt; pp[j * 3 + 2] += pv[j][2] * dt; if (pp[j * 3 + 1] < H(pp[j * 3], pp[j * 3 + 2]) || Math.abs(pp[j * 3]) > 160) spawn(j, false); } pg.attributes.position.needsUpdate = true; }
      if (ice.visible) ice.material.size = 0.22 + Math.abs(Math.sin(t * 3)) * 0.22;
      earth.rotation.y += dt * 0.05;
      R.render(S, cam); requestAnimationFrame(frame);
    }

    function applyLook() {
      var mars = PLANET === 'mars';
      buildGround(); BY = H(0, 0); base.position.y = BY; placeSun();
      if (mars) {
        S.background = new THREE.Color(0xc89a6c); S.fog = new THREE.Fog(0xc89a6c, 70, 280);
        sun.intensity = 1.5; sun.color.setHex(0xffe6c8); hemi.intensity = 0.45; hemi.color.setHex(0xf0c49a); hemi.groundColor.setHex(0x5a2a18);
        sunBall.scale.setScalar(0.65); halo.scale.set(55, 55, 1); earth.visible = false; stars.visible = false; ice.visible = false;
        colTex.repeat.set(24, 24); dustMat.color.setHex(0xc98a5a); GRAV = 3.71;
      } else {
        S.background = new THREE.Color(0x000000); S.fog = null; sunBall.scale.setScalar(1); earth.visible = true; stars.visible = true; dustMat.color.setHex(0xcfc8b8); GRAV = 1.62;
        var L = { sunny: { earth: [60, 46, -220], hemi: 0.3, sl: 2.4 }, crater: { earth: [80, 22, -220], hemi: 0.14, sl: 1.6 }, plain: { earth: [40, 9, -170], hemi: 0.22, sl: 2.0 } }[SITE];
        sun.intensity = L.sl; sun.color.setHex(0xfff3dc); hemi.intensity = L.hemi; hemi.color.setHex(0x8ea4ff); hemi.groundColor.setHex(0x2a2730); earth.position.set(L.earth[0], L.earth[1], L.earth[2]);
        ice.visible = SITE === 'crater';
        if (ice.visible) { for (var k = 0; k < NI; k++) { var ra = Math.random() * 12, an = Math.random() * 6.28, x = CC_.x + Math.cos(an) * ra, z = CC_.z + Math.sin(an) * ra; ip[k * 3] = x; ip[k * 3 + 1] = H(x, z) + 0.12; ip[k * 3 + 2] = z; } ig.attributes.position.needsUpdate = true; }
      }
    }

    CC.World = {
      mode: function (m) { MODE = m; },
      globeShot: function (s) { gShot = s; },
      shot: function (n) { shotName = n; },
      flare: function () { flareT = clk.elapsedTime; },
      storm: function (on) { storm = on; if (on) { shakeT = 0.8; for (var j = 0; j < NP; j++) spawn(j, true); } },
      wave: function (who) { if (waveT[who] !== undefined) waveT[who] = clk.elapsedTime; },
      reset: function () { storm = false; sunAz = 0; placeSun(); },
      sunDay: function (d) { sunAz = (d - 1) * 0.21; placeSun(); },
      setRoute: function (fx, fz) { FAR.set(fx, 0, fz); },
      setSite: function (s) { SITE = s; PLANET = 'moon'; applyLook(); },
      setPlanet: function (p) { PLANET = p; applyLook(); }
    };
    size(); frame();
  };
})(window.CC);
