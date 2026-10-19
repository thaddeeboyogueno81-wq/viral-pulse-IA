'use strict';
/* ================================================================
   LE DERNIER RYŪ — court-métrage original de 7 minutes
   Moteur d'animation Canvas + timeline de 42 séquences.
   ================================================================ */

var ACTS = [
  {n:1, t:'La ville endormie', d:'Karasuma la nuit. Kaï patrouille, son zanpakutō muet au fourreau.', dur:60},
  {n:2, t:'L\u0027arrivée du Ryū', d:'Le ciel se déchire. Le Ryū des ténèbres absorbe les âmes de la ville.', dur:60},
  {n:3, t:'La lame muette', d:'Kaï attaque — et échoue. Son zanpakutō refuse de parler.', dur:60},
  {n:4, t:'Le souvenir', d:'Flashback : le maître de Kaï, et la leçon des noms.', dur:60},
  {n:5, t:'L\u0027entraînement intérieur', d:'Dans son monde intérieur, Kaï affronte l\u0027esprit de sa lame.', dur:60},
  {n:6, t:'La libération', d:'Kaï prononce enfin le nom : « Rugis, Kazehikari ! »', dur:60},
  {n:7, t:'Le dernier souffle', d:'Le duel final. Le Ryū s\u0027efface. L\u0027aube se lève sur Karasuma.', dur:60}
];

/* Chaque acte = liste de séquences {dur en s, sub, draw(t, ctx, W, H)} où t = 0..1 */
function skyGrad(ctx, W, H, top, bot){
  var g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top); g.addColorStop(1, bot);
  return g;
}
function drawStars(ctx, W, H, seed, alpha){
  ctx.save();
  for (var i = 0; i < 90; i++){
    var x = (Math.sin(i * 12.9898 + seed) * 0.5 + 0.5) * W;
    var y = (Math.sin(i * 78.233 + seed) * 0.5 + 0.5) * H * 0.6;
    var tw = 0.5 + 0.5 * Math.sin(i * 3.7 + seed * 0.01);
    ctx.globalAlpha = alpha * tw * 0.9;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, 1.6, 1.6);
  }
  ctx.restore();
}
function citySilhouette(ctx, W, H, color, scale){
  ctx.save();
  ctx.fillStyle = color;
  var seed = 7;
  for (var x = 0; x < W; x += 42 * scale){
    var h = (0.18 + 0.28 * Math.abs(Math.sin(x * 0.013 + seed))) * H;
    ctx.fillRect(x, H - h, 34 * scale, h);
    ctx.fillStyle = 'rgba(255,220,130,0.12)';
    for (var wy = H - h + 14; wy < H - 14; wy += 22) ctx.fillRect(x + 6, wy, 6, 9);
    ctx.fillStyle = color;
  }
  ctx.restore();
}
/* Personnage : silhouette shinigami stylisée (originale) */
function drawKai(ctx, x, y, s, opts){
  opts = opts || {};
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  var cloth = opts.cloth || '#14141e';
  var hair = opts.hair || '#4a5568';
  var skin = '#e8c9a8';
  var walk = opts.walk ? Math.sin(opts.walk * 8) * 6 : 0;
  // jambes
  ctx.strokeStyle = cloth; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 34); ctx.lineTo(-6 + walk, 62); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 34); ctx.lineTo(6 - walk, 62); ctx.stroke();
  // hakama/shihakushō
  ctx.fillStyle = cloth;
  ctx.beginPath();
  ctx.moveTo(-11, 14); ctx.lineTo(11, 14); ctx.lineTo(13, 40); ctx.lineTo(-13, 40); ctx.closePath(); ctx.fill();
  // bras
  ctx.strokeStyle = cloth;
  ctx.beginPath(); ctx.moveTo(-9, 18); ctx.lineTo(-16 - (opts.sword ? 14 : 0), 30 + walk * 0.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(9, 18); ctx.lineTo(16 + (opts.sword ? 8 : 0), 30 - walk * 0.5); ctx.stroke();
  // tête
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(0, 2, 8.5, 0, 6.283); ctx.fill();
  // cheveux
  ctx.fillStyle = hair;
  ctx.beginPath(); ctx.arc(0, 0, 9.5, Math.PI, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-9, 0); ctx.quadraticCurveTo(-13, 10, -8, 16); ctx.quadraticCurveTo(-6, 8, -7, 0); ctx.fill();
  // yeux
  if (!opts.backview){ ctx.fillStyle = '#20202a'; ctx.fillRect(-4, 3, 2, 2); ctx.fillRect(2, 3, 2, 2); }
  // katana
  if (opts.sword){
    ctx.strokeStyle = '#cfd3d8'; ctx.lineWidth = 3;
    var ang = opts.swordAngle || 0.6;
    ctx.save(); ctx.translate(14, 26); ctx.rotate(ang);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(38, 0); ctx.stroke();
    ctx.strokeStyle = '#1a1a22'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(0, 0); ctx.stroke();
    ctx.restore();
  }
  if (opts.glow){
    ctx.globalAlpha = 0.5 + 0.3 * Math.sin(Date.now() / 200);
    ctx.strokeStyle = opts.glow; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 10, 34, 0, 6.283); ctx.stroke();
  }
  ctx.restore();
}
/* Le Ryū : dragon-serpent d'ombre */
function drawRyu(ctx, W, H, t, color, intensity){
  ctx.save();
  ctx.strokeStyle = color; ctx.lineCap = 'round';
  var segs = 26;
  for (var layer = 0; layer < 3; layer++){
    ctx.lineWidth = 60 - layer * 18;
    ctx.globalAlpha = 0.10 + 0.06 * layer + (intensity || 0);
    ctx.beginPath();
    for (var i = 0; i <= segs; i++){
      var p = i / segs;
      var x = W * 0.15 + p * W * 0.75;
      var y = H * 0.3 + Math.sin(p * 7 + t * 6 + layer) * H * 0.14;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // tête
  var hx = W * 0.9, hy = H * 0.3 + Math.sin(6 + t * 6) * H * 0.14;
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(hx, hy, 46, 30, -0.3, 0, 6.283); ctx.fill();
  // œil
  ctx.fillStyle = '#ffd700';
  ctx.beginPath(); ctx.arc(hx - 14, hy - 8, 7, 0, 6.283); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}
function drawTitle(ctx, W, H, line1, line2, alpha){
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.font = '900 ' + Math.round(H * 0.09) + 'px Cinzel, serif';
  ctx.shadowColor = 'rgba(230,57,70,0.8)'; ctx.shadowBlur = 40;
  ctx.fillText(line1, W / 2, H * 0.42);
  if (line2){
    ctx.font = '600 ' + Math.round(H * 0.035) + 'px Rajdhani, sans-serif';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#d4a24e';
    ctx.fillText(line2, W / 2, H * 0.52);
  }
  ctx.restore();
}

var SCRIPT = [
/* ===== ACTE 1 — La ville endormie (60 s) ===== */
[
  {dur:10, sub:'Karasuma, 2 h 47 du matin. La ville dort sous les étoiles.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#060a1c','#0e1430'); c.fillRect(0,0,W,H);
    drawStars(c,W,H,t*100,1);
    var moonX = W*0.78, moonY = H*0.22 + Math.sin(t*2)*4;
    c.fillStyle='#f4f0e0'; c.beginPath(); c.arc(moonX,moonY,34,0,6.283); c.fill();
    citySilhouette(c,W,H,'#04050c',1);
  }},
  {dur:8, sub:'', draw:function(t,c,W,H){ // titre
    c.fillStyle = skyGrad(c,W,H,'#060a1c','#0e1430'); c.fillRect(0,0,W,H);
    drawStars(c,W,H,3,1);
    drawTitle(c,W,H,'LE DERNIER RYŪ','un court-métrage original', Math.min(1, t*4) * Math.min(1, (1-t)*4 + 0.2));
  }},
  {dur:12, sub:'Sur un toit, une silhouette veille. Kaï Ryūzaki, Division 13.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#070b20','#101638'); c.fillRect(0,0,W,H);
    drawStars(c,W,H,9,0.8); citySilhouette(c,W,H,'#05060e',1);
    drawKai(c, W*0.5, H*0.66, 1.6, {backview:true, walk:t});
  }},
  {dur:10, sub:'« Trois nuits sans un seul Hollow… c\u0027est trop calme. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#070b20','#101638'); c.fillRect(0,0,W,H);
    drawStars(c,W,H,9,0.8); citySilhouette(c,W,H,'#05060e',1);
    drawKai(c, W*0.5, H*0.66, 1.6, {backview:true, walk:t});
    c.save(); c.globalAlpha=0.35+0.2*Math.sin(t*6); c.strokeStyle='#e63946'; c.lineWidth=1.5;
    c.beginPath(); c.arc(W*0.5,H*0.66,60,0,6.283); c.stroke(); c.restore();
  }},
  {dur:10, sub:'Sa lame ne lui a jamais parlé. Les autres l\u0027appellent « le shinigami muet ».', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#070b20','#101638'); c.fillRect(0,0,W,H);
    drawStars(c,W,H,9,0.6); citySilhouette(c,W,H,'#05060e',1);
    drawKai(c, W*0.5, H*0.66, 1.6, {sword:true, swordAngle:0.2});
    c.save(); c.globalAlpha=0.3+0.15*Math.sin(t*3);
    c.fillStyle='#7a8aa0'; c.font='600 20px Rajdhani'; c.textAlign='center';
    c.fillText('?', W*0.5+40, H*0.58); c.restore();
  }},
  {dur:10, sub:'Puis le vent se lève. Le mauvais vent.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#070b20','#141a3c'); c.fillRect(0,0,W,H);
    drawStars(c,W,H,9,0.5); citySilhouette(c,W,H,'#05060e',1);
    drawKai(c, W*0.5, H*0.66, 1.6, {backview:true});
    for (var i=0;i<26;i++){
      c.save(); c.globalAlpha=0.5;
      c.strokeStyle='#3a4a6a'; c.lineWidth=1;
      var x=(i*97+t*600)%W, y=(i*53+t*260)%H;
      c.beginPath(); c.moveTo(x,y); c.lineTo(x+46,y+6); c.stroke(); c.restore();
    }
  }}
],
/* ===== ACTE 2 — L'arrivée du Ryū (60 s) ===== */
[
  {dur:10, sub:'Le ciel se déchire au-dessus de la gare.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#0a0714','#1c0a20'); c.fillRect(0,0,W,H);
    drawStars(c,W,H,9,0.4);
    var g=c.createRadialGradient(W*0.5,H*0.2,0,W*0.5,H*0.2,W*0.5*(t+0.2));
    g.addColorStop(0,'rgba(120,40,140,'+(0.9-t*0.5)+')'); g.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=g; c.fillRect(0,0,W,H);
    citySilhouette(c,W,H,'#03030a',1);
  }},
  {dur:10, sub:'Une ombre millénaire glisse entre les immeubles. Elle chante une langue oubliée.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#0a0512','#180820'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,t,'#3a1050',0.15);
    citySilhouette(c,W,H,'#03030a',1);
  }},
  {dur:10, sub:'« Un Ryū… impossible. Ils ont disparu il y a mille ans. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#0a0512','#180820'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,t,'#3a1050',0.25);
    drawKai(c,W*0.18,H*0.7,1.6,{sword:true});
    citySilhouette(c,W,H,'#03030a',1);
  }},
  {dur:10, sub:'Là où l\u0027ombre passe, les lumières de la ville s\u0027éteignent, une à une.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#0a0512','#150618'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,t,'#3a1050',0.3);
    var lit = 1 - t;
    c.save(); c.fillStyle='#000'; c.globalAlpha = Math.min(1, t*1.4);
    var seed=3;
    for (var x=0; x<W; x+=42){ var h=(0.18+0.28*Math.abs(Math.sin(x*0.013+seed)))*H; c.fillRect(x,H-h,34,h); }
    c.restore();
    // fenêtres qui s'éteignent
    c.save();
    for (var x2=0; x2<W; x2+=42){
      var on = Math.sin(x2*0.7) > -0.6 && Math.random() > (t*0.9);
      if (on){ c.fillStyle='rgba(255,220,130,0.5)'; var h2=(0.18+0.28*Math.abs(Math.sin(x2*0.013+3)))*H; c.fillRect(x2+6,H-h2+14,6,9); }
    }
    c.restore();
  }},
  {dur:10, sub:'Les âmes s\u0027élèvent des corps endormis — et se dissolvent dans la nuit.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#12051a'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,t,'#3a1050',0.35);
    citySilhouette(c,W,H,'#020208',1);
    for (var i=0;i<18;i++){
      var p=((t*1.2 + i*0.055)%1);
      var x=W*(0.1+((i*0.37)%0.8)), y=H*0.95-p*H*0.75;
      c.save(); c.globalAlpha=Math.sin(p*Math.PI)*0.7;
      c.fillStyle='#cfd8e8'; c.beginPath(); c.ellipse(x,y,5,9,0,0,6.283); c.fill(); c.restore();
    }
  }},
  {dur:10, sub:'« Cette nuit, je ne te laisserai pas prendre un seul souffle de plus. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#12051a'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,t,'#3a1050',0.3);
    drawKai(c,W*0.2,H*0.72,1.7,{sword:true, glow:'#e63946'});
    citySilhouette(c,W,H,'#020208',1);
  }}
],
/* ===== ACTE 3 — La lame muette (60 s) ===== */
[
  {dur:12, sub:'Kaï bondit. Son sabre frappe l\u0027ombre — et la traverse, sans rien blesser.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#12051a'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,t*0.5,'#3a1050',0.3);
    var jump = Math.sin(t*Math.PI)*H*0.25;
    drawKai(c, W*0.25 + t*W*0.4, H*0.75 - jump, 1.7, {sword:true, swordAngle:-0.8, glow:'#e63946'});
    citySilhouette(c,W,H,'#020208',1);
  }},
  {dur:10, sub:'L\u0027ombre le frappe en retour. Kaï traverse trois murs.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#0c0312'); c.fillRect(0,0,W,H);
    // trajectoire de chute
    var x = W*0.7 - t*W*0.5, y = H*0.35 + t*t*H*0.4;
    drawKai(c, x, y, 1.7, {sword:true});
    for (var i=0;i<14;i++){
      c.save(); c.globalAlpha=Math.max(0, 0.7 - t*0.5 - i*0.04);
      c.fillStyle='#e63946'; c.fillRect((x - t*W*0.5*(i/6))%W, y+ (i%5)*10-20, 3, 3); c.restore();
    }
    citySilhouette(c,W,H,'#020208',1);
  }},
  {dur:10, sub:'« Pourquoi… pourquoi ne m\u0027écoutes-tu jamais ?! »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#0c0312'); c.fillRect(0,0,W,H);
    drawKai(c, W*0.45, H*0.85, 1.7, {sword:true, swordAngle:0.9});
    // pluie
    for (var i=0;i<50;i++){
      var rx=(i*131)%W, ry=((i*57)+t*900)%H;
      c.strokeStyle='rgba(140,160,200,0.35)'; c.lineWidth=1;
      c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx-4,ry+18); c.stroke();
    }
  }},
  {dur:14, sub:'La voix du Ryū fait trembler les rues : « Ta lame est muette parce que tu as peur d\u0027écouter. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#0c0312'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,0.5+t*0.3,'#4a1560',0.4 + 0.2*Math.sin(t*10));
    drawKai(c, W*0.2, H*0.85, 1.6, {sword:true});
    // ondes sonores
    for (var k=0;k<3;k++){
      var pr=((t*2+k*0.33)%1);
      c.save(); c.globalAlpha=(1-pr)*0.4; c.strokeStyle='#b791ff'; c.lineWidth=3;
      c.beginPath(); c.arc(W*0.85,H*0.3,pr*W*0.8,0,6.283); c.stroke(); c.restore();
    }
    citySilhouette(c,W,H,'#020208',1);
  }},
  {dur:14, sub:'« Un zanpakutō ne parle pas à ceux qui ont honte de leur propre nom. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#0c0312'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,0.5+t*0.3,'#4a1560',0.35);
    drawKai(c, W*0.2, H*0.85, 1.6, {sword:true});
    // gros plan virtuel sur le sabre (glow faible)
    c.save(); c.globalAlpha=0.5+0.3*Math.sin(t*5);
    var g=c.createRadialGradient(W*0.5,H*0.6,0,W*0.5,H*0.6,120);
    g.addColorStop(0,'rgba(150,160,180,0.4)'); g.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=g; c.fillRect(0,0,W,H); c.restore();
  }}
],
/* ===== ACTE 4 — Le souvenir (60 s) ===== */
[
  {dur:12, sub:'Dans la poussière, Kaï se souvient. Son maître, sept ans plus tôt.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#1c1a10','#2e2818'); c.fillRect(0,0,W,H);
    c.save(); c.globalAlpha=0.25; c.fillStyle='#f4e8c0'; c.fillRect(0,0,W,H); c.restore();
    // dojo
    c.fillStyle='#2a2010'; c.fillRect(W*0.1,H*0.2,W*0.8,H*0.6);
    c.strokeStyle='#4a3a1a'; c.lineWidth=6; c.strokeRect(W*0.1,H*0.2,W*0.8,H*0.6);
    drawKai(c, W*0.35, H*0.7, 1.4, {sword:true, hair:'#3a3a3a'});
    drawKai(c, W*0.62, H*0.7, 1.4, {sword:true, hair:'#cfcfcf', cloth:'#2a2a3a'});
  }},
  {dur:12, sub:'« Un jour, ta lame t\u0027appellera. Ce jour-là, n\u0027oublie pas : nommer, c\u0027est accepter de perdre. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#1c1a10','#2e2818'); c.fillRect(0,0,W,H);
    c.fillStyle='#2a2010'; c.fillRect(W*0.1,H*0.2,W*0.8,H*0.6);
    drawKai(c, W*0.35, H*0.7, 1.4, {hair:'#3a3a3a'});
    drawKai(c, W*0.62, H*0.7, 1.4, {hair:'#cfcfcf', cloth:'#2a2a3a'});
    c.save(); c.globalAlpha=0.8; c.fillStyle='#f4e0a0'; c.font='700 26px Cinzel'; c.textAlign='center';
    c.fillText('« ...c\u0027est accepter de perdre. »', W*0.5, H*0.14); c.restore();
  }},
  {dur:12, sub:'Kaï, adolescent, frappe encore et encore. La lame reste éteinte. Il a honte.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#1c1a10','#2e2818'); c.fillRect(0,0,W,H);
    var swing = Math.sin(t*Math.PI*6)*0.8;
    drawKai(c, W*0.5, H*0.7, 1.5, {sword:true, swordAngle:swing, hair:'#3a3a3a'});
    c.save(); c.globalAlpha=0.4; c.strokeStyle='#a8a8b8'; c.lineWidth=2;
    c.beginPath(); c.arc(W*0.5+40,H*0.62,50,swing,swing+1.2); c.stroke(); c.restore();
  }},
  {dur:12, sub:'« Pourquoi toi, tu pleures ? » demandait le maître. Kaï ne répondait pas.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#1a180e','#282214'); c.fillRect(0,0,W,H);
    drawKai(c, W*0.4, H*0.75, 1.5, {sword:true, swordAngle:0.9, hair:'#3a3a3a'});
    // larme stylisée + pluie légère
    for (var i=0;i<30;i++){
      var rx=(i*97)%W, ry=((i*53)+t*700)%H;
      c.strokeStyle='rgba(160,170,200,0.3)'; c.lineWidth=1;
      c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx-3,ry+14); c.stroke();
    }
  }},
  {dur:12, sub:'« Le jour où tu comprendras ta peur, tu entendras son nom. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#1a180e','#282214'); c.fillRect(0,0,W,H);
    c.save(); c.globalAlpha = Math.min(1, t*3);
    c.fillStyle = 'rgba(244,224,160,' + (0.1+0.1*Math.sin(t*4)) + ')';
    c.fillRect(0,0,W,H); c.restore();
    drawKai(c, W*0.5, H*0.7, 1.5, {sword:true, hair:'#3a3a3a'});
  }}
],
/* ===== ACTE 5 — L'entraînement intérieur (60 s) ===== */
[
  {dur:12, sub:'Le monde s\u0027effondre. Kaï tombe — à l\u0027intérieur de lui-même.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#0a0a1e','#1a0a2a'); c.fillRect(0,0,W,H);
    for (var ring=0; ring<7; ring++){
      var pr=((t*1.5+ring*0.14)%1);
      c.save(); c.globalAlpha=(1-pr)*0.35; c.strokeStyle='#7bdff2'; c.lineWidth=2;
      c.beginPath(); c.arc(W*0.5,H*0.5,pr*W*0.7,0,6.283); c.stroke(); c.restore();
    }
    drawKai(c, W*0.5, H*0.5 + t*H*0.3, 1.6, {});
  }},
  {dur:12, sub:'Un monde de vent. Des épées plantées à perte de vue, jusqu\u0027à l\u0027horizon.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#101828','#1c2c48'); c.fillRect(0,0,W,H);
    var horizon = H*0.62;
    c.fillStyle='#0a101c'; c.fillRect(0,horizon,W,H-horizon);
    for (var i=0;i<40;i++){
      var depth = i/40;
      var x = ((i*137)%W), s = 0.3+depth*1.4;
      var y = horizon + depth*H*0.35 - 6;
      c.save(); c.translate(x + Math.sin(t*2+i)*3, y); c.scale(s,s);
      c.strokeStyle='#cfd3d8'; c.lineWidth=2.5;
      c.beginPath(); c.moveTo(0,0); c.lineTo(0,-40); c.stroke();
      c.strokeStyle='#8d0801'; c.lineWidth=5;
      c.beginPath(); c.moveTo(0,0); c.lineTo(0,7); c.stroke();
      c.restore();
    }
  }},
  {dur:12, sub:'Au centre : un vieil homme assis sur la plus haute lame. L\u0027esprit de Kazehikari.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#101828','#1c2c48'); c.fillRect(0,0,W,H);
    var horizon = H*0.62; c.fillStyle='#0a101c'; c.fillRect(0,horizon,W,H-horizon);
    drawKai(c, W*0.3, H*0.72, 1.6, {sword:true});
    // esprit de la lame
    c.save(); c.globalAlpha=0.85+0.15*Math.sin(t*3);
    drawKai(c, W*0.68, H*0.5, 1.5, {hair:'#eef2f8', cloth:'#e8eef8', glow:'#7bdff2'});
    c.restore();
  }},
  {dur:12, sub:'« Sept ans tu m\u0027as brandi comme un outil. Jamais comme un compagnon. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#101828','#1c2c48'); c.fillRect(0,0,W,H);
    drawKai(c, W*0.3, H*0.72, 1.6, {sword:true});
    c.save(); c.globalAlpha=0.9;
    drawKai(c, W*0.68, H*0.5, 1.5, {hair:'#eef2f8', cloth:'#e8eef8', glow:'#7bdff2'});
    c.restore();
    for (var k=0;k<3;k++){
      var pr=((t*2+k*0.33)%1);
      c.save(); c.globalAlpha=(1-pr)*0.3; c.strokeStyle='#7bdff2'; c.lineWidth=2;
      c.beginPath(); c.arc(W*0.68,H*0.5,pr*W*0.4,0,6.283); c.stroke(); c.restore();
    }
  }},
  {dur:12, sub:'« Que crains-tu, Kaï ? » — « …de perdre encore quelqu\u0027un. » — « Alors perds ta peur, ou perds tout. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#101828','#182840'); c.fillRect(0,0,W,H);
    drawKai(c, W*0.35 + t*W*0.1, H*0.72, 1.6, {sword:true, glow: t>0.5 ? '#7bdff2' : null});
    drawKai(c, W*0.68 - t*W*0.05, H*0.5, 1.5, {hair:'#eef2f8', cloth:'#e8eef8', glow:'#7bdff2'});
    // vent qui s'intensifie
    for (var i=0;i<30;i++){
      c.save(); c.globalAlpha=0.4*t;
      c.strokeStyle='#7bdff2'; c.lineWidth=1;
      var x=(i*173+t*800)%W, y=(i*61)%H;
      c.beginPath(); c.moveTo(x,y); c.lineTo(x+60*t,y+4); c.stroke(); c.restore();
    }
  }}
],
/* ===== ACTE 6 — La libération (60 s) ===== */
[
  {dur:12, sub:'Le vent intérieur devient tempête. Kaï ouvre les yeux dans la rue dévastée.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#100818'); c.fillRect(0,0,W,H);
    for (var i=0;i<40;i++){
      c.save(); c.globalAlpha=0.5;
      c.strokeStyle='#7bdff2'; c.lineWidth=1.5;
      var x=(i*127+t*1000)%W, y=(i*71)%H;
      c.beginPath(); c.moveTo(x,y); c.lineTo(x+70,y+8); c.stroke(); c.restore();
    }
    drawKai(c, W*0.5, H*0.78, 1.7, {sword:true, glow:'#7bdff2'});
    citySilhouette(c,W,H,'#020208',1);
  }},
  {dur:12, sub:'Il lève la lame. Pour la première fois, il n\u0027a pas peur du silence.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#100818'); c.fillRect(0,0,W,H);
    drawKai(c, W*0.5, H*0.78, 1.7, {sword:true, swordAngle: -1.2, glow:'#7bdff2'});
    var g=c.createRadialGradient(W*0.5,H*0.5,0,W*0.5,H*0.5,W*0.6*Math.min(1,t*2));
    g.addColorStop(0,'rgba(123,223,242,0.35)'); g.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=g; c.fillRect(0,0,W,H);
    citySilhouette(c,W,H,'#020208',1);
  }},
  {dur:12, sub:'« Je sais ce que j\u0027ai à perdre. Et je choisis quand même de me lever. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#100818'); c.fillRect(0,0,W,H);
    drawKai(c, W*0.5, H*0.78, 1.8, {sword:true, swordAngle: -1.3, glow:'#7bdff2'});
    var g=c.createRadialGradient(W*0.5,H*0.45,0,W*0.5,H*0.45,W*0.7*Math.min(1,t*2.5));
    g.addColorStop(0,'rgba(123,223,242,0.5)'); g.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=g; c.fillRect(0,0,W,H);
  }},
  {dur:14, sub:'« Rugis… KAZEHARIKARI ! »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#100818'); c.fillRect(0,0,W,H);
    // explosion de vent
    var R = t * W * 1.2;
    for (var k=0;k<8;k++){
      var pr=(t*2+k*0.125)%1;
      c.save(); c.globalAlpha=(1-pr)*0.5; c.strokeStyle='#7bdff2'; c.lineWidth=10*(1-pr)+2;
      c.beginPath(); c.arc(W*0.5,H*0.7,pr*R,0,6.283); c.stroke(); c.restore();
    }
    drawKai(c, W*0.5, H*0.7, 2.0, {sword:true, swordAngle:-1.4, glow:'#bff4ff'});
    drawTitle(c,W,H,'KAZEHARIKARI','', Math.min(1,t*5)*Math.min(1,(1-t)*3+0.1));
  }},
  {dur:10, sub:'La lame s\u0027embrase d\u0027un vent bleu. Le Ryū des ténèbres tourne la tête.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#080410','#100818'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,0.3,'#4a1560',0.4);
    drawKai(c, W*0.25, H*0.7, 1.9, {sword:true, swordAngle:-1.2, glow:'#7bdff2'});
    var g=c.createRadialGradient(W*0.28,H*0.6,0,W*0.28,H*0.6,200+100*Math.sin(t*8));
    g.addColorStop(0,'rgba(123,223,242,0.55)'); g.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=g; c.fillRect(0,0,W,H);
  }}
],
/* ===== ACTE 7 — Le dernier souffle (60 s) ===== */
[
  {dur:14, sub:'Le duel final. Le vent bleu contre l\u0027ombre millénaire.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#0a0512','#140a20'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,0.6+t*2,'#4a1560',0.5);
    drawKai(c, W*0.2, H*0.72, 1.8, {sword:true, swordAngle:-1.1, glow:'#7bdff2'});
    // éclairs de choc
    if (Math.sin(t*30)>0.7){
      c.save(); c.strokeStyle='#fff'; c.lineWidth=2; c.globalAlpha=0.6;
      c.beginPath(); c.moveTo(W*0.5,H*0.2);
      for (var i=0;i<6;i++) c.lineTo(W*0.5+(Math.random()-0.5)*180, H*0.2+i*H*0.09);
      c.stroke(); c.restore();
    }
    citySilhouette(c,W,H,'#020208',1);
  }},
  {dur:14, sub:'« Tu voulais quelqu\u0027un capable de t\u0027arrêter, n\u0027est-ce pas ? … Alors je te libère. »', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#0a0512','#140a20'); c.fillRect(0,0,W,H);
    drawRyu(c,W,H,0.6+t,'#5a2060',0.3 - t*0.25);
    drawKai(c, W*0.3 + t*W*0.3, H*0.65 - Math.sin(t*Math.PI)*H*0.2, 1.8, {sword:true, swordAngle:-1.4, glow:'#7bdff2'});
  }},
  {dur:14, sub:'Le Getsuga du vent tranche la nuit. L\u0027ombre pousse un dernier rugissement — presque soulagé.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#0a0512','#140a20'); c.fillRect(0,0,W,H);
    // lame de vent géante
    c.save(); c.translate(W*0.4,H*0.55); c.rotate(-0.4 + t*0.2);
    var g=c.createLinearGradient(0,0,W*0.8,0);
    g.addColorStop(0,'rgba(123,223,242,0)'); g.addColorStop(0.5,'rgba(190,244,255,0.95)'); g.addColorStop(1,'rgba(123,223,242,0)');
    c.fillStyle=g;
    c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(W*0.4,-H*0.3,W*0.8,0); c.quadraticCurveTo(W*0.4,H*0.12,0,0); c.fill();
    c.restore();
    drawRyu(c,W,H,1+t*3,'#5a2060',Math.max(0, 0.2-t*0.18));
    drawKai(c, W*0.32, H*0.7, 1.8, {sword:true, swordAngle:-1.5, glow:'#bff4ff'});
  }},
  {dur:10, sub:'L\u0027ombre se dissout en mille lumières. Chaque lumière rend une âme à la ville.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#0a0818','#1a1430'); c.fillRect(0,0,W,H);
    for (var i=0;i<60;i++){
      var p=((t*0.8 + i*0.017)%1);
      var x=W*((i*0.137)%1), y=H*0.9-p*H*0.85;
      c.save(); c.globalAlpha=Math.sin(p*Math.PI)*0.8;
      c.fillStyle='#ffe9a0'; c.beginPath(); c.arc(x,y,2.5,0,6.283); c.fill(); c.restore();
    }
    citySilhouette(c,W,H,'#04040c',1);
    drawKai(c, W*0.5, H*0.8, 1.6, {sword:true, swordAngle:0.3});
  }},
  {dur:8, sub:'L\u0027aube se lève sur Karasuma. Personne ne saura jamais.', draw:function(t,c,W,H){
    c.fillStyle = skyGrad(c,W,H,'#2a2440','#e8a05c'); c.fillRect(0,0,W,H);
    // soleil
    var sy = H*(1.1 - t*0.35);
    var g=c.createRadialGradient(W*0.5,sy,0,W*0.5,sy,220);
    g.addColorStop(0,'rgba(255,220,140,0.95)'); g.addColorStop(1,'rgba(255,140,80,0)');
    c.fillStyle=g; c.fillRect(0,0,W,H);
    citySilhouette(c,W,H,'#180f1e',1);
    drawKai(c, W*0.78, H*0.66, 1.4, {backview:true, sword:true, swordAngle:0.2});
  }},
  {dur:0, sub:'', draw:null} // marqueur fin (ignoré)
]
];

// retirer le marqueur de fin
SCRIPT[SCRIPT.length-1] = SCRIPT[SCRIPT.length-1].slice(0,5);

/* ================= MOTEUR ================= */
var screen, sctx, playing = false, tStart = 0, tPaused = 0, TOTAL = 0;
var actStarts = [];
(function computeTimeline(){
  var acc = 0;
  SCRIPT.forEach(function(seqs, ai){
    actStarts.push(acc);
    seqs.forEach(function(s){ acc += s.dur; });
  });
  TOTAL = acc;
})();

function actIndexAt(time){
  for (var i = SCRIPT.length - 1; i >= 0; i--) if (time >= actStarts[i]) return i;
  return 0;
}
function seqAt(time){
  var ai = actIndexAt(time);
  var local = time - actStarts[ai];
  var seqs = SCRIPT[ai];
  var acc = 0;
  for (var i = 0; i < seqs.length; i++){
    if (local < acc + seqs[i].dur){
      return {act: ai, seq: i, t: (local - acc) / seqs[i].dur, sub: seqs[i].sub, draw: seqs[i].draw};
    }
    acc += seqs[i].dur;
  }
  var last = seqs[seqs.length-1];
  return {act: ai, seq: seqs.length-1, t: 1, sub: last.sub, draw: last.draw};
}

function fmt(s){
  var m = Math.floor(s/60), r = Math.floor(s%60);
  return m + ':' + (r<10?'0':'') + r;
}

function render(){
  if (!playing) return;
  var now = (performance.now() - tStart) / 1000 + tPaused;
  if (now >= TOTAL){ now = TOTAL; playing = false; playBtn.textContent = '▶ Revoir'; }
  var info = seqAt(now);
  var W = screen.width, H = screen.height;
  if (info.draw) info.draw(info.t, sctx, W, H);
  else { sctx.fillStyle = '#000'; sctx.fillRect(0,0,W,H); }
  // sous-titre
  var subEl = document.getElementById('subtitle');
  subEl.innerHTML = info.sub ? '<span>' + info.sub + '</span>' : '';
  // badge acte (transition)
  var badge = document.getElementById('act-badge');
  var actName = 'Acte ' + (info.act+1) + ' — ' + ACTS[info.act].t;
  if (badge.textContent !== actName){
    badge.textContent = actName;
    badge.classList.add('show');
    setTimeout(function(){ badge.classList.remove('show'); }, 3500);
  }
  // progression
  var fill = document.getElementById('progress-fill');
  var cursor = document.getElementById('progress-cursor');
  fill.style.width = (now / TOTAL * 100) + '%';
  cursor.style.left = (now / TOTAL * 100) + '%';
  document.getElementById('time-display').textContent = fmt(now) + ' / ' + fmt(TOTAL);
  if (playing) requestAnimationFrame(render);
  else if (now >= TOTAL) endFade(now);
}
function endFade(now){
  var W = screen.width, H = screen.height;
  var info = seqAt(now);
  if (info.draw) info.draw(1, sctx, W, H);
  drawTitle(sctx, W, H, 'FIN', 'Le Dernier Ryū — 2026', 1);
}

var playBtn = document.getElementById('play-btn');
playBtn.addEventListener('click', function(){
  var now = playing ? tPaused + (performance.now() - tStart)/1000 : 0;
  if (playing){
    tPaused = now; playing = false;
    playBtn.textContent = '▶ Reprendre';
  } else {
    if (nowPausedAtEnd()) { tPaused = 0; resetProgress(); }
    tStart = performance.now(); playing = true;
    playBtn.textContent = '❚❚ Pause';
    requestAnimationFrame(render);
  }
});
function nowPausedAtEnd(){ return document.getElementById('time-display').textContent.indexOf(fmt(TOTAL)) === 0; }
function resetProgress(){ tPaused = 0; }

document.getElementById('restart-btn').addEventListener('click', function(){
  playing = false; tPaused = 0; tStart = performance.now();
  playing = true; playBtn.textContent = '❚❚ Pause';
  requestAnimationFrame(render);
});

document.getElementById('progress').addEventListener('click', function(e){
  var r = this.getBoundingClientRect();
  var ratio = (e.clientX - r.left) / r.width;
  tPaused = ratio * TOTAL;
  tStart = performance.now();
  if (!playing){ playing = true; playBtn.textContent = '❚❚ Pause'; }
  requestAnimationFrame(render);
});

function buildActList(){
  var list = document.getElementById('act-list');
  ACTS.forEach(function(a){
    var row = document.createElement('div');
    row.className = 'act-row';
    row.innerHTML = '<span class="num">I'.repeat(0) + a.n + '</span><div><span class="t">' + a.t + '</span><span class="d">' + a.d + '</span></div><span class="dur">' + a.dur + ' s</span>';
    list.appendChild(row);
  });
}

function initAmbient(){
  var c = document.getElementById('bg-ambient');
  c.width = innerWidth; c.height = innerHeight;
  var x = c.getContext('2d');
  (function loop(){
    x.clearRect(0,0,c.width,c.height);
    var g = x.createRadialGradient(c.width*0.5, c.height*0.3, 0, c.width*0.5, c.height*0.3, c.width*0.7);
    g.addColorStop(0, 'rgba(20,26,60,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0,0,c.width,c.height);
    requestAnimationFrame(loop);
  })();
}

/* init */
screen = document.getElementById('screen');
sctx = screen.getContext('2d');
buildActList();
initAmbient();
// image d'ouverture (première frame figée)
(function preview(){
  var info = seqAt(0);
  info.draw(0, sctx, screen.width, screen.height);
  drawTitle(sctx, screen.width, screen.height, 'LE DERNIER RYŪ', 'un court-métrage original — 7 minutes', 1);
  document.getElementById('time-display').textContent = '0:00 / ' + fmt(TOTAL);
})();
setTimeout(function(){ document.getElementById('loader').classList.add('hidden'); }, 600);

var io = new IntersectionObserver(function(es){
  es.forEach(function(e){ if (e.isIntersecting) e.target.classList.add('in'); });
}, {threshold: 0.15});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
