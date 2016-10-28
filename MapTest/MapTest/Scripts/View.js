var locations = [];
function initMap() {
    debugger;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: { lat: 54.5779746, lng: -1.1043465 }
    });

    // Create an array of alphabetical characters used to label the markers.

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.


    map.addListener('rightclick', function (e) {
        placeMarker(e.latLng, map, e);
    });

    // Add a marker clusterer to manage the markers.

}

function placeMarker(location, map, event) {
    locations.push(location);
    var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
            position: location
        });
    });
    jQuery('#locationCard').css('display', 'block').css('position', 'absolute').css('left', event.pixel.x + 'px').css('top', event.pixel.y + 'px')

    var markerCluster = new MarkerClusterer(map, markers,
      { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

}
