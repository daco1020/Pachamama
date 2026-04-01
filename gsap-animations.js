/**
 * Pachamama - GSAP Animations (Premium Dark/Tesla/Apple Style)
 * Animaciones inmersivas, pinning de scroll, y efectos cinematográficos.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Registrar Plugins
    gsap.registerPlugin(ScrollTrigger);

    // Preparación inicial para evitar parpadeos y configurar estados inmersivos
    gsap.set(".gsap-reveal, section h2, section > div > div > span.text-secondary, section blockquote", { autoAlpha: 0, y: 60 });
    gsap.set(".gsap-parallax-img img", { scale: 1.2 });
    
    // El "Kit Esencial" Glass panel lo ocultamos inicialmente grande
    const scaleUpElements = document.querySelectorAll(".gsap-scale-up, section.bg-background > .glass, .kit-card-full");
    gsap.set(scaleUpElements, { scale: 0.85, autoAlpha: 0, transformOrigin: "center center" });

    const mm = gsap.matchMedia();

    mm.add("(min-width: 320px)", (context) => {
        // --- 1. Hero Cinematic ---
        // Al cargar, el héroe baja majestuosamente 
        const heroTl = gsap.timeline({ defaults: { ease: "expo.out", duration: 2 } });
        
        const heroElements = document.querySelectorAll("header h1, header p, header div.animate-fade-in, header a");
        if (heroElements.length > 0) {
            heroTl.fromTo(heroElements, 
                { autoAlpha: 0, y: 50, scale: 0.95 },
                { autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, delay: 0.1 }
            );
        }

        // Además, la imagen principal/auras reaccionan con parallax extremo invertido al bajar
        const headerSection = document.querySelector("header");
        if(headerSection) {
            gsap.to(".aura-bg", {
                scrollTrigger: {
                    trigger: headerSection,
                    start: "top top",
                    end: "bottom top",
                    scrub: false // Desconectado scrub directo para que no sea tan pesado, o probar scrub suave
                },
                yPercent: 20, 
                opacity: 0.3,
                ease: "none"
            });
        }

        // --- 2. Elementos Reveal al Scroll (Apple Curtain-like Effect) ---
        // Usamos Expo.out y un desplazamiento mayor para dar ese efecto de "cortina" suave
        const revealElements = document.querySelectorAll(".gsap-reveal, section h2, section > div > div > span.text-secondary, section blockquote, .guarantee-section");
        revealElements.forEach((el) => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // empieza un poco antes
                    toggleActions: "play none none reverse" 
                },
                autoAlpha: 1,
                y: 0,
                duration: 1.5, // Más lento y dramático
                ease: "expo.out"
            });
        });

        // --- 3. Tarjetas y Grids (Cascada Dinámica) ---
        const staggerContainers = document.querySelectorAll(".grid");
        staggerContainers.forEach((container) => {
            const children = container.querySelectorAll(".glass-premium, .feature-card, .process-card, .testimonial-card, a");
            if(children.length > 0) {
                gsap.set(children, { autoAlpha: 0, y: 50, scale: 0.95 });
                
                ScrollTrigger.batch(children, {
                    interval: 0.15,
                    batchMax: 6,
                    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.15, duration: 1.2, ease: "expo.out", overwrite: true }),
                    onLeaveBack: (batch) => gsap.to(batch, { autoAlpha: 0, y: 50, scale: 0.95, duration: 0.5, overwrite: true }),
                    start: "top 85%",
                });
            }
        });

        // --- 4. Parallax Extremo en Imágenes ---
        const parallaxContainers = document.querySelectorAll(".glass-premium .aspect-\\[4\\/3\\] img, .hero-img-container img");
        parallaxContainers.forEach((img) => {
            // Escala inicial gigante
            gsap.set(img, { scale: 1.3, transformOrigin: "50% 50%" });
            
            gsap.to(img, {
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5 // Scrub con mucha inercia (1.5s lag)
                },
                scale: 1, // Se encoge a tamaño normal
                yPercent: 10,
                ease: "none"
            });
        });

        // --- 5. ScrollJacking / Pinning para Elementos Especiales (Ej: El Kit) ---
        // Esto congela la pantalla mientras expande la tarjeta principal
        scaleUpElements.forEach((el) => {
            const parentSection = el.closest('section') || el.parentElement;
            
            // Creamos un timeline atado al scroll
            const pinTl = gsap.timeline({
                scrollTrigger: {
                    trigger: parentSection,
                    start: "top 20%",
                    end: "+=800", // El scroll se alarga 800px adicionales
                    pin: true,    // ¡Fijar pantalla!
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            // Animación que ocurre mientras está fijado
            pinTl.to(el, {
                scale: 1,
                autoAlpha: 1,
                boxShadow: "0 0 100px rgba(163, 194, 147, 0.2)",
                ease: "power2.inOut",
                duration: 1
            });
        });

        return () => {
            // cleanup
        };
    });

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
});
