/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);

const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoieWFzaGd1cHRhMTExMSIsImEiOiJjbGNjZzB2ZDUyazhwM3d0OHF0ZnhtcmhkIn0.S93xXiysZdlPuelZHk1Wdw';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/yashgupta1111/clcci2fmq002p14p2o4z1kvxy',
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 10,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};

displayMap(locations);
