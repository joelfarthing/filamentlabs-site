/* ===================================
   HRVSpark Prod — Embedded Watch Renderer
   =================================== */

(function () {
    'use strict';

    const FRAME_DIR = '/hrvspark/promo/frames/';
    const FRAME_EXT = '.webp';
    const TOTAL_FRAMES = 227;

    const canvasWrap = document.getElementById('background-watch-wrap');
    const canvas = document.getElementById('watch-canvas');
    if (!canvas || !canvasWrap) return;

    const ctx = canvas.getContext('2d', { colorSpace: 'srgb' });

    let frames = [];
    let currentFrame = 0;

    function framePath(i) {
        return FRAME_DIR + 'frame_' + String(i).padStart(4, '0') + FRAME_EXT;
    }

    async function loadFrames(count) {
        const imgs = [];
        let loaded = 0;

        return new Promise((resolve) => {
            for (let i = 1; i <= count; i++) {
                const img = new Image();
                img.onload = () => {
                    loaded++;
                    const pct = Math.round((loaded / count) * 100);
                    const loaderPercent = document.getElementById('loader-percent');
                    if (loaderPercent) loaderPercent.textContent = pct + '%';
                    if (loaded === count) resolve(imgs);
                };
                img.onerror = () => {
                    loaded++;
                    if (loaded === count) resolve(imgs);
                };
                img.src = framePath(i);
                imgs[i - 1] = img;
            }
        });
    }

    function renderFrame(index) {
        const img = frames[index];
        if (!img || !img.complete || !img.naturalWidth) return;

        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const cw = canvas.width;
        const ch = canvas.height;

        const scaleX = cw / iw;
        const scaleY = ch / ih;
        const baseScale = Math.min(scaleX, scaleY);

        // Natively scale down the watch by 35%
        const scale = baseScale * 0.65;

        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;

        ctx.clearRect(0, 0, cw, ch);

        ctx.drawImage(img, dx, dy, dw, dh);

        // 100% Bulletproof Cross-Browser Darkening
        // We use source-atop to draw a dark semi-transparent rectangle *only* over the opaque pixels of the watch
        // This completely bypasses the wildly varying gamma curves and broken hardware filters in Safari/Chrome
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.60)'; // Apply a 60% black wash to darken the image
        ctx.fillRect(0, 0, cw, ch);

        // Reset for next frame
        ctx.globalCompositeOperation = 'source-over';
    }

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cw = window.innerWidth;
        const ch = window.innerHeight;

        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        canvas.style.width = cw + 'px';
        canvas.style.height = ch + 'px';

        renderFrame(currentFrame);
    }

    function initScrollAnimations() {
        if (typeof gsap === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        // Optional smooth wheel
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
            });

            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }

        // Fade in/out the wrapper
        ScrollTrigger.create({
            trigger: '#watch-trigger-zone',
            start: 'top 75%', // Fade in when top of zone is 25% up the screen
            end: 'bottom 90%', // Fade out right before the footer arrives
            onEnter: () => canvasWrap.classList.add('active'),
            onLeave: () => canvasWrap.classList.remove('active'),
            onEnterBack: () => canvasWrap.classList.add('active'),
            onLeaveBack: () => canvasWrap.classList.remove('active')
        });

        // Scrub Animation for Canvas across the trigger zone
        ScrollTrigger.create({
            trigger: '#watch-trigger-zone',
            start: 'top 75%',
            end: 'bottom 90%',
            scrub: 0.5,
            onUpdate: (self) => {
                const idx = Math.min(
                    TOTAL_FRAMES - 1,
                    Math.floor(self.progress * TOTAL_FRAMES)
                );
                if (idx !== currentFrame) {
                    currentFrame = idx;
                    renderFrame(idx);
                }
            },
        });
    }

    async function init() {
        frames = await loadFrames(TOTAL_FRAMES);

        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        currentFrame = 0;
        renderFrame(0);

        initScrollAnimations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
