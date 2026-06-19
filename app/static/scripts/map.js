// Renders the "places visited" map from JSON embedded in the page.
(function () {
    var dataEl = document.getElementById("places-data");
    var mapEl = document.getElementById("map");
    if (!dataEl || !mapEl || typeof L === "undefined") {
        return;
    }

    var places = JSON.parse(dataEl.textContent);
    var map = L.map("map");

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
    }).addTo(map);

    var markers = places.map(function (place) {
        return L.marker([place.lat, place.lng]).addTo(map).bindPopup(place.name);
    });

    if (markers.length) {
        map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2));
    } else {
        map.setView([20, 0], 2);
    }
})();
