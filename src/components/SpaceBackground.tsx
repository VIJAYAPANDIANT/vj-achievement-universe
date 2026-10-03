import React, { useEffect, useRef } from 'react';

// ─── Type Definitions ──────────────────────────────────────────────────────────

interface Star {
  x: number; y: number; size: number;
  baseAlpha: number; alpha: number;
  twinkleSpeed: number; color: string;
  parallax: number;
  isSuperGiant?: boolean;
  flareAngle?: number;
}

interface ShootingStar {
  x: number; y: number;
  vx: number; vy: number;
  length: number; alpha: number;
  life: number; maxLife: number;
  color: string;
}

interface Asteroid {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; rotation: number;
  rotSpeed: number; alpha: number;
  vertices: { x: number; y: number }[];
  color: string; glowColor: string;
  parallax: number;
}

interface FireParticle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  r: number; g: number; b: number;
}

interface Comet {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  particles: FireParticle[];
  color: string;
  type: 'fire' | 'plasma';
  life: number; maxLife: number;
}

interface ExhaustParticle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}

interface Rocket {
  x: number; y: number;
  vx: number; vy: number;
  angle: number; scale: number;
  exhaust: ExhaustParticle[];
  life: number; maxLife: number;
  color: string;
}

interface DustParticle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  parallax: number;
}

// ─── Helper Functions ──────────────────────────────────────────────────────────

function makeAsteroidVertices(radius: number, count = 8): { x: number; y: number }[] {
  const verts: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = radius * (0.65 + Math.random() * 0.5);
    verts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  return verts;
}

function makeComet(width: number, height: number): Comet {
  // Comets spawn from edges going inward
  const side = Math.floor(Math.random() * 2); // top or left
  const speed = 1.8 + Math.random() * 3.5;
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.6;
  let x = 0, y = 0;
  if (side === 0) { x = Math.random() * width; y = -20; }
  else { x = -20; y = Math.random() * height * 0.6; }

  const isPlasma = Math.random() > 0.5;
  const color = isPlasma 
    ? (Math.random() > 0.5 ? '#06b6d4' : '#d946ef') 
    : (Math.random() > 0.5 ? '#f97316' : '#fbbf24');

  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 4 + Math.random() * 7,
    particles: [],
    color,
    type: isPlasma ? 'plasma' : 'fire',
    life: 0,
    maxLife: 220 + Math.random() * 220,
  };
}

function makeRocket(width: number, height: number): Rocket {
  const fromLeft = Math.random() > 0.3;
  const y = 60 + Math.random() * height * 0.7;
  const speed = 1.5 + Math.random() * 2.2;
  const colors = ['#06b6d4', '#8b5cf6', '#d946ef', '#eab308'];
  return {
    x: fromLeft ? -60 : width + 60,
    y,
    vx: fromLeft ? speed : -speed,
    vy: (Math.random() - 0.5) * 0.3,
    angle: fromLeft ? 0 : Math.PI,
    scale: 0.55 + Math.random() * 0.75,
    exhaust: [],
    life: 0,
    maxLife: 350 + Math.random() * 200,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

function makeShootingStar(width: number, height: number): ShootingStar {
  const x = Math.random() * width * 1.2;
  const y = Math.random() * height * 0.5;
  const speed = 11 + Math.random() * 16;
  const angle = Math.PI * 0.12 + (Math.random() - 0.5) * 0.2;
  const colors = ['#ffffff', '#06b6d4', '#d946ef', '#fbbf24'];
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    length: 70 + Math.random() * 130,
    alpha: 1,
    life: 0,
    maxLife: 40 + Math.random() * 30,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
}

// ─── Main Component ────────────────────────────────────────────────────────────

export const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let frame = 0;

    // ── Spawn Stars ──────────────────────────────────────────────────────────
    const STAR_COLORS = ['#e2e8f0', '#06b6d4', '#8b5cf6', '#d946ef', '#f0abfc', '#7dd3fc'];
    const starCount = Math.min(Math.floor((width * height) / 11000), 120);
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      const baseAlpha = Math.random() * 0.7 + 0.1;
      const isSuperGiant = Math.random() > 0.95; // 5% chance
      stars.push({
        x: Math.random() * width, y: Math.random() * height,
        size: isSuperGiant ? Math.random() * 2.5 + 2.2 : Math.random() * 1.8 + 0.3,
        baseAlpha, alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.04 + 0.005,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        parallax: Math.random() * 0.06 + 0.005,
        isSuperGiant,
        flareAngle: Math.random() * Math.PI,
      });
    }

    // ── Spawn Cosmic Nebula Dust drifts ──────────────────────────────────────
    const dustParticles: DustParticle[] = [];
    const DUST_COLORS = [
      'rgba(6, 182, 212, 0.07)', 
      'rgba(139, 92, 246, 0.06)', 
      'rgba(217, 70, 239, 0.06)'
    ];
    for (let i = 0; i < 10; i++) {
      const baseAlpha = Math.random() * 0.3 + 0.15;
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: 40 + Math.random() * 80,
        color: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
        alpha: baseAlpha,
        baseAlpha,
        parallax: Math.random() * 0.08 + 0.02,
      });
    }

    // ── Spawn Asteroids ──────────────────────────────────────────────────────
    const asteroids: Asteroid[] = [];
    const ASTEROID_COLORS = [
      { c: '#4c1d95', g: 'rgba(139,92,246,0.35)' },
      { c: '#1e3a5f', g: 'rgba(6,182,212,0.25)' },
      { c: '#2d1a4a', g: 'rgba(217,70,239,0.25)' },
    ];
    for (let i = 0; i < 6; i++) {
      const r = 6 + Math.random() * 20;
      const ac = ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)];
      const parallax = 0.3 + (r / 20) * 0.9;
      asteroids.push({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6 * parallax,
        vy: (Math.random() - 0.5) * 0.6 * parallax,
        radius: r, rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        alpha: 0.45 + (r / 20) * 0.55,
        vertices: makeAsteroidVertices(r),
        color: ac.c, glowColor: ac.g,
        parallax,
      });
    }

    // ── Live Comets & Rockets & Shooting Stars ───────────────────────────────
    const comets: Comet[] = [];
    const rockets: Rocket[] = [];
    const shootingStars: ShootingStar[] = [];

    // ── Resize & Mouse handlers ──────────────────────────────────────────────
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.04;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.04;
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // ── Draw Rocket (Vector) ─────────────────────────────────────────────────
    const drawRocket = (rocket: Rocket) => {
      const { x, y, angle, scale, color } = rocket;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.globalAlpha = Math.min(1, (rocket.life / 20)) * Math.min(1, (rocket.maxLife - rocket.life) / 20);

      // Body
      ctx.fillStyle = color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-14, -7);
      ctx.lineTo(-18, 0);
      ctx.lineTo(-14, 7);
      ctx.closePath();
      ctx.fill();

      // Nose Cone
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(10, -4);
      ctx.lineTo(10, 4);
      ctx.closePath();
      ctx.fill();

      // Wings
      ctx.fillStyle = color;
      ctx.globalAlpha *= 0.8;
      // Top wing
      ctx.beginPath();
      ctx.moveTo(-8, -7);
      ctx.lineTo(-18, -18);
      ctx.lineTo(-18, -7);
      ctx.closePath();
      ctx.fill();
      // Bottom wing
      ctx.beginPath();
      ctx.moveTo(-8, 7);
      ctx.lineTo(-18, 18);
      ctx.lineTo(-18, 7);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // ── Draw Comet Head ──────────────────────────────────────────────────────
    const drawCometHead = (comet: Comet) => {
      const grd = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, comet.radius * 2.5);
      grd.addColorStop(0, '#ffffff');
      grd.addColorStop(0.3, comet.color);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.shadowBlur = 18;
      ctx.shadowColor = comet.color;
      ctx.globalAlpha = Math.min(1, comet.life / 20) * Math.min(1, (comet.maxLife - comet.life) / 30);
      ctx.beginPath();
      ctx.arc(comet.x, comet.y, comet.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    // ─── MAIN RENDER LOOP ───────────────────────────────────────────────────
    const render = () => {
      if (width <= 0 || height <= 0) {
        animId = requestAnimationFrame(render);
        return;
      }
      frame++;
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Clear with space-black
      ctx.fillStyle = '#030014';
      ctx.fillRect(0, 0, width, height);

      // Deep space nebula gradient (subtle)
      const nebula = ctx.createRadialGradient(
        width * 0.3 + mouse.x, height * 0.4 + mouse.y, 20,
        width * 0.3 + mouse.x, height * 0.4 + mouse.y, width * 0.65
      );
      nebula.addColorStop(0, 'rgba(40, 10, 80, 0.18)');
      nebula.addColorStop(0.5, 'rgba(10, 5, 40, 0.08)');
      nebula.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      // Second nebula blob
      const nebula2 = ctx.createRadialGradient(
        width * 0.75 + mouse.x * 0.5, height * 0.65 + mouse.y * 0.5, 10,
        width * 0.75 + mouse.x * 0.5, height * 0.65 + mouse.y * 0.5, width * 0.4
      );
      nebula2.addColorStop(0, 'rgba(6, 50, 80, 0.14)');
      nebula2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // ── STARS ────────────────────────────────────────────────────────────
      stars.forEach((star) => {
        const sx = star.x - mouse.x * star.parallax * 20;
        const sy = star.y - mouse.y * star.parallax * 20;
        const wrappedX = ((sx % width) + width) % width;
        const wrappedY = ((sy % height) + height) % height;

        star.alpha = star.baseAlpha + Math.sin(frame * star.twinkleSpeed) * 0.25;
        star.alpha = Math.max(0.05, Math.min(1, star.alpha));

        ctx.globalAlpha = star.alpha;
        ctx.shadowBlur = star.size > 1.2 ? 5 : 0;
        ctx.shadowColor = star.color;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(wrappedX, wrappedY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Super giant glowing stars with cross flares
        if (star.isSuperGiant) {
          ctx.save();
          ctx.translate(wrappedX, wrappedY);
          ctx.rotate(star.flareAngle || 0);
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = star.alpha * 0.4;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(-star.size * 2.5, 0); ctx.lineTo(star.size * 2.5, 0);
          ctx.moveTo(0, -star.size * 2.5); ctx.lineTo(0, star.size * 2.5);
          ctx.stroke();
          ctx.restore();
        }
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // ── COSMIC DUST DRIFTS ───────────────────────────────────────────────
      dustParticles.forEach((dust) => {
        dust.x += dust.vx;
        dust.y += dust.vy;

        const dx = dust.x - mouse.x * dust.parallax * 15;
        const dy = dust.y - mouse.y * dust.parallax * 15;

        const wrappedX = ((dx + dust.size) % (width + dust.size * 2) + (width + dust.size * 2)) % (width + dust.size * 2) - dust.size;
        const wrappedY = ((dy + dust.size) % (height + dust.size * 2) + (height + dust.size * 2)) % (height + dust.size * 2) - dust.size;

        const pulse = Math.sin(frame * 0.005 + dust.size) * 0.08;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, dust.baseAlpha + pulse));

        const grd = ctx.createRadialGradient(wrappedX, wrappedY, 0, wrappedX, wrappedY, dust.size);
        grd.addColorStop(0, dust.color);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(wrappedX, wrappedY, dust.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // ── GRID LAYER (subtle) ──────────────────────────────────────────────
      ctx.strokeStyle = 'rgba(6,182,212,0.012)';
      ctx.lineWidth = 1;
      const gs = 80;
      const gsx = ((-mouse.x * 0.15) % gs + gs) % gs;
      const gsy = ((-mouse.y * 0.15) % gs + gs) % gs;
      for (let gx = gsx - gs; gx < width + gs; gx += gs) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke();
      }
      for (let gy = gsy - gs; gy < height + gs; gy += gs) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke();
      }

      // ── ASTEROIDS ────────────────────────────────────────────────────────
      asteroids.forEach((ast) => {
        ast.x += ast.vx;
        ast.y += ast.vy;
        ast.rotation += ast.rotSpeed;

        const ax = ast.x - mouse.x * ast.parallax * 8;
        const ay = ast.y - mouse.y * ast.parallax * 8;

        const wrappedX = ((ax + 40) % (width + 80) + (width + 80)) % (width + 80) - 40;
        const wrappedY = ((ay + 40) % (height + 80) + (height + 80)) % (height + 80) - 40;

        // Wrap actual coordinates to stay within sandbox limits
        if (ast.x < -40) ast.x = width + 40;
        if (ast.x > width + 40) ast.x = -40;
        if (ast.y < -40) ast.y = height + 40;
        if (ast.y > height + 40) ast.y = -40;

        ctx.save();
        ctx.translate(wrappedX, wrappedY);
        ctx.rotate(ast.rotation);
        ctx.globalAlpha = ast.alpha;

        ctx.shadowBlur = 10;
        ctx.shadowColor = ast.glowColor;

        ctx.fillStyle = ast.color;
        ctx.strokeStyle = ast.glowColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const v = ast.vertices;
        ctx.moveTo(v[0].x, v[0].y);
        for (let i = 1; i < v.length; i++) ctx.lineTo(v[i].x, v[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      // ── SHOOTING STARS ───────────────────────────────────────────────────
      // Spawn less frequently: every 80 frames, 30% chance
      if (frame % 80 === 0 && Math.random() > 0.7) {
        const spawnCount = 1;
        for (let s = 0; s < spawnCount; s++) {
          shootingStars.push(makeShootingStar(width, height));
        }
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;
        ss.alpha = 1 - ss.life / ss.maxLife;

        if (ss.life >= ss.maxLife) { shootingStars.splice(i, 1); continue; }

        const tx = ss.x - (ss.vx / Math.hypot(ss.vx, ss.vy)) * ss.length;
        const ty = ss.y - (ss.vy / Math.hypot(ss.vx, ss.vy)) * ss.length;

        const grad = ctx.createLinearGradient(tx, ty, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, ss.color);

        ctx.globalAlpha = ss.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ss.color;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = ss.alpha * 0.9;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // ── COMETS / FIREBALLS ───────────────────────────────────────────────
      // Spawn less frequently (every 220 frames) and allow up to 1 comet at a time
      if (frame % 220 === 0 && comets.length < 1) {
        comets.push(makeComet(width, height));
      }

      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx;
        c.y += c.vy;
        c.life++;

        if (c.life >= c.maxLife || c.x > width + 50 || c.y > height + 50) {
          comets.splice(i, 1); continue;
        }

        // Emit fewer particle tails (1 particle per frame)
        const particleCount = 1;
        for (let p = 0; p < particleCount; p++) {
          let r = 255, g = 100, b = 20;
          if (c.type === 'plasma') {
            if (c.color === '#06b6d4') {
              r = Math.floor(20 + Math.random() * 50);
              g = Math.floor(180 + Math.random() * 75);
              b = 255;
            } else {
              r = 217;
              g = Math.floor(70 + Math.random() * 80);
              b = 239;
            }
          } else {
            r = 255;
            g = Math.floor(100 + Math.random() * 120);
            b = Math.floor(Math.random() * 40);
          }

          c.particles.push({
            x: c.x + (Math.random() - 0.5) * 4,
            y: c.y + (Math.random() - 0.5) * 4,
            vx: -c.vx * 0.35 + (Math.random() - 0.5) * 1.2,
            vy: -c.vy * 0.35 + (Math.random() - 0.5) * 1.2,
            life: 0,
            maxLife: 30 + Math.floor(Math.random() * 25),
            size: 2 + Math.random() * 5,
            r, g, b,
          });
        }

        // Update and draw fire particles
        for (let pi = c.particles.length - 1; pi >= 0; pi--) {
          const p = c.particles[pi];
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          const t = p.life / p.maxLife;
          const r = Math.floor(p.r);
          const g = Math.floor(p.g * (1 - t));
          const b = Math.floor(p.b + t * 100);
          const a = 1 - t;
          const size = p.size * (1 - t * 0.7);

          ctx.globalAlpha = a * 0.85;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgb(${r},${g},${b})`;
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();

          if (p.life >= p.maxLife) c.particles.splice(pi, 1);
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        drawCometHead(c);
      }

      // ── ROCKETS ──────────────────────────────────────────────────────────
      // Spawn less frequently (every 400 frames) and allow up to 1 rocket at a time
      if (frame % 400 === 0 && rockets.length < 1) {
        rockets.push(makeRocket(width, height));
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.life++;

        if (r.life >= r.maxLife) { rockets.splice(i, 1); continue; }

        // Emit fewer exhaust particles with smooth plume velocity
        const exhaustAngle = r.angle + Math.PI;
        const eCount = r.scale > 0.9 ? 2 : 1;
        for (let e = 0; e < eCount; e++) {
          r.exhaust.push({
            x: r.x + Math.cos(exhaustAngle) * 18 * r.scale + (Math.random() - 0.5) * 3,
            y: r.y + Math.sin(exhaustAngle) * 18 * r.scale + (Math.random() - 0.5) * 3,
            vx: Math.cos(exhaustAngle) * (1.2 + Math.random() * 2.0) + (Math.random() - 0.5) * 0.4,
            vy: Math.sin(exhaustAngle) * (1.2 + Math.random() * 2.0) + (Math.random() - 0.5) * 0.4,
            life: 0,
            maxLife: 25 + Math.floor(Math.random() * 30),
            size: 2.5 + Math.random() * 4,
          });
        }

        // Draw exhaust
        for (let ei = r.exhaust.length - 1; ei >= 0; ei--) {
          const ep = r.exhaust[ei];
          ep.x += ep.vx; ep.y += ep.vy; ep.life++;
          const t = ep.life / ep.maxLife;
          const a = (1 - t) * 0.8;
          const size = ep.size * (1 - t * 0.6);
          
          let rc = 255, gc = 255, bc = 255;
          if (r.color === '#06b6d4') {
            rc = Math.floor(255 * (1 - t));
            gc = Math.floor(200 + t * 55);
            bc = 255;
          } else if (r.color === '#8b5cf6') {
            rc = Math.floor(139 + t * 116);
            gc = Math.floor(92 * (1 - t));
            bc = 255;
          } else if (r.color === '#d946ef') {
            rc = 217;
            gc = Math.floor(70 * (1 - t));
            bc = 239;
          } else {
            rc = 234;
            gc = Math.floor(179 * (1 - t));
            bc = 8;
          }
          
          ctx.globalAlpha = a;
          ctx.fillStyle = `rgb(${rc},${gc},${bc})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = r.color;
          ctx.beginPath();
          ctx.arc(ep.x, ep.y, size, 0, Math.PI * 2);
          ctx.fill();
          if (ep.life >= ep.maxLife) r.exhaust.splice(ei, 1);
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        drawRocket(r);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        pointerEvents: 'none',
      }}
    />
  );
};
