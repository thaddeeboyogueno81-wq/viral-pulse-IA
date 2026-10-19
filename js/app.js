'use strict';
var PARTICLES, CTX, W, H;

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

// fx: type d'animation unique par personnage
var CHARS = [
  {name:'Ichigo Kurosaki', role:'Shinigami Daikō', zan:'Zangetsu', cmd:'(Shikai permanent)', bankai:'Tensa Zangetsu', bd:'La lame féroce comprimée en une katana noire. Vitesse et Getsuga Tenshō décuplés, puis le Getsuga final absorbe tout le reiatsu.', aura:'#e63946', blade:'#16161c', fx:'getsuga'},
  {name:'Rukia Kuchiki', role:'Lieutenant — 13e Division', zan:'Sode no Shirayuki', cmd:'Mae! (Danse!)', bankai:'Hakka no Togame', bd:'La plus belle zanpakutō de glace fige absolument tout dans un immense cercle de glace — au prix du corps de Rukia elle-même.', aura:'#bfe8ff', blade:'#e8f4ff', fx:'ice'},
  {name:'Byakuya Kuchiki', role:'Capitaine — 6e Division', zan:'Senbonzakura', cmd:'Chire! (Éparpille-toi!)', bankai:'Senbonzakura Kageyoshi', bd:'Des milliards de lames-pétales invisibles détruisent tout dans un dôme de sakura. Techniques secrètes : Senkei, Gokei, Shukei.', aura:'#ffb7d5', blade:'#f2e8ff', fx:'sakura'},
  {name:'Kenpachi Zaraki', role:'Capitaine — 11e Division', zan:'Nozarashi', cmd:'Nomi (Bois!)', bankai:'Kenpachi: Zaraki', bd:'Sa force brute n\u0027était que la libération partielle de Nozarashi. Le vrai bankai transforme Zaraki en oni dévastateur, inconscient de toute limite.', aura:'#c9a227', blade:'#8a8a8a', fx:'onslaught'},
  {name:'Tōshirō Hitsugaya', role:'Capitaine — 10e Division', zan:'Hyōrinmaru', cmd:'Sōten ni zase! (Trône aux cieux gelés!)', bankai:'Daiguren Hyōrinmaru', bd:'Le dragon de glace le plus puissant : ailes de glace, fleurs de glace en sabbat de 4 minutes — et sa forme adulte après la TYBW.', aura:'#7bdff2', blade:'#dff4ff', fx:'dragon'},
  {name:'Renji Abarai', role:'Lieutenant — 6e Division', zan:'Zabimaru', cmd:'Hoero! (Rugis!)', bankai:'Sōō Zabimaru', bd:'Le serpent-fouet d\u0027os devient une armure de singe-roi : la forme féroce maîtrisée contre Mask de Masculine lors de la TYBW.', aura:'#ff7b4f', blade:'#e8d9c5', fx:'whip'},
  {name:'Kisuke Urahara', role:'Ex-capitaine — 12e Division', zan:'Benihime', cmd:'Okiro! (Réveille-toi!)', bankai:'Kannonbiraki Benihime', bd:'La princesse écarlate "ouvre" tout : yeux, plaies, destins. Urahara ne montre ce bankai qu\u0027une fois... et c\u0027était déjà gagné.', aura:'#c1121f', blade:'#2b1a1a', fx:'opening'},
  {name:'Sōsuke Aizen', role:'Traître — Ex-capitaine 5e Div.', zan:'Kyōka Suigetsu', cmd:'(Hypnose parfaite)', bankai:'??? — Jamais révélé', bd:'L\u0027illusion absolue contrôle les cinq sens de quiconque a vu ne serait-ce qu\u0027une fois sa libération. Son bankai n\u0027a jamais eu besoin d\u0027exister.', aura:'#b791ff', blade:'#9b8cff', fx:'illusion'}
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

function katanaSVG(color, aura){
  return '<svg viewBox="0 0 200 520"><circle cx="100" cy="250" r="130" fill="' + aura + '" opacity="0.18"/><path d="M100 14 L114 84 L114 336 L86 336 L86 84 Z" fill="' + color + '" stroke="' + aura + '" stroke-width="1.5"/><line x1="106" y1="84" x2="106" y2="336" stroke="' + aura + '" stroke-width="3" opacity="0.85"/><rect x="84" y="334" width="32" height="18" fill="' + aura + '"/><ellipse cx="100" cy="356" rx="38" ry="10" fill="' + aura + '" opacity="0.9"/><rect x="89" y="362" width="22" height="112" rx="10" fill="' + color + '" stroke="' + aura + '" stroke-width="1"/><rect x="89" y="474" width="22" height="14" rx="5" fill="' + aura + '"/><line x1="89" y1="386" x2="111" y2="374" stroke="' + aura + '" stroke-width="2" opacity="0.7"/><line x1="89" y1="416" x2="111" y2="404" stroke="' + aura + '" stroke-width="2" opacity="0.7"/><line x1="89" y1="446" x2="111" y2="434" stroke="' + aura + '" stroke-width="2" opacity="0.7"/></svg>';
}

function buildEras(){
  var track = document.getElementById('era-track');
  ERAS.forEach(function(e){
    var div = document.createElement('div');
    div.className = 'era reveal';
    div.innerHTML = '<div class="y">' + e.y + '</div><h3>' + e.kanji + ' — ' + e.t + '</h3><p>' + e.d + '</p>';
    track.appendChild(div);
  });
}

/* ============ MOTEUR D'ANIMATION BANKAI (Canvas) ============ */
var FX = { canvas: null, ctx: null, parts: [], running: false, type: null, aura: '#e63946', start: 0, dur: 4000 };

function triggerBankaiFX(c){
  FX.canvas = document.getElementById('bankai-fx');
  FX.ctx = FX.canvas.getContext('2d');
  FX.canvas.width = innerWidth; FX.canvas.height = innerHeight;
  FX.type = c.fx; FX.aura = c.aura; FX.parts = []; FX.start = performance.now(); FX.dur = 4200;
  FX.running = true;
  FX.canvas.classList.add('active');
  document.body.classList.add('shaking');
  setTimeout(function(){ document.body.classList.remove('shaking'); }, 600);
  // overlay nom du bankai
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
  var ctx = FX.ctx, t = (performance.now() - FX.start) / FX.dur; // 0→1
  ctx.clearRect(0, 0, FX.canvas.width, FX.canvas.height);
  var cx = FX.canvas.width / 2, cy = FX.canvas.height / 2;
  var type = FX.type;

  if (type === 'getsuga'){
    // croissant d'énergie noir-rouge qui balaie l'écran
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
    // cristal de glace expansif + flocons
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
    // pétales-lames tourbillonnants
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
    // ondes de choc jaunes/noires violentes
    for (var n = 0; n < 5; n++){
      var pr = (t * 1.6 + n * 0.2) % 1;
      ctx.strokeStyle = n % 2 ? 'rgba(201,162,39,' + (1 - pr) + ')' : 'rgba(20,10,0,' + (1 - pr) + ')';
      ctx.lineWidth = 14 * (1 - pr) + 2;
      ctx.beginPath(); ctx.arc(cx, cy, pr * Math.max(cx, cy) * 1.2, 0, 6.283); ctx.stroke();
    }
  } else if (type === 'dragon'){
    // dragon de glace serpentin
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
    // fouet d'os segmenté qui claque
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
    // faille rouge qui "ouvre" la réalité
    ctx.fillStyle = 'rgba(193,18,31,' + (1 - t) * 0.8 + ')';
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(0.3);
    var hh = t * FX.canvas.height * 0.7;
    ctx.beginPath(); ctx.ellipse(0, 0, 8 + t * 40, hh, 0, 0, 6.283); ctx.fill();
    ctx.restore();
  } else if (type === 'illusion'){
    // kaléidoscope violet hypnotique
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
        '<div class="katana">' + katanaSVG(c.blade, c.aura) + '</div>' +
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
      if (!wasFlipped) triggerBankaiFX(c); // l'animation ne se déclenche qu'à la libération
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
  }
  addEventListener('scroll', onScroll, {passive: true});
  onScroll();
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold: 0.15});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
}

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

buildEras(); buildCards(); buildMusic(); initParticles(); initScrollFX(); initHeroParallax();
addEventListener('resize', function(){
  W = document.getElementById('particles').width = innerWidth;
  H = document.getElementById('particles').height = innerHeight;
});
