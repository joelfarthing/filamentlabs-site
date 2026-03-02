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

   var canvas = document.getElementById('heroSparkline');
   if (!canvas) return;

   var ctx = canvas.getContext('2d');
   var dpr = window.devicePixelRatio || 1;
   var points = [];
   var numPoints = 80;
   var speed = 0.4;
   var offset = 0;

   function resize() {
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
   }

   function generatePoints() {
      points = [];
      for (var i = 0; i < numPoints; i++) {
         points.push(Math.random());
      }
   }

   function lerp(a, b, t) {
      return a + (b - a) * t;
   }

   function draw() {
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;
      var padding = 8;
      var usableH = h - padding * 2;

      ctx.clearRect(0, 0, w, h);

      // Create gradient stroke
      var grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(51, 142, 247, 0)');
      grad.addColorStop(0.15, 'rgba(51, 142, 247, 0.6)');
      grad.addColorStop(0.5, 'rgba(51, 142, 247, 0.8)');
      grad.addColorStop(0.85, 'rgba(255, 124, 30, 0.6)');
      grad.addColorStop(1, 'rgba(255, 124, 30, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      var step = w / (numPoints - 1);

      for (var i = 0; i < numPoints; i++) {
         // Slowly oscillate each point
         var baseVal = points[i];
         var wave = Math.sin((i * 0.3) + offset) * 0.15;
         var y = padding + (1 - (baseVal + wave)) * usableH;
         var x = i * step;

         if (i === 0) {
            ctx.moveTo(x, y);
         } else {
            // Smooth curve using midpoints
            var prevVal = points[i - 1];
            var prevWave = Math.sin(((i - 1) * 0.3) + offset) * 0.15;
            var prevY = padding + (1 - (prevVal + prevWave)) * usableH;
            var prevX = (i - 1) * step;
            var midX = (prevX + x) / 2;
            var midY = (prevY + y) / 2;
            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
         }
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
