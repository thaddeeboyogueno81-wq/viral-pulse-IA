'use strict';

/* ================= DONNÉES ================= */
var ERAS = [
  {y:'2001', kanji:'始', c1:'#101014', c2:'#e63946', t:'Naissance du manga', d:'Tite Kubo lance Bleach dans le Weekly Shonen Jump. Ichigo Kurosaki, adolescent voyant les esprits, hérite des pouvoirs de Rukia Kuchiki. Le chapitre 1 pose la base du monde des Shinigami.'},
  {y:'2004', kanji:'尸', c1:'#2a0508', c2:'#ff5a5f', t:'Arc Soul Society & début de l\u0027anime', d:'Octobre 2004 : l\u0027anime TV Tokyo adapte le manga. L\u0027arc Soul Society (infiltration du Seireitei, Gotei 13, duel Byakuya vs Ichigo) propulse la série au rang de classique.'},
  {y:'2007', kanji:'虚', c1:'#0a1a1e', c2:'#7bdff2', t:'Arrancar & Hueco Mundo', d:'Ulquiorra, Grimmjow, Aizen trahit la Soul Society. Ichigo maîtrise le Vizard, le monde d\u0027Hueco Mundo et les Espadas donnent au manga son combat le plus tragique.'},
  {y:'2011', kanji:'卍', c1:'#150a20', c2:'#b791ff', t:'Fullbring & fin de l\u0027anime', d:'Arc Lost Agent (Fullbring, Xcution) : Ichigo, privé de ses pouvoirs, les renaît. Mars 2012 : l\u0027anime s\u0027arrête — les fans attendront 10 ans.'},
  {y:'2018', kanji:'戦', c1:'#1b0505', c2:'#ffb703', t:'Annonce du retour', d:'Le manga se conclut avec l\u0027arc Thousand-Year Blood War : Yhwach, les Quincy, l\u0027origine de tout. Puis le choc : l\u0027anime de la TYBW est annoncé.'},
  {y:'2022', kanji:'血', c1:'#081026', c2:'#4ea8ff', t:'TYBW — Cour 1', d:'Octobre 2022 : Thousand-Year Blood War revient avec une animation de nouvelle génération (studio Pierrot). L\u0027opening "Scar" de Tatsuya Kitani devient culte.'},
  {y:'2023', kanji:'離', c1:'#031a14', c2:'#4dd8a4', t:'TYBW — Cour 2 "The Separation"', d:'La guerre s\u0027intensifie : séparation des mondes, révélations sur l\u0027histoire des Quincy. L\u0027animation des bankai atteint un niveau jamais vu.'},
  {y:'2024', kanji:'闘', c1:'#26120a', c2:'#ff9e4f', t:'TYBW — Cour 3 "The Conflict"', d:'Le conflit final se rapproche : les combats de Yamamoto, la vraie puissance de Kenpachi (Nozarashi), et la reformation de l\u0027escouade Ichigo.'},
  {y:'2026', kanji:'終', c1:'#1a1208', c2:'#ffd700', t:'Le Crépuscule — et l\u0027au-delà', d:'Le Cour 4 conclut la guerre de mille ans en apothéose. Bleach vit à travers ses suites et spin-offs (Burn the Witch), ses jeux, et une communauté de fans plus forte que jamais. Death. The End. and Beyond.'}
];

var CHARS = [
  {name:'Ichigo Kurosaki', role:'Shinigami Daikō', zan:'Zangetsu', cmd:'(Shikai permanent)', bankai:'Tensa Zangetsu', bd:'La lame féroce comprimée en une katana noire. Vitesse et Getsuga Tenshō décuplés, puis le Getsuga final absorbe tout le reiatsu.', aura:'#e63946', art:'ichigo', fx:'getsuga'},
  {name:'Rukia Kuchiki', role:'Lieutenant — 13e Division', zan:'Sode no Shirayuki', cmd:'Mae! (Danse!)', bankai:'Hakka no Togame', bd:'La plus belle zanpakutō de glace fige absolument tout dans un immense cercle de glace — au prix du corps de Rukia elle-même.', aura:'#bfe8ff', art:'rukia', fx:'ice'},
  {name:'Byakuya Kuchiki', role:'Capitaine — 6e Division', zan:'Senbonzakura', cmd:'Chire! (Éparpille-toi!)', bankai:'Senbonzakura Kageyoshi', bd:'Des milliards de lames-pétales invisibles détruisent tout dans un dôme de sakura. Techniques secrètes : Senkei, Gokei, Shukei.', aura:'#ffb7d5', art:'byakuya', fx:'sakura'},
  {name:'Kenpachi Zaraki', role:'Capitaine — 11e Division', zan:'Nozarashi', cmd:'Nomi (Bois!)', bankai:'Kenpachi: Zaraki', bd:'Sa force brute n\u0027était que la libération partielle de Nozarashi. Le vrai bankai transforme Zaraki en oni dévastateur, inconscient de toute limite.', aura:'#c9a227', art:'kenpachi', fx:'onslaught'},
  {name:'Tōshirō Hitsugaya', role:'Capitaine — 10e Division', zan:'Hyōrinmaru', cmd:'Sōten ni zase! (Trône aux cieux gelés!)', bankai:'Daiguren Hyōrinmaru', bd:'Le dragon de glace le plus puissant : ailes de glace, fleurs de glace en sabbat de 4 minutes — et sa forme adulte après la TYBW.', aura:'#7bdff2', art:'hitsugaya', fx:'dragon'},
  {name:'Renji Abarai', role:'Lieutenant — 6e Division', zan:'Zabimaru', cmd:'Hoero! (Rugis!)', bankai:'Sōō Zabimaru', bd:'Le serpent-fouet d\u0027os devient une armure de singe-roi : la forme féroce maîtrisée contre Mask de Masculine lors de la TYBW.', aura:'#ff7b4f', art:'renji', fx:'whip'},
  {name:'Kisuke Urahara', role:'Ex-capitaine — 12e Division', zan:'Benihime', cmd:'Okiro! (Réveille-toi!)', bankai:'Kannonbiraki Benihime', bd:'La princesse écarlate "ouvre" tout : yeux, plaies, destins. Urahara ne montre ce bankai qu\u0027une fois... et c\u0027était déjà gagné.', aura:'#c1121f', art:'urahara', fx:'opening'},
  {name:'Sōsuke Aizen', role:'Traître — Ex-capitaine 5e Div.', zan:'Kyōka Suigetsu', cmd:'(Hypnose parfaite)', bankai:'??? — Jamais révélé', bd:'L\u0027illusion absolue contrôle les cinq sens de quiconque a vu ne serait-ce qu\u0027une fois sa libération. Son bankai n\u0027a jamais eu besoin d\u0027exister.', aura:'#b791ff', art:'aizen', fx:'illusion'}
];

var TRACKS = [
  {type:'Opening', n:'*~Asterisk~', a:'ORANGE RANGE', q:'Bleach Opening 1 Asterisk ORANGE RANGE'},
  {type:'Opening', n:'D-tecnoLife', a:'UVERworld', q:'Bleach Opening 2 D-tecnolife UVERworld'},
  {type:'Opening', n:'Ichirin no Hana', a:'HIGH and MIGHTY COLOR', q:'Bleach Opening 3 Ichirin no Hana'},
  {type:'Opening', n:'Rolling Star', a:'YUI', q:'Bleach Opening 5 Rolling Star YUI'},
  {type:'Opening', n:'Velonica', a:'Aqua Timez', q:'Bleach Opening 9 Velonica Aqua Timez'},
  {type:'Opening', n:'Scar', a:'Tatsuya Kitani', q:'Bleach TYBW Opening Scar Tatsuya Kitani'},
  {type:'Opening', n:'Rapport', a:'Yoh Kamiyama', q:'Bleach TYBW Opening 2 Rapport Yoh Kamiyama'},
  {type:'Ending', n:'Life is Like a Boat', a:'Rie fu', q:'Bleach Ending 1 Life is Like a Boat Rie fu'},
  {type:'Ending', n:'Thank You!!', a:'HOME MADE Kazoku', q:'Bleach Ending 4 Thank You HOME MADE Kazoku'},
  {type:'Ending', n:'Sakurabiyori', a:'Hoshimura Mai', q:'Bleach Ending 6 Sakurabiyori Hoshimura Mai'},
  {type:'Ending', n:'Saihate', a:'milet', q:'Bleach TYBW Ending Saihate milet'},
  {type:'Ending', n:'Monochrome', a:'river romances', q:'Bleach TYBW Ending monochrome'},
  {type:'OST', n:'Number One', a:'Shiro Sagisu', q:'Bleach OST Number One Shiro Sagisu'},
  {type:'OST', n:'On the Precipice of Defeat', a:'Shiro Sagisu', q:'Bleach OST On the Precipice of Defeat'},
  {type:'OST', n:'Treachery', a:'Shiro Sagisu', q:'Bleach OST Treachery Shiro Sagisu'},
  {type:'OST', n:'B13a (Battle Theme)', a:'Shiro Sagisu', q:'Bleach OST B13a battle theme Shiro Sagisu'},
  {type:'OST', n:'Quincy\u0027s Craft', a:'Shiro Sagisu', q:'Bleach TYBW OST Quincy craft Shiro Sagisu'},
  {type:'OST', n:'Blaze of the Soul Reaper', a:'Shiro Sagisu', q:'Bleach OST Blaze of the Soul Reaper'}
];

/* ============ SILHOUETTES DE PERSONNAGES (SVG originaux) ============ */
/* Corps de base : shinigami en shihakushō (kimono noir), silhouette stylisée. */
function charSVG(hair, extra){
  return '<svg viewBox="0 0 200 260" aria-hidden="true">'
    + '<ellipse cx="100" cy="250" rx="60" ry="8" fill="#000" opacity="0.4"/>'
    + hair
    + '<path d="M100 52 C76 52 66 74 66 96 C66 112 70 122 74 128 L64 224 L136 224 L126 128 C130 122 134 112 134 96 C134 74 124 52 100 52 Z" fill="#14141c"/>'
    + '<path d="M74 128 L64 224 L82 224 L84 140 Z" fill="#26263a"/>'
    + '<path d="M100 60 C84 60 76 76 76 94 C76 104 78 110 80 114 L120 114 C122 110 124 104 124 94 C124 76 116 60 100 60 Z" fill="#e8c9a8"/>'
    + '<path d="M100 66 C88 66 82 78 82 90 L118 90 C118 78 112 66 100 66 Z" fill="#14141c" opacity="0.15"/>'
    + '<circle cx="90" cy="88" r="2.4" fill="#20202a"/><circle cx="110" cy="88" r="2.4" fill="#20202a"/>'
    + '<path d="M70 118 L58 200 L70 206 L82 130 Z" fill="#14141c"/>'
    + '<path d="M130 118 L142 200 L130 206 L118 130 Z" fill="#14141c"/>'
    + '<path d="M64 224 L58 254 L74 254 L82 224 Z" fill="#14141c"/>'
    + '<path d="M136 224 L142 254 L126 254 L118 224 Z" fill="#14141c"/>'
    + '<path d="M74 96 L126 96 L124 106 L76 106 Z" fill="#f2f2f0" opacity="0.9"/>'
    + extra
    + '</svg>';
}

var ART = {
  ichigo: charSVG(
    '<path d="M66 70 C60 40 74 22 100 20 C126 22 140 40 134 70 C130 52 122 44 112 42 C118 52 116 58 112 60 C108 46 100 40 92 44 C96 50 94 56 88 56 C80 50 72 58 66 70 Z" fill="#e07b24"/>',
    '<path d="M130 130 L172 120 L174 128 L132 140 Z" fill="#1a1a22"/><path d="M172 120 L190 116 L191 123 L174 128 Z" fill="#2b2b35"/>'
  ),
  rukia: charSVG(
    '<path d="M68 74 C64 46 78 30 100 28 C122 30 136 46 132 74 C128 58 120 50 100 48 C80 50 72 58 68 74 Z" fill="#2b2b3a"/><path d="M132 60 C140 52 144 42 142 34 C134 40 130 50 128 58 Z" fill="#2b2b3a"/>',
    '<path d="M66 96 L134 96 L136 130 L64 130 Z" fill="#f2f4f8"/>'
  ),
  byakuya: charSVG(
    '<path d="M66 72 C62 44 76 28 100 26 C124 28 138 44 134 72 C130 54 120 46 100 44 C80 46 70 54 66 72 Z" fill="#22222e"/><path d="M134 64 L146 74 L138 78 Z" fill="#22222e"/>',
    '<path d="M64 92 C64 106 76 112 100 112 C124 112 136 106 136 92 L136 98 C136 114 122 122 100 122 C78 122 64 114 64 98 Z" fill="#f4eee6"/><circle cx="86" cy="88" r="2.6" fill="#8a1a6a"/><circle cx="114" cy="88" r="2.6" fill="#8a1a6a"/>'
  ),
  kenpachi: charSVG(
    '<path d="M58 78 C50 40 70 18 100 18 C130 18 150 40 142 78 C138 56 126 44 112 42 C120 52 118 60 110 62 C104 46 92 42 82 48 C88 54 86 62 76 62 C66 58 62 66 58 78 Z" fill="#2b2b35"/>',
    '<path d="M76 82 L124 82 L124 96 L76 96 Z" fill="#1a1a22"/><path d="M78 84 A12 8 0 1 0 122 84" fill="none" stroke="#3a3a4a" stroke-width="3"/><circle cx="90" cy="89" r="3" fill="#e63946"/><circle cx="110" cy="89" r="3" fill="#e63946"/><line x1="84" y1="98" x2="128" y2="76" stroke="#2a2a36" stroke-width="4"/>'
  ),
  hitsugaya: charSVG(
    '<path d="M66 72 C62 42 76 26 100 24 C124 26 138 42 134 72 C132 54 124 46 114 44 C118 52 116 58 110 58 C104 44 96 40 88 46 C92 52 90 58 84 56 C74 52 70 60 66 72 Z" fill="#eef2f8"/>',
    '<path d="M62 96 C62 110 78 116 100 116 C122 116 138 110 138 96 L138 104 C138 120 122 128 100 128 C78 128 62 120 62 104 Z" fill="#7ac9e8" opacity="0.5"/><circle cx="90" cy="88" r="2.4" fill="#2aa8d8"/><circle cx="110" cy="88" r="2.4" fill="#2aa8d8"/>'
  ),
  renji: charSVG(
    '<path d="M64 74 C58 42 76 24 100 24 C124 24 142 42 136 74 C132 52 122 44 108 44 C116 56 112 62 104 60 C98 44 86 42 78 50 C84 56 80 62 72 60 C66 58 66 66 64 74 Z" fill="#c9382a"/><path d="M136 66 C148 60 156 48 154 36 C144 44 138 54 134 62 Z" fill="#c9382a"/>',
    '<path d="M74 116 L82 122 M86 118 L94 124 M98 120 L106 126 M110 122 L118 128" stroke="#3a2a2a" stroke-width="3"/>'
  ),
  urahara: charSVG(
    '<path d="M66 74 C62 48 76 32 100 30 C124 32 138 48 134 74 C130 56 120 48 100 46 C80 48 70 56 66 74 Z" fill="#c8b46a"/>',
    '<path d="M60 48 C60 26 78 14 100 14 C122 14 140 26 140 48 C128 40 114 36 100 36 C86 36 72 40 60 48 Z" fill="#2e5e4e"/><rect x="58" y="46" width="84" height="7" rx="3" fill="#1e3e34"/><circle cx="90" cy="89" r="2.6" fill="#2aa8d8"/><circle cx="110" cy="89" r="2.6" fill="#2aa8d8"/><path d="M84 100 C92 106 108 106 116 100" stroke="#7a4a2a" stroke-width="2.5" fill="none"/>'
  ),
  aizen: charSVG(
    '<path d="M66 72 C62 44 76 28 100 26 C124 28 138 44 134 72 C130 54 120 46 100 44 C80 46 70 54 66 72 Z" fill="#3a3440"/><path d="M134 62 C142 56 146 46 144 38 C136 46 132 54 130 60 Z" fill="#3a3440"/>',
    '<path d="M76 84 L104 84 L104 92 L76 92 Z" fill="#20202a"/><path d="M96 84 L124 84 L124 92 L96 92 Z" fill="#20202a"/><line x1="100" y1="80" x2="100" y2="96" stroke="#20202a" stroke-width="2"/><circle cx="82" cy="88" r="1.8" fill="#7a2a2a"/><circle cx="114" cy="88" r="1.8" fill="#7a2a2a"/><path d="M90 104 C96 110 104 110 110 104" stroke="#8a7a4a" stroke-width="2" fill="none"/>'
  )
};

function buildEras(){
  var track = document.getElementById('era-track');
  ERAS.forEach(function(e){
    var div = document.createElement('div');
    div.className = 'era reveal';
    div.innerHTML = '<div class="y">' + e.y + '</div><h3>' + e.kanji + ' — ' + e.t + '</h3><p>' + e.d + '</p>';
    track.appendChild(div);
  });
}

function buildCards(){
  var grid = document.getElementById('cards');
  CHARS.forEach(function(c){
    var card = document.createElement('div');
    card.className = 'card reveal';
    card.style.setProperty('--aura', c.aura);
    card.innerHTML =
      '<div class="face front">' +
        '<span class="tag">' + c.role + '</span><div class="aura"></div>' +
        '<h3>' + c.name + '</h3><div class="role">' + c.zan + '</div>' +
        '<div class="char-art">' + ART[c.art] + '</div>' +
        '<div class="release">' + c.cmd + '</div>' +
        '<div class="hint">Clique → Bankai</div>' +
      '</div>' +
      '<div class="face back"><div class="aura"></div>' +
        '<h3>' + c.name + '</h3>' +
        '<div class="bankai-name">' + c.bankai + '</div>' +
        '<p class="bankai-desc">' + c.bd + '</p>' +
        '<div class="hint">Clique → Shikai</div>' +
      '</div>';
    card.addEventListener('click', function(){
      var wasFlipped = card.classList.contains('flipped');
      card.classList.toggle('flipped');
      if (!wasFlipped) triggerBankaiFX(c);
    });
    card.addEventListener('mousemove', function(ev){
      if (card.classList.contains('flipped')) return;
      var r = card.getBoundingClientRect();
      var rx = ((ev.clientY - r.top) / r.height - 0.5) * -14;
      var ry = ((ev.clientX - r.left) / r.width - 0.5) * 14;
      card.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });
    card.addEventListener('mouseleave', function(){ card.style.transform = ''; });
    grid.appendChild(card);
  });
}

/* ============ MOTEUR D'ANIMATION BANKAI (Canvas) ============ */
var FX = { canvas: null, ctx: null, parts: [], running: false, type: null, aura: '#e63946', start: 0, dur: 4200 };

function triggerBankaiFX(c){
  FX.canvas = document.getElementById('bankai-fx');
  FX.ctx = FX.canvas.getContext('2d');
  FX.canvas.width = innerWidth; FX.canvas.height = innerHeight;
  FX.type = c.fx; FX.aura = c.aura; FX.parts = []; FX.start = performance.now(); FX.dur = 4200;
  FX.running = true;
  FX.canvas.classList.add('active');
  document.body.classList.add('shaking');
  setTimeout(function(){ document.body.classList.remove('shaking'); }, 600);
  var ov = document.getElementById('bankai-name-overlay');
  ov.style.setProperty('--bfx', c.aura);
  ov.innerHTML = '<span>' + c.bankai + '</span>';
  ov.classList.add('show');
  requestAnimationFrame(fxTick);
  setTimeout(function(){ ov.classList.remove('show'); }, 2600);
  setTimeout(function(){ FX.running = false; FX.canvas.classList.remove('active'); }, FX.dur);
}

function fxTick(){
  if (!FX.running) return;
  var ctx = FX.ctx, t = (performance.now() - FX.start) / FX.dur;
  ctx.clearRect(0, 0, FX.canvas.width, FX.canvas.height);
  var cx = FX.canvas.width / 2, cy = FX.canvas.height / 2;
  var type = FX.type;

  if (type === 'getsuga'){
    var r = Math.max(FX.canvas.width, FX.canvas.height) * t * 1.1;
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(-0.5 + t * 0.4);
    var grad = ctx.createLinearGradient(-r, 0, r, 0);
    grad.addColorStop(0, 'rgba(10,10,12,0.95)');
    grad.addColorStop(0.6, 'rgba(230,57,70,' + (1 - t) * 0.9 + ')');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.quadraticCurveTo(0, -r * 0.35, r, 0);
    ctx.quadraticCurveTo(0, -r * 0.18, -r, 0);
    ctx.fill();
    ctx.restore();
  } else if (type === 'ice'){
    var rr = Math.min(cx, cy) * (0.2 + t * 1.4);
    ctx.strokeStyle = 'rgba(191,232,255,' + (1 - t) + ')';
    ctx.lineWidth = 3;
    for (var i = 0; i < 12; i++){
      var a = i / 12 * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rr * 0.2, cy + Math.sin(a) * rr * 0.2);
      ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      ctx.stroke();
    }
    for (var k = 0; k < 30; k++){
      var px = Math.random() * FX.canvas.width, py = Math.random() * FX.canvas.height;
      ctx.fillStyle = 'rgba(220,245,255,' + Math.random() * (1 - t) + ')';
      ctx.beginPath(); ctx.arc(px, py, Math.random() * 3 + 1, 0, 6.283); ctx.fill();
    }
  } else if (type === 'sakura'){
    if (FX.parts.length < 400) for (var j = 0; j < 12; j++) FX.parts.push({x: cx, y: cy, vx: (Math.random()-0.5)*14, vy: (Math.random()-0.5)*14, r: Math.random()*5+2, a: Math.random()*6.283, va: (Math.random()-0.5)*0.3, life: 1});
    ctx.fillStyle = 'rgba(255,183,213,0.9)';
    FX.parts.forEach(function(p){
      p.x += p.vx; p.y += p.vy; p.vx *= 1.02; p.vy *= 1.02; p.a += p.va; p.life -= 0.008;
      if (p.life <= 0) return;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      ctx.globalAlpha = Math.max(0, p.life) * (1 - t * 0.5);
      ctx.beginPath(); ctx.ellipse(0, 0, p.r * 2, p.r, 0, 0, 6.283); ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  } else if (type === 'onslaught'){
    for (var n = 0; n < 5; n++){
      var pr = (t * 1.6 + n * 0.2) % 1;
      ctx.strokeStyle = n % 2 ? 'rgba(201,162,39,' + (1 - pr) + ')' : 'rgba(20,10,0,' + (1 - pr) + ')';
      ctx.lineWidth = 14 * (1 - pr) + 2;
      ctx.beginPath(); ctx.arc(cx, cy, pr * Math.max(cx, cy) * 1.2, 0, 6.283); ctx.stroke();
    }
  } else if (type === 'dragon'){
    ctx.lineWidth = 26 * (1 - t * 0.6);
    var grad2 = ctx.createLinearGradient(0, 0, FX.canvas.width, FX.canvas.height);
    grad2.addColorStop(0, 'rgba(123,223,242,0)');
    grad2.addColorStop(0.5, 'rgba(123,223,242,' + (1 - t) + ')');
    grad2.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = grad2; ctx.lineCap = 'round';
    ctx.beginPath();
    for (var s = 0; s <= 60; s++){
      var p2 = s / 60;
      var x2 = -100 + p2 * (FX.canvas.width + 200);
      var y2 = cy + Math.sin(p2 * 10 + performance.now() / 300) * (120 * (1 - t));
      if (s === 0) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
    }
    ctx.stroke();
  } else if (type === 'whip'){
    ctx.strokeStyle = 'rgba(255,123,79,' + (1 - t) + ')';
    ctx.lineWidth = 10;
    ctx.beginPath();
    var segs = 14;
    for (var q = 0; q <= segs; q++){
      var p3 = q / segs;
      var x3 = cx - 300 + p3 * 600;
      var y3 = cy + Math.sin(p3 * 6 + performance.now() / 150) * 160 * (1 - t) * (1 - p3);
      if (q === 0) ctx.moveTo(x3, y3); else ctx.lineTo(x3, y3);
    }
    ctx.stroke();
  } else if (type === 'opening'){
    ctx.fillStyle = 'rgba(193,18,31,' + (1 - t) * 0.8 + ')';
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(0.3);
    var hh = t * FX.canvas.height * 0.7;
    ctx.beginPath(); ctx.ellipse(0, 0, 8 + t * 40, hh, 0, 0, 6.283); ctx.fill();
    ctx.restore();
  } else if (type === 'illusion'){
    var petals = 9;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(performance.now() / 700);
    for (var m = 0; m < petals; m++){
      var am = m / petals * 6.283;
      var g3 = ctx.createRadialGradient(0, 0, 0, Math.cos(am) * 200, Math.sin(am) * 200, 260);
      g3.addColorStop(0, 'rgba(183,145,255,0)');
      g3.addColorStop(0.5, 'rgba(183,145,255,' + (1 - t) * 0.5 + ')');
      g3.addColorStop(1, 'rgba(183,145,255,0)');
      ctx.fillStyle = g3;
      ctx.beginPath(); ctx.arc(Math.cos(am) * 200, Math.sin(am) * 200, 260, 0, 6.283); ctx.fill();
    }
    ctx.restore();
  }
  requestAnimationFrame(fxTick);
}

/* ============ MUSIQUE ============ */
var currentType = 'Opening';
function buildMusic(){
  var grid = document.getElementById('music-grid');
  grid.innerHTML = '';
  TRACKS.forEach(function(t){
    if (t.type !== currentType) return;
    var el = document.createElement('div');
    el.className = 'track';
    el.innerHTML = '<div class="t-type">' + t.type + '</div><div class="t-name">' + t.n + '</div><div class="t-artist">' + t.a + '</div><div class="bars"><i></i><i></i><i></i><i></i></div>';
    el.addEventListener('click', function(){ openPlayer(t); });
    grid.appendChild(el);
  });
  if (!grid.children.length) grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--dim)">Aucun morceau dans cette catégorie.</p>';
}

function openPlayer(t){
  document.getElementById('player-title').textContent = t.n + ' — ' + t.a;
  document.getElementById('player-frame').innerHTML =
    '<iframe src="https://www.youtube.com/embed?listType=search&list=' + encodeURIComponent(t.q) + '" allow="autoplay; encrypted-media" allowfullscreen loading="lazy" title="' + t.n + '"></iframe>';
  document.getElementById('player-modal').classList.add('open');
}
document.getElementById('player-close').addEventListener('click', function(){
  document.getElementById('player-modal').classList.remove('open');
  document.getElementById('player-frame').innerHTML = '';
});
document.getElementById('player-modal').addEventListener('click', function(e){
  if (e.target.id === 'player-modal') { e.target.classList.remove('open'); document.getElementById('player-frame').innerHTML = ''; }
});
document.querySelectorAll('.mtab').forEach(function(b){
  b.addEventListener('click', function(){
    document.querySelectorAll('.mtab').forEach(function(x){ x.classList.remove('active'); });
    b.classList.add('active');
    currentType = b.dataset.type;
    buildMusic();
  });
});

/* ============ PARTICULES DE REIATSU ============ */
var PARTICLES, CTX, W, H;
function initParticles(){
  var c = document.getElementById('particles');
  CTX = c.getContext('2d');
  W = c.width = innerWidth; H = c.height = innerHeight;
  PARTICLES = [];
  var n = Math.min(90, Math.floor(W / 16));
  for (var i = 0; i < n; i++) PARTICLES.push(newP());
  requestAnimationFrame(tick);
}
function newP(){
  return {x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.8+0.4, s: Math.random()*0.4+0.1, o: Math.random()*0.5+0.15, red: Math.random() > 0.7};
}
function tick(){
  CTX.clearRect(0, 0, W, H);
  for (var i = 0; i < PARTICLES.length; i++){
    var p = PARTICLES[i];
    p.y -= p.s; p.x += Math.sin(p.y/60)*0.15;
    if (p.y < -5) { p.y = H + 5; p.x = Math.random()*W; }
    CTX.beginPath();
    CTX.arc(p.x, p.y, p.r, 0, 6.283);
    CTX.fillStyle = p.red ? 'rgba(230,57,70,' + p.o + ')' : 'rgba(200,210,230,' + p.o + ')';
    CTX.fill();
  }
  requestAnimationFrame(tick);
}

/* ============ FOND SCROLL-DRIVEN (évolution 2001→2026) ============ */
var BG = { canvas: null, ctx: null, w: 0, h: 0, color: '#101014', target: '#101014' };
function hexToRgb(h){
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}
function initBg(){
  BG.canvas = document.getElementById('bg-scroll');
  BG.ctx = BG.canvas.getContext('2d');
  resizeBg();
  requestAnimationFrame(bgTick);
}
function resizeBg(){
  BG.w = BG.canvas.width = innerWidth;
  BG.h = BG.canvas.height = innerHeight;
}
function bgTick(){
  var c1 = hexToRgb(BG.color), c2 = hexToRgb(BG.target);
  var mix = c1.map(function(v, i){ return v + (c2[i] - v) * 0.05; });
  BG.color = 'rgb(' + Math.round(mix[0]) + ',' + Math.round(mix[1]) + ',' + Math.round(mix[2]) + ')';
  var ctx = BG.ctx;
  ctx.clearRect(0, 0, BG.w, BG.h);
  var g = ctx.createRadialGradient(BG.w * 0.5, BG.h * 0.65, 0, BG.w * 0.5, BG.h * 0.65, BG.w * 0.9);
  g.addColorStop(0, BG.color);
  g.addColorStop(1, 'rgba(7,7,10,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, BG.w, BG.h);
  requestAnimationFrame(bgTick);
}

/* ============ SCROLL FX ============ */
function initScrollFX(){
  var fill = document.getElementById('reiatsu-fill');
  var yearEl = document.getElementById('reiatsu-year');
  var visual = document.getElementById('era-visual');
  var kanji = document.getElementById('era-kanji');
  var year = document.getElementById('era-year');
  var eras = document.querySelectorAll('.era');
  function onScroll(){
    var max = document.documentElement.scrollHeight - innerHeight;
    fill.style.width = (scrollY / max * 100) + '%';
    var active = 0, mid = scrollY + innerHeight * 0.5;
    eras.forEach(function(e, i){
      var r = e.getBoundingClientRect();
      var abs = r.top + scrollY;
      if (mid >= abs) active = i;
    });
    var era = ERAS[active];
    visual.style.setProperty('--era-c1', era.c1);
    visual.style.setProperty('--era-c2', era.c2);
    kanji.textContent = era.kanji;
    kanji.style.color = era.c2;
    kanji.style.textShadow = '0 0 60px ' + era.c2;
    year.textContent = era.y;
    yearEl.textContent = era.y;
    BG.target = era.c1;
  }
  addEventListener('scroll', onScroll, {passive: true});
  onScroll();
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold: 0.15});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
}

/* ============ HERO PARALLAXE ============ */
function initHeroParallax(){
  var layers = document.querySelectorAll('.hero-layer');
  addEventListener('mousemove', function(e){
    var dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
    layers.forEach(function(l){
      var d = parseFloat(l.dataset.depth || 0.3);
      l.style.transform = 'translate(' + (-dx * 100 * d) + 'px,' + (-dy * 60 * d) + 'px)';
    });
    var g = document.getElementById('cursor-glow');
    g.style.left = e.clientX + 'px';
    g.style.top = e.clientY + 'px';
  });
}

document.getElementById('theme-btn').addEventListener('click', function(){
  document.body.classList.toggle('light');
  this.textContent = document.body.classList.contains('light') ? '☀ Soul Society' : '☽ Hueco Mundo';
});

buildEras(); buildCards(); buildMusic(); initParticles(); initBg(); initScrollFX(); initHeroParallax();
addEventListener('resize', function(){
  W = document.getElementById('particles').width = innerWidth;
  H = document.getElementById('particles').height = innerHeight;
  resizeBg();
});
