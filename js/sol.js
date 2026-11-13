/* CAPCOM: Storm Watch — SOL, the robot guide. The model has no skeleton, so every move is done in code. */
(function (CC) {
  'use strict';
  CC.Sol = { mood: function () {}, talk: function () {} };

  CC.initSol = function () {
    if (typeof THREE === 'undefined' || !THREE.GLTFLoader) return;
    var cv = CC.$('solCv'), R;
    try { R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { return; }
    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping;
    var S = new THREE.Scene(), cam = new THREE.PerspectiveCamera(28, 0.8, 0.01, 20), clk = new THREE.Clock();
    cam.position.set(0, 0.62, 3.1); cam.lookAt(0, 0.52, 0);
    S.add(new THREE.HemisphereLight(0xffffff, 0x334466, 1.1));
    var key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(2, 3, 3); S.add(key);
    var rim = new THREE.DirectionalLight(0x48d1ff, 1.2); rim.position.set(-3, 2, -2); S.add(rim);
    var eyeGlow = new THREE.PointLight(0x48d1ff, 0, 1.2); eyeGlow.position.set(0, 0.8, 0.5); S.add(eyeGlow);
    var pivot = new THREE.Group(); S.add(pivot);
    var shadow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 }));
    shadow.rotation.x = -Math.PI / 2; S.add(shadow);

    CC.arrayBuffer('solModel').then(function (buf) {
      new THREE.GLTFLoader().parse(buf, '', function (g) { pivot.add(g.scene); }, function () { /* model failed: SOL stays hidden, game still works */ });
    }).catch(function () { /* asset missing: game still works */ });

    var mood = 'idle', talking = false, cur = { y: 0, rz: 0, ry: 0, rx: 0, sq: 1 }, enter = 0;
    function size() { var r = cv.getBoundingClientRect(), W = Math.max(1, r.width), H = Math.max(1, r.height); R.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); }
    if (window.ResizeObserver) new ResizeObserver(size).observe(cv);
    cv.addEventListener('click', function () { CC.Sol.mood('cheer'); if (CC.$('sub').hidden) CC.play('tap_sol'); });
    function lerp(a, b, k) { return a + (b - a) * k; }
    function frame() {
      var dt = Math.min(clk.getDelta(), 0.05), t = clk.elapsedTime, k = Math.min(1, dt * 7);
      enter = Math.min(1, enter + dt * 1.2);
      var T = { y: Math.sin(t * 2) * 0.015, rz: Math.sin(t * 1.3) * 0.03, ry: Math.sin(t * 0.6) * 0.2, rx: 0, sq: 1 };
      if (mood === 'talk' || talking) { T.y = Math.abs(Math.sin(t * 9)) * 0.035; T.rz = Math.sin(t * 4) * 0.07; T.rx = Math.sin(t * 7) * 0.04; T.sq = 1 + Math.sin(t * 18) * 0.015; }
      if (mood === 'point') { T.ry = 0.55; T.rz = -0.12; T.rx = 0.08; }
      if (mood === 'wave') { T.rz = Math.sin(t * 9) * 0.2; T.y = Math.abs(Math.sin(t * 4.5)) * 0.06; }
      if (mood === 'cheer') { var j = Math.abs(Math.sin(t * 6)); T.y = j * 0.22; T.sq = 1 - (1 - j) * 0.12; }
      if (mood === 'worry') { T.rz = Math.sin(t * 25) * 0.04; T.sq = 0.94; T.rx = 0.12; }
      if (mood === 'listen') { T.ry = 0.35; T.rz = 0.06; }
      for (var key2 in T) cur[key2] = lerp(cur[key2], T[key2], k);
      if (mood === 'cheer') cur.ry = (t * 5) % 6.28;
      pivot.position.y = cur.y + (1 - enter) * 1.5;
      pivot.rotation.set(cur.rx, cur.ry, cur.rz);
      pivot.scale.set(1 / Math.sqrt(cur.sq), cur.sq, 1 / Math.sqrt(cur.sq));
      shadow.scale.setScalar(1 - cur.y * 1.5);
      eyeGlow.intensity = talking ? 0.6 + Math.abs(Math.sin(t * 14)) * 1.2 : 0.3 + Math.sin(t * 2) * 0.1;
      R.render(S, cam); requestAnimationFrame(frame);
    }
    var cheerUntil = 0;
    CC.Sol = {
      mood: function (m) { var now = clk.elapsedTime; if (now < cheerUntil && m !== 'worry') return; mood = m || 'idle'; if (m === 'cheer') cheerUntil = now + 2.5; },
      talk: function (on) { talking = on; if (on) mood = 'talk'; }
    };
    size(); frame();
  };
})(window.CC);
