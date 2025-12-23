document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map centered on Colombia
    const map = L.map('map').setView([4.570868, -74.297333], 6);

    // Add OpenStreetMap tile layer (Dark mode savvy could be added later, using standard OSM for now)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Define custom icon (optional, using default for now but colored could be cool)
    // For simplicity we use circle markers which look modern

    // Zone Data
    const zones = [
        {
            name: "Vichada - Proyecto Orinoco",
            coords: [4.438218, -69.282928],
            trees: 1200,
            type: "Reforestación Nativa",
            color: "#5C6B5F" // Accent color
        },
        {
            name: "Amazonas - Pulmón del Mundo",
            coords: [-1.442811, -71.572395],
            trees: 3500,
            type: "Conservación",
            color: "#C4A484" // Primary color
        },
        {
            name: "Antioquia - Bosque de Niebla",
            coords: [6.244203, -75.581212],
            trees: 850,
            type: "Restauración Ecológica",
            color: "#B0A18E" // Secondary color
        }
    ];

    // Store markers to trigger them programmatically
    const markers = [];

    // Add markers to map
    zones.forEach((zone, index) => {
        const circle = L.circleMarker(zone.coords, {
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.7,
            radius: 12
        }).addTo(map);

        circle.bindPopup(`
            <div class="font-sans p-2">
                <h3 class="font-bold text-lg mb-1" style="color: ${zone.color}">${zone.name}</h3>
                <p class="text-sm text-gray-600 mb-1"><strong>Tipo:</strong> ${zone.type}</p>
                <p class="text-sm text-gray-600"><strong>Árboles:</strong> ${zone.trees}</p>
            </div>
        `);

        markers.push({
            id: index,
            marker: circle,
            zone: zone
        });
    });

    // Search Functionality
    const searchInput = document.getElementById('map-search');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }

        const filtered = markers.filter(m =>
            m.zone.name.toLowerCase().includes(query) ||
            m.zone.type.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
            searchResults.innerHTML = filtered.map(m => `
                <div class="search-item p-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors" data-id="${m.id}">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full" style="background-color: ${m.zone.color}"></div>
                        <div>
                            <div class="text-sm font-bold text-text-light dark:text-text-dark">${m.zone.name}</div>
                            <div class="text-[10px] uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">${m.zone.type}</div>
                        </div>
                    </div>
                </div>
            `).join('');
            searchResults.classList.remove('hidden');
        } else {
            searchResults.innerHTML = `
                <div class="p-6 text-center">
                    <div class="text-sm text-text-muted-light dark:text-text-muted-dark">No se encontraron zonas</div>
                </div>
            `;
            searchResults.classList.remove('hidden');
        }
    });

    // Handle result click
    searchResults.addEventListener('click', (e) => {
        const item = e.target.closest('.search-item');
        if (!item) return;

        const id = parseInt(item.dataset.id);
        const match = markers.find(m => m.id === id);

        if (match) {
            map.flyTo(match.zone.coords, 14, {
                duration: 1.5
            });

            setTimeout(() => {
                match.marker.openPopup();
            }, 1500);

            searchInput.value = match.zone.name;
            searchResults.classList.add('hidden');
        }
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });
});
