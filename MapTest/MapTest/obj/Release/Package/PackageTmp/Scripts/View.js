var overlay;
var Map = $.extend(true, {}, Map, {
    View: {
        locations: [],
        locationDetails: ko.observableArray([]),
        selectedLocation: ko.observable(null),
        currentLat: 0,
        currentLong: 0,
        placeMarker: function (location, map, event) {

            Map.View.locations.push(location);
            var markers = Map.View.locations.map(function (location, i) {
                var marker = new google.maps.Marker({
                    position: location
                });

                google.maps.event.addListener(marker, "click", function (event) {
                    debugger;
                    Map.View.selectedLocation(Map.View.locationDetails()[i]);
                    var projection = overlay.getProjection();
                    var pixel = projection.fromLatLngToContainerPixel(marker.getPosition());
                    $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', pixel.x + 'px').css('top', pixel.y + 'px');
                });

                return marker;
            });

            Map.View.currentLat = location.lat();
            Map.View.currentLong = location.lng();
            $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', event.pixel.x + 'px').css('top', event.pixel.y + 'px');

            var markerCluster = new MarkerClusterer(map, markers,
              { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });


        },

        saveLocation: function () {
            var Name, Tag, Location
            Location = new Map.Model.Location();
            Location.Name($('#locationName').val());
            Location.Tag($('#locationTag').val());
            Location.Latitude(Map.View.currentLat);
            Location.Longitude(Map.View.currentLong);

            Map.Controller.save({
                data: JSON.stringify(ko.mapping.toJS(Location)),
                success: success
            });

            function success(data, status, jqxhr) {
                $('#locationCard').css('display', 'none');
                $('#locationTag').val('');
                $('#locationName').val('');
                Map.View.locationDetails().push(Location);


            }
        }
    }
});

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: { lat: 54.5779746, lng: -1.1043465 },
        disableDoubleClickZoom: true 
    });

    overlay = new google.maps.OverlayView();
    overlay.draw = function () { };
    overlay.setMap(map);

    map.addListener('dblclick', function (e) {
        Map.View.placeMarker(e.latLng, map, e);
        return false;
    });

    Map.Controller.get({
        success: success
    });

    function success(data, status, jqxhr) {
        var Location, marker;

        for (var i = 0; i < data.length; i++) {
            Map.View.locations.push({ lat: data[i].Latitude, lng: data[i].Longitude });
            Location = new Map.Model.Location();
            Location.Name(data[i].Name);
            Location.Tag(data[i].Tag);
            Location.Latitude(data[i].Latitude);
            Location.Longitude(data[i].Longitude);
            Map.View.locationDetails().push(Location);
        }

        var markers = Map.View.locations.map(function (location, i) {
            var marker = new google.maps.Marker({
                position: location
            });

            google.maps.event.addListener(marker, "dblclick", function (event, data) {
                Map.View.selectedLocation(Map.View.locationDetails()[i]);
                debugger;
                var projection = overlay.getProjection();
                var pixel = projection.fromLatLngToContainerPixel(marker.getPosition());
                $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', pixel.x + 'px').css('top', pixel.y + 'px');
                return false;
            });

            return marker;
        });

        var markerCluster = new MarkerClusterer(map, markers,
              { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

        ko.applyBindings(Map.View.locationDetails)
    }
}

$(function () {
    $('.savebtn').on('click', Map.View.saveLocation);
    
});
