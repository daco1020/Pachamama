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

    // Add markers to map
    zones.forEach(zone => {
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
    });
});
