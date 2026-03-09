/* ===================================
   HRVSpark Promo — GSAP + Lenis
   Scroll-driven canvas frame renderer
   =================================== */

(function () {
    'use strict';

    /* ---------- CONFIG ---------- */
    const FRAME_DIR = 'frames/';
    const FRAME_EXT = '.webp';
    const TOTAL_FRAMES = 227;
    const SCROLL_MULTIPLIER = 5; // How many vh per scroll unit

    /* ---------- DOM ---------- */
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const canvasWrap = document.querySelector('.canvas-wrap');
    const darkOverlay = document.getElementById('dark-overlay');
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercent = document.getElementById('loader-percent');
    const marquees = document.querySelectorAll('.marquee-wrap');
    const sections = document.querySelectorAll('.scroll-section');

    /* ---------- STATE ---------- */
    let frames = [];
    let totalFrames = 0;
    let currentFrame = 0;
    let heroFinished = false;

    /* ---------- FRAME LOADER ---------- */
    function framePath(i) {
        return FRAME_DIR + 'frame_' + String(i).padStart(4, '0') + FRAME_EXT;
    }

    // Fast path: bypass auto-detect, use hardcoded frame count
    async function detectFrameCount() {
        return TOTAL_FRAMES;
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
                    loaderBar.style.width = pct + '%';
                    loaderPercent.textContent = pct + '%';
                    if (loaded === count) resolve(imgs);
                };
                img.onerror = () => {
                    loaded++;
                    // Allow missing frames, just leave slot empty
                    if (loaded === count) resolve(imgs);
                };
                img.src = framePath(i);
                imgs[i - 1] = img;
            }
        });
    }

    /* ---------- CANVAS RENDERER ---------- */
    function renderFrame(index) {
        const img = frames[index];
        if (!img || !img.complete || !img.naturalWidth) return;

        // Scale to fill canvas while maintaining aspect ratio
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const cw = canvas.width;
        const ch = canvas.height;

        const scaleX = cw / iw;
        const scaleY = ch / ih;
        // Use 'contain' — the watch should be fully visible
        const scale = Math.min(scaleX, scaleY);

        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
    }

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);
        // Re-scale: canvas.width/height are in CSS pixels * dpr
        // But drawImage uses canvas pixel coords. Adjust:
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(currentFrame);
    }

    /* ---------- SCROLL ANIMATIONS ---------- */
    function initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // --- Lenis smooth scroll ---
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        // --- Hero dissolve on start of scroll ---
        const hero = document.querySelector('.hero-standalone');
        gsap.to(hero, {
            opacity: 0,
            y: -80,
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '80% top',
                scrub: 1,
                onLeave: () => { heroFinished = true; },
                onEnterBack: () => { heroFinished = false; },
            },
        });

        // --- Canvas frame scrub ---
        if (totalFrames > 0) {
            ScrollTrigger.create({
                trigger: '#scroll-container',
                start: 'top 80%',
                end: 'bottom bottom',
                scrub: 0.5,
                onUpdate: (self) => {
                    const idx = Math.min(
                        totalFrames - 1,
                        Math.floor(self.progress * totalFrames)
                    );
                    if (idx !== currentFrame) {
                        currentFrame = idx;
                        renderFrame(idx);
                    }
                },
            });

            // Show canvas when hero scrolls away
            ScrollTrigger.create({
                trigger: '#scroll-container',
                start: 'top 90%',
                end: 'bottom bottom',
                onEnter: () => canvasWrap.classList.add('visible'),
                onLeaveBack: () => canvasWrap.classList.remove('visible'),
            });
        }

        // --- Section animations ---
        sections.forEach((section) => {
            const inner = section.querySelector('.section-inner') ||
                section.querySelector('.stats-grid');
            if (!inner) return;

            const animType = section.dataset.animation || 'slide-left';

            // Stats special case
            if (section.classList.contains('section-stats')) {
                const stats = section.querySelectorAll('.stat');
                gsap.to(stats, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 65%',
                        toggleActions: 'play none none reverse',
                    },
                });

                // Counting animation
                stats.forEach((stat) => {
                    const numEl = stat.querySelector('.stat-number');
                    if (!numEl) return;
                    const target = parseFloat(numEl.dataset.value) || 0;
                    const decimals = parseInt(numEl.dataset.decimals) || 0;
                    gsap.to(numEl, {
                        textContent: target,
                        duration: 1.5,
                        ease: 'power2.out',
                        snap: { textContent: decimals === 0 ? 1 : 0.01 },
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 65%',
                            toggleActions: 'play none none reverse',
                        },
                        onUpdate: function () {
                            const val = parseFloat(numEl.textContent);
                            numEl.textContent = val.toFixed(decimals);
                        },
                    });
                });

                // Dark overlay for stats
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top 70%',
                    end: 'bottom 30%',
                    onEnter: () => { darkOverlay.style.opacity = '1'; },
                    onLeave: () => { darkOverlay.style.opacity = '0'; },
                    onEnterBack: () => { darkOverlay.style.opacity = '1'; },
                    onLeaveBack: () => { darkOverlay.style.opacity = '0'; },
                });

                return;
            }

            // General content animations
            const animations = {
                'slide-left': { from: { x: -80, opacity: 0 }, to: { x: 0, opacity: 1 } },
                'slide-right': { from: { x: 80, opacity: 0 }, to: { x: 0, opacity: 1 } },
                'clip-reveal': { from: { y: 60, opacity: 0, scale: 0.95 }, to: { y: 0, opacity: 1, scale: 1 } },
                'rotate-in': { from: { rotateX: 15, y: 60, opacity: 0 }, to: { rotateX: 0, y: 0, opacity: 1 } },
                'scale-up': { from: { scale: 0.85, opacity: 0 }, to: { scale: 1, opacity: 1 } },
                'stagger-up': { from: { y: 40, opacity: 0 }, to: { y: 0, opacity: 1 } },
            };

            const anim = animations[animType] || animations['slide-left'];

            gsap.set(inner, anim.from);
            gsap.to(inner, {
                ...anim.to,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 65%',
                    toggleActions: 'play none none reverse',
                },
            });
        });

        // --- Marquee parallax ---
        marquees.forEach((wrap) => {
            const scrollSpeed = parseFloat(wrap.dataset.scrollSpeed) || -20;
            ScrollTrigger.create({
                trigger: '#scroll-container',
                start: 'top 80%',
                end: 'bottom bottom',
                onEnter: () => wrap.classList.add('visible'),
                onLeaveBack: () => wrap.classList.remove('visible'),
            });

            // Add parallax shift
            gsap.to(wrap, {
                x: scrollSpeed + '%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '#scroll-container',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            });
        });

        // Duplicate marquee text for seamless looping
        marquees.forEach((wrap) => {
            const text = wrap.querySelector('.marquee-text');
            if (text) text.innerHTML += text.innerHTML;
        });
    }

    /* ---------- INIT ---------- */
    async function init() {
        // Try to detect actual frame count, fall back to 150
        totalFrames = await detectFrameCount();
        console.log(`Detected ${totalFrames} frames`);

        if (totalFrames === 0) {
            // No frames yet — still show the site
            loader.classList.add('hidden');
            initScrollAnimations();
            return;
        }

        frames = await loadFrames(totalFrames);

        // Hide loader
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 400);

        // Set up canvas
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Show first frame
        currentFrame = 0;
        renderFrame(0);

        // Init scroll
        initScrollAnimations();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
