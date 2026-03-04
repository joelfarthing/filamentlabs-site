/* ========================================
   Filament Labs — Shared JS
   filamentlabs.io
   ======================================== */

/**
 * Decorative sparkline animation for the homepage hero.
 * Draws a horizontally-scrolling sparkline on a <canvas> element.
 * Pure vanilla JS — no dependencies.
 */
(function () {
   'use strict';

   const canvas = document.getElementById('heroSparkline');
   if (!canvas) return;

   const ctx = canvas.getContext('2d');
   const dpr = window.devicePixelRatio || 1;
   let points = [];
   const numPoints = 80;
   const speed = 0.4;
   let offset = 0;
   let grad;

   function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Cache gradient on resize
      const w = canvas.width / dpr;
      grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(51, 142, 247, 0)');
      grad.addColorStop(0.15, 'rgba(51, 142, 247, 0.6)');
      grad.addColorStop(0.5, 'rgba(51, 142, 247, 0.8)');
      grad.addColorStop(0.85, 'rgba(255, 124, 30, 0.6)');
      grad.addColorStop(1, 'rgba(255, 124, 30, 0)');
   }

   function generatePoints() {
      points = [];
      for (let i = 0; i < numPoints; i++) {
         points.push(Math.random());
      }
   }


   function draw() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const padding = 8;
      const usableH = h - padding * 2;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      const step = w / (numPoints - 1);
      let prevX, prevY;

      for (let i = 0; i < numPoints; i++) {
         // Slowly oscillate each point
         const baseVal = points[i];
         const wave = Math.sin((i * 0.3) + offset) * 0.15;
         const y = padding + (1 - (baseVal + wave)) * usableH;
         const x = i * step;

         if (i === 0) {
            ctx.moveTo(x, y);
         } else {
            // Smooth curve using midpoints
            const midX = (prevX + x) / 2;
            const midY = (prevY + y) / 2;
            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
         }

         prevX = x;
         prevY = y;
      }

      ctx.stroke();

      offset += speed * 0.02;
      requestAnimationFrame(draw);
   }

   // Initialize
   resize();
   generatePoints();
   draw();

   // Handle resize
   window.addEventListener('resize', resize);
})();

/* ----------------------------------------
   Scroll-reveal: IntersectionObserver
   ---------------------------------------- */
(function () {
   'use strict';

   if (!('IntersectionObserver' in window)) return;

   const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
         if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
         }
      });
   }, { threshold: 0.15 });

   document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      observer.observe(el);
   });
})();
