/* Level 0 — the real Moon (NASA LRO/LOLA) and picking the base site. */
(function (CC) {
  'use strict';
  var $ = CC.$;

  CC.startGame = function () {
    CC.hush(); $('ovTitle').hidden = true;
    if (CC.Sol) CC.Sol.mood('wave');
    CC.say(['t_1', 't_2', 't_3'], CC.level0);
  };

  CC.level0 = function () {
    CC.G.lvl = 0;
    CC.World.mode('globe'); CC.World.globeShot('pole');
    CC.say(['s_1', 's_2', 's_3'], function () {
      CC.fadeTo(function () { CC.World.mode('surface'); CC.World.setSite(CC.G.site); CC.World.shot('site'); CC.siteScreen(); });
    });
  };

  CC.siteScreen = function () {
    CC.hideOverlays(); CC.card(null); $('hud').hidden = true;
    var ov = $('ovSite'); ov.hidden = false;
    $('names').innerHTML = CC.REGIONS.map(function (n, i) { return '<span style="animation-delay:' + (i * 0.06) + 's">' + n + '</span>'; }).join('');
    $('sites').innerHTML = Object.keys(CC.SITES).map(function (k, i) {
      var s = CC.SITES[k];
      return '<button class="site" type="button" data-k="' + k + '" style="animation-delay:' + (0.3 + i * 0.1) + 's"><h3>' + s.name + '</h3><span>+ ' + s.good + '</span><span>− ' + s.bad + '</span><span class="chips"><span class="chip p">' + s.fx + '</span></span></button>';
    }).join('');
    var heard = {};
    Array.prototype.forEach.call($('sites').querySelectorAll('.site'), function (b) {
      var k = b.getAttribute('data-k');
      var preview = function () {
        CC.World.setSite(k);
        if (!heard[k]) { heard[k] = 1; CC.cancelTalk(); if (CC.Sol) CC.Sol.mood('talk'); CC.play('s_h_' + k); }
      };
      b.addEventListener('mouseenter', preview); b.addEventListener('focus', preview);
      b.onclick = function () {
        CC.G.site = k; CC.World.setSite(k); ov.hidden = true; CC.hideArrow();
        CC.say(['s_p_' + k], CC.levelMenu);
      };
    });
    CC.say(['s_4'], function () { CC.pointAt($('sites').querySelector('.site')); });
  };
})(window.CC);
