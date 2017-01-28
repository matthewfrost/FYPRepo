var overlay, ViewModel, markers, tempMarker;
var Map = $.extend(true, {}, Map, {
    View: {
        locations: [],
        locationDetails: ko.observableArray([]),
        selectedLocation: ko.observable(null),
        currentLat: 0,
        currentLong: 0,
        placeMarker: function (location, map, event) {
            ViewModel.locations.push(location);
            markers = ViewModel.locations.map(function (location, i) {
                var marker = new google.maps.Marker({
                    position: location
                });
                tempMarker = marker;
                google.maps.event.addListener(marker, "click", function (event) {
                    debugger;
                    ViewModel.selectedLocation(ViewModel.locationDetails()[i]);
                    var projection = overlay.getProjection();
                    var pixel = projection.fromLatLngToContainerPixel(marker.getPosition());
                    $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', pixel.x + 'px').css('top', pixel.y + 'px');
                    $('.cancelbtn').on('click', Map.View.closeDialog);
                });
                
                return marker;
            });

            ViewModel.currentLat = location.lat();
            ViewModel.currentLong = location.lng();
            $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', event.pixel.x + 'px').css('top', event.pixel.y + 'px');
            $('.cancelbtn').on('click', Map.View.closeDialog);

            var markerCluster = new MarkerClusterer(map, markers,
              { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        },

        saveLocation: function () {
            var Name, Tag, Location
            Location = new Map.Model.Location();
            Location.Name($('#locationName').val());
            Location.Tag($('#locationTag').val());
            Location.Latitude(ViewModel.currentLat);
            Location.Longitude(ViewModel.currentLong);
            tempMarker = null;

            Map.Controller.save({
                data: JSON.stringify(ko.mapping.toJS(Location)),
                success: success
            });

            function success(data, status, jqxhr) {
                $('#locationCard').css('display', 'none');
                $('#locationTag').val('');
                $('#locationName').val('');
                ViewModel.locationDetails().push(Location);


            }
        },

        closeDialog: function (marker) {
            debugger;
            $('#locationCard').css('display', 'none')
            if (tempMarker) {
                markers[markers.length - 1].setMap(null);
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
        debugger;
        $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', e.pixel.x + 'px').css('top', e.pixel.y + 'px');
        $('.cancelbtn').on('click', Map.View.closeDialog);
    });

    Map.Controller.get({
        success: success
    });

    function success(data, status, jqxhr) {
        var Location, marker;
        debugger;
        ViewModel = new Map.ViewModel.Index();
        for (var i = 0; i < data.length; i++) {
            ViewModel.locations.push({ lat: parseFloat(data[i].Latitude), lng: parseFloat(data[i].Longitude) });
            Location = new Map.Model.Location();
            Location.Name(data[i].Name);
            Location.Tag(data[i].TagName);
            Location.Latitude(parseFloat(data[i].Latitude));
            Location.Longitude(parseFloat(data[i].Longitude));
            ViewModel.locationDetails().push(Location);
        }

        markers = ViewModel.locations.map(function (location, i) {
            var marker = new google.maps.Marker({
                position: location
            });

            google.maps.event.addListener(marker, "click", function (event, data) {
                ViewModel.selectedLocation(ViewModel.locationDetails()[i]);
                debugger;
                var projection = overlay.getProjection();
                var pixel = projection.fromLatLngToContainerPixel(marker.getPosition());
                $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', pixel.x + 'px').css('top', pixel.y + 'px');
                $('.cancelbtn').on('click', Map.View.closeDialog);
               // return false;
            });

            return marker;
        });

        var markerCluster = new MarkerClusterer(map, markers,
              { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

        ko.applyBindings(ViewModel)
    }
}

$(function () {
    $('.savebtn').on('click', Map.View.saveLocation);
    $('.cancelbtn').on('click', Map.View.closeDialog);
    
});
