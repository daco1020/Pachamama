// Dark Mode Sparkle Effect
// Only activates when the page is in dark mode

(function () {
    const particles = [];
    const maxParticles = 30;

    function isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }

    function createParticle(x, y) {
        if (!isDarkMode()) return;

        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            pointer-events: none;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.8), 0 0 10px 4px rgba(255, 255, 255, 0.4);
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            opacity: 1;
            transition: none;
        `;
        document.body.appendChild(particle);

        // Random velocity
        const vx = (Math.random() - 0.5) * 4;
        const vy = (Math.random() - 0.5) * 4 - 1;
        const life = 0.8 + Math.random() * 0.4;

        particles.push({
            element: particle,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            life: life,
            maxLife: life,
            size: 2 + Math.random() * 3
        });

        // Limit particles
        while (particles.length > maxParticles) {
            const old = particles.shift();
            if (old.element.parentNode) {
                old.element.parentNode.removeChild(old.element);
            }
        }
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= 0.016;

            if (p.life <= 0) {
                if (p.element.parentNode) {
                    p.element.parentNode.removeChild(p.element);
                }
                particles.splice(i, 1);
                continue;
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity

            const opacity = p.life / p.maxLife;
            const scale = opacity * p.size;

            p.element.style.left = p.x + 'px';
            p.element.style.top = p.y + 'px';
            p.element.style.opacity = opacity;
            p.element.style.width = scale + 'px';
            p.element.style.height = scale + 'px';
        }

        requestAnimationFrame(updateParticles);
    }

    let lastX = 0;
    let lastY = 0;
    let throttleCounter = 0;

    document.addEventListener('mousemove', function (e) {
        throttleCounter++;
        if (throttleCounter % 3 !== 0) return; // Throttle for performance

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            createParticle(e.clientX, e.clientY);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    // Start animation loop
    updateParticles();
})();
