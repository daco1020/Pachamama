// Funcionalidad de sliders
class Slider {
    constructor(containerSelector, autoScrollInterval = 5000) {
        this.container = document.querySelector(containerSelector);

        // Verificar que el container existe antes de continuar
        if (!this.container) {
            console.error('Container not found:', containerSelector);
            return;
        }

        this.slider = this.container.querySelector('.process-slider, .testimonials-slider');
        this.slides = this.slider ? this.slider.querySelectorAll('.process-slide, .testimonial-slide') : [];
        this.dots = this.container.querySelectorAll('.dot');
        this.prevBtn = this.container.querySelector('.prev-btn');
        this.nextBtn = this.container.querySelector('.next-btn');

        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoScrollInterval = autoScrollInterval;
        this.autoScrollTimer = null;

        this.init();
    }

    init() {
        // Verificar que el container existe
        if (!this.container) {
            console.error('Container not found');
            return;
        }

        // Configurar eventos de botones (solo si existen)
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Configurar eventos de dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Pausar auto-scroll al hacer hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoScroll());
        this.container.addEventListener('mouseleave', () => this.resetAutoScroll());

        // Iniciar auto-scroll
        this.startAutoScroll();

        // Configurar slide inicial
        this.updateSlider();
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateSlider();
        this.resetAutoScroll();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.resetAutoScroll();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
        this.resetAutoScroll();
    }

    updateSlider() {
        // Mover el slider
        const translateX = -this.currentSlide * 100;
        this.slider.style.transform = `translateX(${translateX}%)`;

        // Actualizar dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        // Actualizar clases active en slides para animaciones
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoScroll() {
        this.autoScrollTimer = setInterval(() => {
            this.nextSlide();
        }, this.autoScrollInterval);
    }

    pauseAutoScroll() {
        if (this.autoScrollTimer) {
            clearInterval(this.autoScrollTimer);
            this.autoScrollTimer = null;
        }
    }

    resetAutoScroll() {
        this.pauseAutoScroll();
        this.startAutoScroll();
    }
}

// Inicializar sliders cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {


    // Inicializar slider de testimonios solo si existe
    const testimonialsSliderContainer = document.querySelector('.testimonials-slider-container');
    if (testimonialsSliderContainer) {
        const testimonialsSlider = new Slider('.testimonials-slider-container', 4000);
    }

    // Smooth scrolling SOLO para enlaces internos (que empiezan con #)
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Solo interceptar si es un enlace interno válido (empieza con # y tiene más de 1 carácter)
            if (href && href.length > 1 && href.startsWith('#')) {
                const targetSection = document.querySelector(href);

                if (targetSection) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // Si no es un enlace interno válido, dejar que el navegador maneje la navegación normalmente
        });
    });

    // Efecto de aparición en scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .integration-card, .process-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Header background en scroll
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Funcionalidad de botones CTA
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-primary-large');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Efecto de click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Aquí puedes agregar la lógica para manejar el click
            // Por ejemplo, abrir un modal, redirigir, etc.
            console.log('CTA clicked:', this.textContent);
        });
    });

    // Funcionalidad para botones de precios
    const pricingButtons = document.querySelectorAll('.pricing-card .btn-primary, .pricing-card .btn-outline');

    pricingButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // No prevenir el comportamiento por defecto para permitir navegación
            // e.preventDefault();

            const card = this.closest('.pricing-card');
            const planName = card.querySelector('.pricing-header h3').textContent;
            const price = card.querySelector('.price').textContent;

            // Log para debugging
            console.log(`Plan seleccionado: ${planName} - ${price}`);

            // Permitir que el enlace funcione normalmente sin interferir
            // Comentamos el código que causa el problema
            /*
            // Ejemplo de feedback visual
            this.textContent = 'Procesando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = this.classList.contains('btn-primary') ? 'Comenzar Ahora' : 'Probar Gratis';
                this.disabled = false;
            }, 2000);
            */
        });
    });



    // Navegación móvil (si se implementa en el futuro)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            navLinksContainer.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Validación de formularios (si se agregan en el futuro)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Funcionalidad para testimonios (rotación automática si se desea)
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;

    function rotateTestimonials() {
        // Esta función se puede usar para rotar testimonios automáticamente
        // Por ahora está comentada para mantener todos visibles
        /*
        testimonialCards.forEach((card, index) => {
            card.style.display = index === currentTestimonial ? 'block' : 'none';
        });
        
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        */
    }

    // Efectos parallax muy sutiles (sin ocultar contenido)
    window.addEventListener('scroll', Utils.throttle(function () {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Solo aplicar parallax en dispositivos de escritorio
        if (window.innerWidth > 768) {
            // Efecto parallax muy sutil para hero (solo fondo)
            const hero = document.querySelector('.hero');
            if (hero && scrolled < hero.offsetHeight) {
                // Parallax muy sutil que no afecta la legibilidad
                hero.style.transform = `translateY(${scrolled * 0.02}px)`;
            }

            // Efecto parallax mínimo para features (segundo bloque)
            const features = document.querySelector('.features');
            if (features) {
                const featuresTop = features.offsetTop;
                const featuresHeight = features.offsetHeight;

                // Solo aplicar el efecto cuando la sección esté visible
                if (scrolled + windowHeight > featuresTop && scrolled < featuresTop + featuresHeight) {
                    // Parallax extremadamente sutil para no ocultar contenido
                    const parallaxOffset = (scrolled - featuresTop + windowHeight) * 0.01;
                    features.style.transform = `translateY(${-parallaxOffset}px)`;
                }
            }

            // Efecto parallax mínimo para pricing (tercer bloque)
            const pricing = document.querySelector('.pricing');
            if (pricing) {
                const pricingTop = pricing.offsetTop;
                const pricingHeight = pricing.offsetHeight;

                if (scrolled + windowHeight > pricingTop && scrolled < pricingTop + pricingHeight) {
                    // Parallax muy sutil para mantener todo el contenido visible
                    const parallaxOffset = (scrolled - pricingTop + windowHeight) * 0.005;
                    pricing.style.transform = `translateY(${-parallaxOffset}px)`;
                }
            }
        } else {
            // Resetear transforms en móviles
            const hero = document.querySelector('.hero');
            const features = document.querySelector('.features');
            const pricing = document.querySelector('.pricing');

            if (hero) hero.style.transform = '';
            if (features) features.style.transform = '';
            if (pricing) pricing.style.transform = '';
        }
    }, 16));

    // Lazy loading para imágenes (si se agregan)
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Funcionalidad de búsqueda (si se implementa)
    function handleSearch(query) {
        // Lógica de búsqueda
        console.log('Searching for:', query);
    }

    // Manejo de errores global
    window.addEventListener('error', function (e) {
        console.error('Error capturado:', e.error);
        // Aquí puedes agregar lógica para reportar errores
    });

    // Inicialización completa
    console.log('Jabonería Premium - Landing page cargada correctamente');
});

// Utilidades adicionales
const Utils = {
    // Debounce function para optimizar eventos
    debounce: function (func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // Throttle function
    throttle: function (func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Función para formatear precios
    formatPrice: function (price) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    },

    // Función para validar formularios
    validateForm: function (formData) {
        const errors = [];

        if (!formData.name || formData.name.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!formData.email || !this.validateEmail(formData.email)) {
            errors.push('Email inválido');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    validateEmail: function (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// Exportar utilidades si se usa en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}