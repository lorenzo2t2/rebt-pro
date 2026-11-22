/* Efectos visuales: hélice trifásica 3D (canvas) e inclinación 3D de tarjetas. Sin dependencias. */
(function () {
  'use strict';
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* ---------- Hélice trifásica ---------- */
  let raf = 0;
  function mount(c) {
    cancelAnimationFrame(raf);
    if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const fit = () => { const r = c.getBoundingClientRect(); W = r.width; H = r.height; c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    fit();
    const COL = [[56, 214, 255], [96, 142, 255], [167, 139, 250]];
    const N = 120, TURNS = 2.6, A = 0.62, L = 1.7;
    let t0 = performance.now(), last = 0;
    function pt(k, u, ang, tilt) {
      const x = (u - 0.5) * 2 * L, ph = u * TURNS * Math.PI * 2 + k * 2 * Math.PI / 3 + ang * 2.2;
      let y = Math.cos(ph) * A, z = Math.sin(ph) * A;
      const ca = Math.cos(ang * 0.35), sa = Math.sin(ang * 0.35);
      let X = x * ca + z * sa, Z = -x * sa + z * ca;
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const Y = y * ct - Z * st; Z = y * st + Z * ct;
      const d = 3.2, s = d / (d + Z) * Math.min(W / (L * 2.5), H / 1.9);
      return [W / 2 + X * s, H / 2 + Y * s, Z, s];
    }
    function frame(now) {
      if (!document.body.contains(c)) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden || now - last < 33) return; last = now;
      const t = (now - t0) / 1000, ang = t * 0.35, tilt = -0.42 + Math.sin(t * 0.3) * 0.06;
      ctx.clearRect(0, 0, W, H);
      /* travesaños entre fases */
      for (let i = 0; i <= 26; i++) {
        const u = i / 26;
        const a = pt(0, u, ang, tilt), b = pt(1, u, ang, tilt), d = pt(2, u, ang, tilt);
        ctx.strokeStyle = 'rgba(150,190,255,' + (0.05 + 0.1 * (1 - (a[2] + 1) / 2)) + ')';
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.stroke();
      }
      /* conductores */
      for (let k = 0; k < 3; k++) {
        const col = COL[k]; let prev = pt(k, 0, ang, tilt);
        for (let i = 1; i <= N; i++) {
          const p = pt(k, i / N, ang, tilt), depth = (p[2] + A) / (2 * A);
          const al = 0.25 + 0.75 * (1 - depth);
          ctx.strokeStyle = 'rgba(' + col + ',' + al + ')';
          ctx.shadowColor = 'rgba(' + col + ',.9)'; ctx.shadowBlur = 10 * (1 - depth) + 2;
          ctx.lineWidth = 1.2 + 2.2 * (1 - depth);
          ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
          prev = p;
        }
        /* electrón que recorre el conductor */
        const u = ((t * 0.16 + k / 3) % 1), e = pt(k, u, ang, tilt);
        ctx.shadowBlur = 18; ctx.shadowColor = 'rgba(' + col + ',1)'; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(e[0], e[1], 2.6 + 1.6 * (1 - (e[2] + A) / (2 * A)), 0, 7); ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (reduce) cancelAnimationFrame(raf);
    }
    if (window.ResizeObserver) new ResizeObserver(fit).observe(c); else window.addEventListener('resize', fit, { passive: true });
    raf = requestAnimationFrame(frame);
  }

  /* ---------- Inclinación 3D de tarjetas ---------- */
  if (!reduce && window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let cur = null;
    document.addEventListener('pointermove', e => {
      const el = e.target.closest && e.target.closest('.tile,a.card');
      if (cur && cur !== el) { cur.style.setProperty('--rx', '0deg'); cur.style.setProperty('--ry', '0deg'); }
      cur = el; if (!el) return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg'); el.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg');
      el.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(0) + '%'); el.style.setProperty('--my', ((y + 0.5) * 100).toFixed(0) + '%');
    }, { passive: true });
    document.addEventListener('pointerleave', () => { if (cur) { cur.style.setProperty('--rx', '0deg'); cur.style.setProperty('--ry', '0deg'); } }, true);
  }
  window.REBTFx = { mount };
})();
