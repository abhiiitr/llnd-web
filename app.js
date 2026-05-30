/* =========================================================
   Laboratory of Lipids and Neurological Diseases
   Animations + interactions + tweaks
   ========================================================= */

/* ----- Nav scroll state ----- */
const nav = document.querySelector('.nav');
const onScroll = () => {
  if (window.scrollY > 24) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ----- Mobile burger ----- */
const burger = document.querySelector('.nav-burger');
if (burger) {
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* ----- Intersection reveal ----- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ----- Smooth scroll for nav anchors (fallback for older browsers) ----- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

/* =========================================================
   Animated phospholipid bilayer (hero SVG)
   ========================================================= */
function buildBilayer() {
  const svg = document.getElementById('bilayer');
  if (!svg) return;
  const W = 560, H = 560;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // The bilayer is a curved double row of phospholipids arranged on a circle.
  // We'll draw two concentric arcs of phospholipids that animate.

  const cx = W / 2, cy = H / 2;
  const outerR = 200;
  const innerR = 156;
  const tailLen = 16;
  const headR = 7;
  const count = 56;

  const ns = 'http://www.w3.org/2000/svg';

  // Background subtle radial ring
  const ring = document.createElementNS(ns, 'circle');
  ring.setAttribute('cx', cx);
  ring.setAttribute('cy', cy);
  ring.setAttribute('r', (outerR + innerR) / 2);
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', 'rgba(127, 217, 106, 0.05)');
  ring.setAttribute('stroke-width', (outerR - innerR));
  svg.appendChild(ring);

  // Group for outer leaflet (heads pointing outward, tails inward)
  const gOuter = document.createElementNS(ns, 'g');
  gOuter.setAttribute('class', 'leaflet outer');
  svg.appendChild(gOuter);
  const gInner = document.createElementNS(ns, 'g');
  gInner.setAttribute('class', 'leaflet inner');
  svg.appendChild(gInner);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const sin = Math.sin(angle), cos = Math.cos(angle);

    // Outer leaflet phospholipid
    const oHeadX = cx + cos * outerR;
    const oHeadY = cy + sin * outerR;
    const oTailX = cx + cos * (outerR - tailLen);
    const oTailY = cy + sin * (outerR - tailLen);

    const oTail1 = makeTail(ns, oHeadX, oHeadY, oTailX, oTailY, -3, angle);
    const oTail2 = makeTail(ns, oHeadX, oHeadY, oTailX, oTailY, 3, angle);
    gOuter.appendChild(oTail1);
    gOuter.appendChild(oTail2);

    const oHead = document.createElementNS(ns, 'circle');
    oHead.setAttribute('cx', oHeadX);
    oHead.setAttribute('cy', oHeadY);
    oHead.setAttribute('r', headR);
    oHead.setAttribute('class', 'head head-outer');
    oHead.setAttribute('data-angle', angle);
    oHead.setAttribute('data-idx', i);
    gOuter.appendChild(oHead);

    // Inner leaflet phospholipid (heads pointing inward)
    const iHeadX = cx + cos * innerR;
    const iHeadY = cy + sin * innerR;
    const iTailX = cx + cos * (innerR + tailLen);
    const iTailY = cy + sin * (innerR + tailLen);

    const iTail1 = makeTail(ns, iHeadX, iHeadY, iTailX, iTailY, -3, angle);
    const iTail2 = makeTail(ns, iHeadX, iHeadY, iTailX, iTailY, 3, angle);
    gInner.appendChild(iTail1);
    gInner.appendChild(iTail2);

    const iHead = document.createElementNS(ns, 'circle');
    iHead.setAttribute('cx', iHeadX);
    iHead.setAttribute('cy', iHeadY);
    iHead.setAttribute('r', headR);
    iHead.setAttribute('class', 'head head-inner');
    iHead.setAttribute('data-angle', angle);
    iHead.setAttribute('data-idx', i);
    gInner.appendChild(iHead);
  }

  // Cholesterol-like molecule wandering inside the bilayer
  for (let k = 0; k < 4; k++) {
    const mol = document.createElementNS(ns, 'g');
    mol.setAttribute('class', `embedded-mol mol-${k}`);
    const angle = (k / 4) * Math.PI * 2 + 0.2;
    const r = (outerR + innerR) / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    mol.setAttribute('transform', `translate(${x}, ${y})`);

    const hex = document.createElementNS(ns, 'polygon');
    const pts = [];
    for (let p = 0; p < 6; p++) {
      const a = (p / 6) * Math.PI * 2;
      pts.push(`${Math.cos(a) * 8},${Math.sin(a) * 8}`);
    }
    hex.setAttribute('points', pts.join(' '));
    hex.setAttribute('fill', 'none');
    hex.setAttribute('stroke', 'rgba(244, 168, 44, 0.7)');
    hex.setAttribute('stroke-width', '1.5');
    mol.appendChild(hex);
    svg.appendChild(mol);
  }

  // Central nucleus / brain motif
  const core = document.createElementNS(ns, 'g');
  core.setAttribute('class', 'core');
  core.setAttribute('transform', `translate(${cx},${cy})`);
  // brain-like blob
  const blob = document.createElementNS(ns, 'circle');
  blob.setAttribute('r', 64);
  blob.setAttribute('fill', 'url(#coreGrad)');
  blob.setAttribute('opacity', '0.95');
  core.appendChild(blob);
  // inner glow rings
  for (let i = 0; i < 3; i++) {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('r', 64 - i * 10);
    c.setAttribute('fill', 'none');
    c.setAttribute('stroke', 'rgba(127,217,106,0.15)');
    c.setAttribute('stroke-width', '0.6');
    core.appendChild(c);
  }
  // pulse dot
  const dot = document.createElementNS(ns, 'circle');
  dot.setAttribute('r', 4);
  dot.setAttribute('fill', '#7FD96A');
  dot.setAttribute('class', 'core-dot');
  core.appendChild(dot);

  svg.appendChild(core);

  // Defs (gradient)
  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML = `
    <radialGradient id="coreGrad" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="rgba(127, 217, 106, 0.25)"/>
      <stop offset="40%" stop-color="rgba(127, 217, 106, 0.08)"/>
      <stop offset="100%" stop-color="rgba(6, 8, 12, 0)"/>
    </radialGradient>
    <radialGradient id="headGrad" cx="0.3" cy="0.3" r="0.7">
      <stop offset="0%" stop-color="#a0e890"/>
      <stop offset="100%" stop-color="#5fb44d"/>
    </radialGradient>
  `;
  svg.insertBefore(defs, svg.firstChild);

  animateBilayer(svg, { cx, cy, outerR, innerR, count, tailLen });
}

function makeTail(ns, hx, hy, tx, ty, perpOffset, angle) {
  // Perpendicular offset for two tails
  const px = -Math.sin(angle) * perpOffset;
  const py = Math.cos(angle) * perpOffset;
  const path = document.createElementNS(ns, 'path');
  // Wavy zigzag tail using cubic
  const midX1 = hx + (tx - hx) * 0.4 + px * 0.6;
  const midY1 = hy + (ty - hy) * 0.4 + py * 0.6;
  const midX2 = hx + (tx - hx) * 0.7 - px * 0.6;
  const midY2 = hy + (ty - hy) * 0.7 - py * 0.6;
  const endX = tx + px;
  const endY = ty + py;
  path.setAttribute('d', `M${hx},${hy} C${midX1},${midY1} ${midX2},${midY2} ${endX},${endY}`);
  path.setAttribute('stroke', 'rgba(236, 232, 222, 0.35)');
  path.setAttribute('stroke-width', '1.2');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('class', 'tail');
  return path;
}

function animateBilayer(svg, conf) {
  const heads = svg.querySelectorAll('.head');
  const tails = svg.querySelectorAll('.tail');
  const mols = svg.querySelectorAll('.embedded-mol');
  const coreDot = svg.querySelector('.core-dot');

  const startTime = performance.now();
  let rafId;

  function tick(t) {
    const elapsed = (t - startTime) / 1000;
    const motion = document.documentElement.getAttribute('data-motion') || 'moderate';
    const amp = motion === 'off' ? 0 : motion === 'subtle' ? 0.6 : motion === 'bold' ? 1.4 : 1.0;

    heads.forEach((h) => {
      const angle = parseFloat(h.dataset.angle);
      const idx = parseInt(h.dataset.idx);
      const isOuter = h.classList.contains('head-outer');
      const baseR = isOuter ? conf.outerR : conf.innerR;
      const phase = elapsed * 0.6 + idx * 0.3;
      const wobble = Math.sin(phase) * 3 * amp;
      const r = baseR + (isOuter ? wobble : -wobble);
      const x = conf.cx + Math.cos(angle) * r;
      const y = conf.cy + Math.sin(angle) * r;
      h.setAttribute('cx', x);
      h.setAttribute('cy', y);
      // Color pulse
      const pulse = (Math.sin(phase * 0.7) + 1) * 0.5;
      const colors = isOuter
        ? ['#7FD96A', '#5fb44d']
        : ['#F4A82C', '#d68812'];
      h.setAttribute('fill', `url(#headGrad)`);
      h.setAttribute('opacity', 0.7 + pulse * 0.3);
    });

    // Wiggle embedded molecules
    mols.forEach((m, k) => {
      const angle = (k / 4) * Math.PI * 2 + 0.2 + elapsed * 0.15 * amp;
      const r = (conf.outerR + conf.innerR) / 2 + Math.sin(elapsed * 0.5 + k) * 2 * amp;
      const x = conf.cx + Math.cos(angle) * r;
      const y = conf.cy + Math.sin(angle) * r;
      m.setAttribute('transform', `translate(${x}, ${y}) rotate(${elapsed * 30 * amp})`);
    });

    // Core pulse
    if (coreDot) {
      const pulseR = 4 + Math.sin(elapsed * 1.5) * 1.5 * amp;
      coreDot.setAttribute('r', pulseR);
      const o = 0.6 + Math.sin(elapsed * 1.5) * 0.4;
      coreDot.setAttribute('opacity', o);
    }

    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}

buildBilayer();

/* =========================================================
   Floating molecular particles (canvas background)
   ========================================================= */
(function particles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dpr;
  const colors = ['#7FD96A', '#F4A82C', '#C084FC', '#67E8F9'];
  let nodes = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Adjust node count to screen size
    const target = Math.min(38, Math.floor((W * H) / 60000));
    while (nodes.length < target) nodes.push(makeNode());
    nodes = nodes.slice(0, target);
  }
  function makeNode() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.8 + 0.5,
      c: colors[Math.floor(Math.random() * colors.length)],
      o: Math.random() * 0.4 + 0.2,
    };
  }
  resize();
  window.addEventListener('resize', resize);

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    // connect nearby
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(127, 217, 106, ${0.06 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;
      ctx.fillStyle = n.c;
      ctx.globalAlpha = n.o;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(loop);
  }
  loop();
})();

/* =========================================================
   Tweaks panel
   ========================================================= */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "green",
  "motion": "moderate",
  "display": "serif"
}/*EDITMODE-END*/;

let tweaks = { ...TWEAK_DEFAULTS };

function applyTweaks() {
  document.documentElement.setAttribute('data-accent', tweaks.accent);
  document.documentElement.setAttribute('data-motion', tweaks.motion);
  document.documentElement.setAttribute('data-display', tweaks.display);
  // Sync active states
  document.querySelectorAll('.tweak-row [data-key]').forEach(b => {
    const key = b.dataset.key, val = b.dataset.val;
    if (tweaks[key] === val) b.classList.add('active'); else b.classList.remove('active');
  });
}

function setTweak(key, val) {
  tweaks[key] = val;
  applyTweaks();
  try {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  } catch (e) {}
}

const tweaksEl = document.querySelector('.tweaks');
const tweaksClose = document.querySelector('.tweaks .close');
function openTweaks() { tweaksEl.classList.add('open'); }
function closeTweaks() {
  tweaksEl.classList.remove('open');
  try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
}
tweaksClose && tweaksClose.addEventListener('click', closeTweaks);

document.querySelectorAll('.tweak-row [data-key]').forEach(b => {
  b.addEventListener('click', () => setTweak(b.dataset.key, b.dataset.val));
});

// Edit mode protocol — register listener BEFORE announcing availability
window.addEventListener('message', (e) => {
  const d = e.data;
  if (!d || typeof d !== 'object') return;
  if (d.type === '__activate_edit_mode') openTweaks();
  if (d.type === '__deactivate_edit_mode') closeTweaks();
});
try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

applyTweaks();
