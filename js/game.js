'use strict';
/* ============================================================
   LE DERNIER RYŪ — LE JEU (action Canvas, 100% original)
   ============================================================ */
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');
var W = canvas.width, H = canvas.height;

var G = {
  state: 'menu', // menu | playing | wavebreak | win | lose
  keys: {}, lastTime: 0, score: 0, wave: 0,
  player: null, enemies: [], slashes: [], winds: [], particles: [], pickups: [],
  waveTimer: 0, boss: null, touch: false, joyVec: {x:0, y:0}
};

/* ---------- Joueur ---------- */
function newPlayer(){
  return {
    x: W/2, y: H/2, r: 20, speed: 340,
    hp: 100, maxHp: 100, rei: 0, maxRei: 100,
    atkCd: 0, atkAnim: 0, dashCd: 0, dashT: 0, invuln: 0,
    facing: 1, bankai: 0, combo: 0
  };
}

/* ---------- Vagues ---------- */
var WAVES = [
  {count: 5,  hp: 20, speed: 130, msg: 'Vague 1 — les ombres arrivent'},
  {count: 9,  hp: 30, speed: 160, msg: 'Vague 2 — la meute s\u0027épaissit'},
  {count: 14, hp: 40, speed: 190, msg: 'Vague 3 — la nuit a faim'},
  {count: 20, hp: 60, speed: 215, msg: 'Vague 4 — tiens bon'},
  {count: 0,  hp: 0,  speed: 0,   msg: 'LE RYŪ DES TÉNÈBRES', boss: true}
];

function spawnWave(){
  G.wave++;
  var cfg = WAVES[G.wave - 1];
  announce(cfg.msg);
  if (cfg.boss){
    G.boss = { x: W*0.85, y: H*0.3, r: 60, hp: 600, maxHp: 600, t: 0, atkCd: 2, sweepCd: 3 };
    document.getElementById('boss-hud').classList.add('show');
  } else {
    for (var i = 0; i < cfg.count; i++){
      G.enemies.push({
        x: Math.random()*W, y: -40 - Math.random()*300,
        r: 16 + Math.random()*10, hp: cfg.hp, maxHp: cfg.hp,
        speed: cfg.speed * (0.8 + Math.random()*0.4), hitCd: 0, t: Math.random()*10
      });
    }
  }
  updateHud();
}

function announce(msg){
  G.banner = { text: msg, t: 2.2 };
}

/* ---------- Attaques ---------- */
function tryAttack(){
  var p = G.player;
  if (p.atkCd > 0) return;
  var bankaiMul = p.bankai > 0 ? 2 : 1;
  p.atkCd = 0.32; p.atkAnim = 0.18; p.combo++;
  // portée de l'attaque
  var reach = 70 + (p.bankai > 0 ? 20 : 0);
  var dmg = 12 * bankaiMul;
  G.slashes.push({ x: p.x + p.facing*40, y: p.y, t: 0.18, r: reach });
  // dégâts de mêlée
  G.enemies.forEach(function(e){
    var d = Math.hypot(e.x - (p.x + p.facing*36), e.y - p.y);
    if (d < reach && e.hitCd <= 0){ hitEnemy(e, dmg); e.hitCd = 0.2; }
  });
  if (G.boss){
    var db = Math.hypot(G.boss.x - (p.x + p.facing*40), G.boss.y - p.y);
    if (db < reach + G.boss.r*0.6) hitBoss(dmg);
  }
  // en bankai : slash de vent à distance
  if (p.bankai > 0 && p.combo % 2 === 0){
    G.winds.push({ x: p.x + p.facing*50, y: p.y, vx: p.facing * 760, r: 26, t: 1.1, dmg: 10 });
  }
}

function hitEnemy(e, dmg){
  e.hp -= dmg;
  G.player.rei = Math.min(G.player.maxRei, G.player.rei + 6);
  burst(e.x, e.y, '#b791ff', 10);
  if (e.hp <= 0){
    e.dead = true;
    G.score += 100;
    burst(e.x, e.y, '#e63946', 22);
    if (Math.random() < 0.18) G.pickups.push({ x: e.x, y: e.y, type: Math.random()<0.5?'hp':'rei', t: 8 });
  }
  updateHud();
}

function hitBoss(dmg){
  G.boss.hp -= dmg;
  G.player.rei = Math.min(G.player.maxRei, G.player.rei + 4);
  burst(G.boss.x - 40, G.boss.y, '#e63946', 8);
  document.getElementById('boss-fill').style.width = Math.max(0, G.boss.hp / G.boss.maxHp * 100) + '%';
  if (G.boss.hp <= 0) winGame();
}

function tryDash(){
  var p = G.player;
  if (p.dashCd > 0) return;
  p.dashCd = 0.9; p.dashT = 0.16; p.invuln = 0.3;
}

function tryBankai(){
  var p = G.player;
  if (p.rei < p.maxRei || p.bankai > 0) return;
  p.rei = 0; p.bankai = 8;
  announce('BANKAI — KAZEHARIKARI !');
  burst(p.x, p.y, '#7bdff2', 60);
  for (var k = 0; k < 8; k++) G.winds.push({ x: p.x, y: p.y, vx: Math.cos(k/8*6.283)*600, vy: Math.sin(k/8*6.283)*600, r: 26, t: 0.8, dmg: 8 });
  updateHud();
}

function hurtPlayer(dmg){
  var p = G.player;
  if (p.invuln > 0 || p.dashT > 0) return;
  p.hp -= dmg; p.invuln = 0.7;
  burst(p.x, p.y, '#ff5a5f', 12);
  if (p.hp <= 0){ p.hp = 0; loseGame(); }
  updateHud();
}

function burst(x, y, color, n){
  for (var i = 0; i < n; i++){
    var a = Math.random() * 6.283, sp = 60 + Math.random()*260;
    G.particles.push({ x: x, y: y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, life: 0.5 + Math.random()*0.4, color: color, r: 2 + Math.random()*3 });
  }
}

/* ---------- Win / Lose ---------- */
function winGame(){
  G.state = 'win';
  showOverlay('VICTOIRE', 'Le Ryū des ténèbres s\u0027efface en mille lumières. Kaï regarde l\u0027aube se lever sur Karasuma. Score final : ' + G.score + '.', '▶ REJOUER');
  G.boss = null;
  document.getElementById('boss-hud').classList.remove('show');
}
function loseGame(){
  G.state = 'lose';
  showOverlay('K.O.', 'La nuit a eu raison de toi à la vague ' + G.wave + '. Score : ' + G.score + '. Réessaie — la lame n\u0027a pas dit son dernier mot.', '▶ RÉESSAYER');
}
function showOverlay(title, text, btn){
  document.getElementById('ov-title').textContent = title;
  document.getElementById('ov-text').textContent = text;
  document.getElementById('ov-btn').textContent = btn;
  document.getElementById('overlay').classList.remove('hidden');
}
function startGame(){
  G.state = 'playing'; G.score = 0; G.wave = 0;
  G.player = newPlayer();
  G.enemies = []; G.slashes = []; G.winds = []; G.particles = []; G.pickups = [];
  G.boss = null; G.waveTimer = 0.8;
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('boss-hud').classList.remove('show');
  updateHud();
}
document.getElementById('ov-btn').addEventListener('click', startGame);

/* ---------- HUD ---------- */
function updateHud(){
  var p = G.player;
  if (!p) return;
  document.getElementById('hp-fill').style.width = (p.hp / p.maxHp * 100) + '%';
  document.getElementById('hp-txt').textContent = Math.ceil(p.hp);
  document.getElementById('rei-fill').style.width = (p.rei / p.maxRei * 100) + '%';
  document.getElementById('rei-txt').textContent = Math.floor(p.rei) + '%';
  document.getElementById('score-txt').textContent = 'Score ' + G.score;
  document.getElementById('wave-txt').textContent = 'Vague ' + Math.max(1, G.wave);
}

/* ---------- Entrées ---------- */
addEventListener('keydown', function(e){
  G.keys[e.key.toLowerCase()] = true;
  if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault();
  if (G.state !== 'playing') return;
  if (e.key.toLowerCase() === 'j' || e.key === ' ') tryAttack();
  if (e.key.toLowerCase() === 'k' || e.key === 'Shift') tryDash();
  if (e.key.toLowerCase() === 'b') tryBankai();
});
addEventListener('keyup', function(e){ G.keys[e.key.toLowerCase()] = false; });

/* tactile */
function isTouch(){ return 'ontouchstart' in window; }
var joy = document.getElementById('joy'), knob = document.getElementById('joy-knob');
if (joy){
  joy.addEventListener('touchstart', joyMove, {passive:true});
  joy.addEventListener('touchmove', joyMove, {passive:true});
  joy.addEventListener('touchend', function(){ G.joyVec = {x:0,y:0}; knob.style.left='38px'; knob.style.top='38px'; });
}
function joyMove(e){
  var t = e.touches[0], r = joy.getBoundingClientRect();
  var dx = (t.clientX - (r.left + r.width/2)) / (r.width/2);
  var dy = (t.clientY - (r.top + r.height/2)) / (r.height/2);
  var m = Math.hypot(dx, dy) || 1; if (m > 1){ dx /= m; dy /= m; }
  G.joyVec = {x: dx, y: dy};
  knob.style.left = (38 + dx*38) + 'px'; knob.style.top = (38 + dy*38) + 'px';
}
function bindBtn(id, fn){
  var el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('touchstart', function(e){ e.preventDefault(); if (G.state === 'playing') fn(); }, {passive:false});
}
bindBtn('t-atk', tryAttack); bindBtn('t-dash', tryDash); bindBtn('t-bankai', tryBankai);

/* ---------- Update ---------- */
function update(dt){
  var p = G.player;
  if (G.state !== 'playing' || !p) return;

  // cooldowns
  p.atkCd = Math.max(0, p.atkCd - dt); p.atkAnim = Math.max(0, p.atkAnim - dt);
  p.dashCd = Math.max(0, p.dashCd - dt); p.dashT = Math.max(0, p.dashT - dt);
  p.invuln = Math.max(0, p.invuln - dt);
  if (p.bankai > 0) p.bankai = Math.max(0, p.bankai - dt);

  // déplacement
  var vx = 0, vy = 0;
  if (G.keys['arrowleft'] || G.keys['a'] || G.keys['q']) vx -= 1;
  if (G.keys['arrowright'] || G.keys['d']) vx += 1;
  if (G.keys['arrowup'] || G.keys['w'] || G.keys['z']) vy -= 1;
  if (G.keys['arrowdown'] || G.keys['s']) vy += 1;
  vx += G.joyVec.x; vy += G.joyVec.y;
  var m = Math.hypot(vx, vy); if (m > 1){ vx /= m; vy /= m; }
  if (vx !== 0) p.facing = vx > 0 ? 1 : -1;
  var sp = p.speed * (p.dashT > 0 ? 3.2 : 1) * (p.bankai > 0 ? 1.25 : 1);
  p.x = Math.max(30, Math.min(W-30, p.x + vx * sp * dt));
  p.y = Math.max(70, Math.min(H-40, p.y + vy * sp * dt));

  // ennemis
  G.enemies.forEach(function(e){
    e.t += dt; e.hitCd = Math.max(0, e.hitCd - dt);
    if (e.dead) return;
    var dx = p.x - e.x, dy = p.y - e.y, d = Math.hypot(dx, dy) || 1;
    e.x += dx/d * e.speed * dt; e.y += dy/d * e.speed * dt;
    if (d < e.r + p.r && e.hitCd <= 0){ hurtPlayer(10); e.hitCd = 0.8; }
  });
  G.enemies = G.enemies.filter(function(e){ return !e.dead; });

  // boss
  if (G.boss){
    var b = G.boss; b.t += dt; b.atkCd -= dt; b.sweepCd -= dt;
    b.y = H*0.35 + Math.sin(b.t*1.4) * H*0.2;
    b.x = W*0.72 + Math.sin(b.t*0.8) * W*0.15;
    if (b.atkCd <= 0){ b.atkCd = 2.2; for (var i=0;i<5;i++) G.enemies.push({ x: b.x, y: b.y, r: 14, hp: 15, maxHp: 15, speed: 180, hitCd: 0, t: Math.random()*10 }); }
    if (b.sweepCd <= 0){
      b.sweepCd = 4.5;
      var a = Math.atan2(p.y - b.y, p.x - b.x);
      for (var k = -2; k <= 2; k++){
        G.winds.push({ x: b.x, y: b.y, vx: Math.cos(a + k*0.18)*420, vy: Math.sin(a + k*0.18)*420, r: 20, t: 2.2, dmg: 0, enemy: true });
      }
    }
    if (Math.hypot(b.x - p.x, b.y - p.y) < b.r + p.r) hurtPlayer(12);
  }

  // slashs visuels
  G.slashes.forEach(function(s){ s.t -= dt; });
  G.slashes = G.slashes.filter(function(s){ return s.t > 0; });

  // vents (projectiles joueur & boss)
  G.winds.forEach(function(w){
    w.t -= dt; w.x += w.vx * dt; w.y += (w.vy || 0) * dt;
    if (w.enemy){
      if (Math.hypot(w.x - p.x, w.y - p.y) < w.r + p.r){ hurtPlayer(8); w.t = 0; }
    } else {
      G.enemies.forEach(function(e){ if (!e.dead && Math.hypot(w.x - e.x, w.y - e.y) < w.r + e.r){ hitEnemy(e, w.dmg); w.t = 0; } });
      if (G.boss && Math.hypot(w.x - G.boss.x, w.y - G.boss.y) < w.r + G.boss.r){ hitBoss(w.dmg); w.t = 0; }
    }
  });
  G.winds = G.winds.filter(function(w){ return w.t > 0; });

  // particules
  G.particles.forEach(function(pt){ pt.life -= dt; pt.x += pt.vx*dt; pt.y += pt.vy*dt; pt.vx *= 0.96; pt.vy *= 0.96; });
  G.particles = G.particles.filter(function(pt){ return pt.life > 0; });

  // pickups
  G.pickups.forEach(function(pk){
    pk.t -= dt;
    var d = Math.hypot(pk.x - p.x, pk.y - p.y);
    if (d < 34){
      pk.t = 0;
      if (pk.type === 'hp') p.hp = Math.min(p.maxHp, p.hp + 20);
      else p.rei = Math.min(p.maxRei, p.rei + 30);
      updateHud();
    }
  });
  G.pickups = G.pickups.filter(function(pk){ return pk.t > 0; });

  // fin de vague
  if (!G.boss && G.enemies.length === 0){
    G.waveTimer -= dt;
    if (G.waveTimer <= 0){
      if (G.wave >= WAVES.length){ /* ne devrait pas arriver : le boss gère la fin */ }
      else spawnWave();
      G.waveTimer = 999; // remis après le spawn
      if (!WAVES[G.wave-1].boss) G.waveTimer = 999;
      else G.waveTimer = 999;
      // les ennemis existent, timer inutile jusqu'au clear
    }
  }
  // petit délai entre les vagues : géré par ennemis.length === 0 + timer
  if (G.banner){ G.banner.t -= dt; if (G.banner.t <= 0) G.banner = null; }
  updateHud();
}

/* ---------- Draw ---------- */
function drawKai(c, p){
  c.save();
  c.translate(p.x, p.y);
  if (p.invuln > 0 && Math.sin(Date.now()/40) > 0) c.globalAlpha = 0.4;
  var walk = Math.sin(Date.now()/120) * 4;
  // aura bankai
  if (p.bankai > 0){
    c.save();
    c.globalAlpha = 0.5 + 0.2*Math.sin(Date.now()/90);
    c.strokeStyle = '#7bdff2'; c.lineWidth = 3;
    c.beginPath(); c.arc(0, 0, 34, 0, 6.283); c.stroke();
    c.restore();
  }
  // corps (silhouette stylisée)
  c.fillStyle = '#14141e';
  c.beginPath(); c.moveTo(-12, 16); c.lineTo(12, 16); c.lineTo(15, 44); c.lineTo(-15, 44); c.closePath(); c.fill();
  c.strokeStyle = '#14141e'; c.lineWidth = 6; c.lineCap = 'round';
  c.beginPath(); c.moveTo(0, 36); c.lineTo(-8 + walk, 62); c.stroke();
  c.beginPath(); c.moveTo(0, 36); c.lineTo(8 - walk, 62); c.stroke();
  c.beginPath(); c.moveTo(-10, 22); c.lineTo(-20, 38 + walk); c.stroke();
  c.beginPath(); c.moveTo(10, 22); c.lineTo(20, 38 - walk); c.stroke();
  // tête + cheveux
  c.fillStyle = '#e8c9a8'; c.beginPath(); c.arc(0, 0, 9, 0, 6.283); c.fill();
  c.fillStyle = '#4a5568'; c.beginPath(); c.arc(0, -2, 10, Math.PI, 0); c.fill();
  // sabre
  var ang = p.atkAnim > 0 ? (-1.6 + (1 - p.atkAnim/0.18) * 3.0) : -0.4;
  c.save();
  c.translate(p.facing * 12, 18);
  c.scale(p.facing, 1);
  c.rotate(ang);
  c.strokeStyle = p.bankai > 0 ? '#bff4ff' : '#cfd3d8'; c.lineWidth = 4;
  c.beginPath(); c.moveTo(8, 0); c.lineTo(52, 0); c.stroke();
  c.strokeStyle = '#8d0801'; c.lineWidth = 6;
  c.beginPath(); c.moveTo(-6, 0); c.lineTo(6, 0); c.stroke();
  c.restore();
  c.restore();
}

function drawEnemy(c, e){
  c.save();
  c.translate(e.x, e.y);
  var wob = 1 + 0.12 * Math.sin(e.t * 6);
  // corps d'ombre
  c.fillStyle = '#1c0f2e';
  c.beginPath(); c.ellipse(0, 0, e.r * 1.1 * wob, e.r * wob, 0, 0, 6.283); c.fill();
  // traînée
  c.globalAlpha = 0.3;
  c.beginPath(); c.ellipse(0, -e.r*0.9, e.r*0.6, e.r*0.5, 0, 0, 6.283); c.fill();
  c.globalAlpha = 1;
  // masque
  c.fillStyle = '#e8e4da';
  c.beginPath(); c.arc(0, 0, e.r * 0.55, 0, 6.283); c.fill();
  // yeux
  c.fillStyle = '#e63946';
  c.beginPath(); c.arc(-3, -2, 2, 0, 6.283); c.fill();
  c.beginPath(); c.arc(4, -2, 2, 0, 6.283); c.fill();
  // barre de vie
  c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(-e.r, -e.r-10, e.r*2, 4);
  c.fillStyle = '#e63946'; c.fillRect(-e.r, -e.r-10, e.r*2*(e.hp/e.maxHp), 4);
  c.restore();
}

function drawBoss(c, b){
  c.save();
  // corps serpentin
  c.strokeStyle = '#2a0f3a'; c.lineCap = 'round';
  for (var layer = 0; layer < 3; layer++){
    c.lineWidth = 90 - layer*26; c.globalAlpha = 0.16 + 0.08*layer;
    c.beginPath();
    for (var i = 0; i <= 22; i++){
      var pp = i/22;
      var x = b.x - pp * W * 0.55;
      var y = b.y + Math.sin(pp*6 + b.t*2) * 60;
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
  }
  c.globalAlpha = 1;
  // tête
  c.fillStyle = '#1c0f2e';
  c.beginPath(); c.ellipse(b.x, b.y, 66, 42, -0.25, 0, 6.283); c.fill();
  // cornes
  c.strokeStyle = '#0e0716'; c.lineWidth = 8;
  c.beginPath(); c.moveTo(b.x-10, b.y-30); c.lineTo(b.x-34, b.y-70); c.stroke();
  c.beginPath(); c.moveTo(b.x+22, b.y-24); c.lineTo(b.x+48, b.y-58); c.stroke();
  // œil doré
  c.fillStyle = '#ffd700';
  c.shadowColor = '#ffd700'; c.shadowBlur = 24;
  c.beginPath(); c.arc(b.x-6, b.y-10, 10, 0, 6.283); c.fill();
  c.shadowBlur = 0;
  c.restore();
}

function draw(){
  // fond
  var g = ctx.createLinearGradient(0, 0, 0, H);
  if (G.player && G.player.bankai > 0){ g.addColorStop(0, '#08283a'); g.addColorStop(1, '#0a1520'); }
  else { g.addColorStop(0, '#070b20'); g.addColorStop(1, '#100a1c'); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // étoiles
  for (var i = 0; i < 60; i++){
    var x = (Math.sin(i*12.9898)*0.5+0.5)*W, y = (Math.sin(i*78.233)*0.5+0.5)*H*0.5;
    ctx.globalAlpha = 0.3 + 0.3*Math.sin(i + Date.now()/700);
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, 1.6, 1.6);
  }
  ctx.globalAlpha = 1;
  // sol de toit
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(0, H-90, W, 2);

  if (G.state === 'menu'){ return; }

  // pickups
  G.pickups.forEach(function(pk){
    ctx.save();
    var col = pk.type === 'hp' ? '#ff5a5f' : '#7bdff2';
    ctx.globalAlpha = pk.t < 1.5 ? Math.sin(pk.t*10)*0.5+0.5 : 1;
    ctx.strokeStyle = col; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(pk.x, pk.y + Math.sin(Date.now()/200)*4, 10, 0, 6.283); ctx.stroke();
    ctx.fillStyle = col;
    ctx.font = '700 10px Rajdhani'; ctx.textAlign = 'center';
    ctx.fillText(pk.type === 'hp' ? '+PV' : 'REI', pk.x, pk.y + Math.sin(Date.now()/200)*4 + 3);
    ctx.restore();
  });

  // ennemis
  G.enemies.forEach(function(e){ drawEnemy(ctx, e); });
  // boss
  if (G.boss) drawBoss(ctx, G.boss);
  // slashs
  G.slashes.forEach(function(s){
    ctx.save();
    ctx.globalAlpha = s.t / 0.18;
    ctx.strokeStyle = G.player.bankai > 0 ? '#bff4ff' : '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, -0.8, 0.8); ctx.stroke();
    ctx.restore();
  });
  // vents
  G.winds.forEach(function(w){
    ctx.save();
    ctx.globalAlpha = Math.min(1, w.t * 2);
    var wg = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
    var col = w.enemy ? '183,145,255' : '123,223,242';
    wg.addColorStop(0, 'rgba(' + col + ',0.8)'); wg.addColorStop(1, 'rgba(' + col + ',0)');
    ctx.fillStyle = wg;
    ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, 6.283); ctx.fill();
    ctx.restore();
  });
  // joueur
  if (G.player) drawKai(ctx, G.player);
  // particules
  G.particles.forEach(function(pt){
    ctx.save(); ctx.globalAlpha = Math.max(0, pt.life);
    ctx.fillStyle = pt.color;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, 6.283); ctx.fill();
    ctx.restore();
  });
  // bannière
  if (G.banner){
    ctx.save();
    ctx.globalAlpha = Math.min(1, G.banner.t);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.font = '900 40px Cinzel, serif';
    ctx.shadowColor = 'rgba(230,57,70,.9)'; ctx.shadowBlur = 30;
    ctx.fillText(G.banner.text, W/2, H*0.4);
    ctx.restore();
  }
  // bankai timer
  if (G.player && G.player.bankai > 0){
    ctx.save();
    ctx.fillStyle = '#7bdff2'; ctx.textAlign = 'center';
    ctx.font = '700 16px Rajdhani';
    ctx.fillText('KAZEHARIKARI — ' + G.player.bankai.toFixed(1) + 's', W/2, 34);
    ctx.restore();
  }
}

/* ---------- Boucle ---------- */
function loop(ts){
  var dt = Math.min(0.033, (ts - G.lastTime) / 1000 || 0.016);
  G.lastTime = ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

/* gestion délai inter-vagues propre */
var origUpdate = update;
update = function(dt){
  origUpdate(dt);
  // après le clear d'une vague non-boss : pause de 3 s puis vague suivante
  if (G.state === 'playing' && !G.boss && G.enemies.length === 0 && G.wave > 0 && !WAVES[G.wave-1].boss){
    G.betweenT = (G.betweenT || 0) + dt;
    if (G.betweenT > 3){ G.betweenT = 0; if (G.wave < WAVES.length) spawnWave(); }
  }
};

/* init */
if (isTouch()) document.getElementById('touch').classList.add('show');
var io = new IntersectionObserver(function(es){
  es.forEach(function(e){ if (e.isIntersecting) e.target.classList.add('in'); });
}, {threshold: 0.15});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
requestAnimationFrame(loop);
