/**
 * Pachamama - Menú de navegación móvil
 * Antes, el botón "hamburguesa" no tenía ninguna funcionalidad: en móvil no había
 * forma de navegar ni de llegar al botón de compra. Este script crea un panel
 * desplegable accesible y reutiliza el enlace de WhatsApp contextual de cada página.
 */
(function () {
    function init() {
        var nav = document.querySelector('nav');
        if (!nav) return;

        var bar = nav.querySelector('div');      // contenedor interno (position: relative)
        var btn = nav.querySelector('button');   // botón hamburguesa
        if (!bar || !btn) return;

        // Reutiliza el enlace/mensaje de WhatsApp ya presente en la página
        var waEl = nav.querySelector('a[href*="wa.me"], a[href*="wa.link"]');
        var waHref = waEl ? waEl.getAttribute('href') : 'https://wa.me/573127760390';

        var linkClass = 'block px-5 py-3 rounded-2xl text-xs uppercase tracking-widest font-semibold text-primary/70 hover:text-primary hover:bg-primary/5 transition-premium';

        var panel = document.createElement('div');
        panel.id = 'mobileMenu';
        panel.className = 'md:hidden hidden absolute top-full left-0 right-0 mt-3 glass-premium rounded-3xl p-4 flex-col gap-1 origin-top z-50';
        panel.innerHTML =
            '<a href="index.html" class="' + linkClass + '">Inicio</a>' +
            '<a href="coleccion.html" class="' + linkClass + '">Colección</a>' +
            '<a href="filosofia.html" class="' + linkClass + '">Filosofía</a>' +
            '<a href="' + waHref + '" target="_blank" rel="noopener" class="mt-2 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-[11px] uppercase tracking-widest font-bold bg-accent text-[#050505] hover:scale-[1.02] transition-premium">' +
            '<span class="material-symbols-outlined text-base">chat</span>Comprar el Kit · $45.000</a>';
        bar.appendChild(panel);

        btn.setAttribute('aria-label', 'Abrir menú');
        btn.setAttribute('aria-controls', 'mobileMenu');
        btn.setAttribute('aria-expanded', 'false');

        function open() {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
            btn.setAttribute('aria-expanded', 'true');
        }
        function close() {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
            btn.setAttribute('aria-expanded', 'false');
        }
        function toggle(e) {
            e.preventDefault();
            e.stopPropagation();
            if (panel.classList.contains('hidden')) { open(); } else { close(); }
        }

        btn.addEventListener('click', toggle);
        panel.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', close);
        });
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target)) close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
