var Map = $.extend(true, {}, Map, {
    View: {
        locations: [],
        self: this,
        currentLat: 0,
        currentLong: 0,
        placeMarker: function (location, map, event) {
            Map.View.locations.push(location);
            var markers = Map.View.locations.map(function (location, i) {
                return new google.maps.Marker({
                    position: location
                });
            });
            
            Map.View.currentLat = location.lat();
            Map.View.currentLong = location.lng();
            jQuery('#locationCard').css('display', 'block').css('position', 'absolute').css('left', event.pixel.x + 'px').css('top', event.pixel.y + 'px');

            var markerCluster = new MarkerClusterer(map, markers,
              { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        },

        saveLocation: function () {
            var Name, Tag, Location
            Location = new Map.Model.Location();
            Location.Name = $('#locationName').val();
            Location.Tag = $('#locationTag').val();
            Location.Latitude = Map.View.currentLat;
            Location.Longitude = Map.View.currentLong;
            
            Map.Controller.save({
                data: JSON.stringify(Location),
                success: success
            });

            function success(data, status, jqxhr) {
                $('#locationCard').css('display', 'none');
                $('#locationTag').val('');
                $('#locationName').val('');
            }
        }
    }

});

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: { lat: 54.5779746, lng: -1.1043465 }
    });

    map.addListener('rightclick', function (e) {
        Map.View.placeMarker(e.latLng, map, e);
    });

    Map.Controller.get({
        success: success
    });

    function success(data, status, jqxhr) {
        for (var i = 0; i < data.length; i++) {

        }
    }

}

$(function () {
    $('.savebtn').on('click', Map.View.saveLocation);
});
