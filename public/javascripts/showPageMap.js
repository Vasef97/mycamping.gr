mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // mporoume na valoume diafora styles
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());  //gia controls panw deksia ston xarth


new mapboxgl.Marker()       //gia na emfanistei marker sto map mas, apo mapbox docs
    .setLngLat(campground.geometry.coordinates)
    .setPopup(                         //gia na mas emfanistoun plirofories gia to location tou marker, vazoume Popup
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5 class="map-campnames">${campground.title}</h5><p>${campground.location}</p>`
            )
    )
    .addTo(map)