var overlay, ViewModel, markers, tempMarker, locationIndex, markerCluster, map;

var Map = $.extend(true, {}, Map, {
    View: {
        placeMarker: function (location, map, event) {
            var cardViewModel, marker, projection, pixel;
            ViewModel.newLocation(true);
            ViewModel.locations.push({ lat: location.lat(), lng: location.lng() });
            markers = ViewModel.locations.map(function (location, i) {
                marker = new google.maps.Marker({
                    position: location
                });
                tempMarker = marker;
                google.maps.event.addListener(marker, "click", function (event) {
                    ViewModel.selectedLocation(ViewModel.locationDetails()[i]);
                    ViewModel.newLocation(false);
                    locationIndex = i;
                    projection = overlay.getProjection();
                    pixel = projection.fromLatLngToContainerPixel(marker.getPosition());
                    $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', pixel.x + 'px').css('top', pixel.y + 'px');
                    $('#deletebtn').on('click', Map.View.showDeleteDialog);
                    $('#cancelbtn').on('click', Map.View.closeDialog);
                });

                return marker;
            });

            ViewModel.currentLat = location.lat();
            ViewModel.currentLong = location.lng();
            ViewModel.selectedLocation(new Map.Model.Location());
            ViewModel.selectedLocation().Latitude(location.lat());
            ViewModel.selectedLocation().Longitude(location.lng());
            ViewModel.selectedLocation()
            $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', event.pixel.x + 'px').css('top', event.pixel.y + 'px');
            $('#cancelbtn').on('click', Map.View.closeDialog);
            $('#savebtn').on('click', Map.View.saveLocation);

            var markerCluster = new MarkerClusterer(map, markers,
              { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        },

        saveLocation: function () {
            var Name, Tag, Location
            Location = new Map.Model.Location();
            if (ViewModel.selectedLocation().ID() == null) {
                Location.ID(null);
            }
            else {
                Location.ID(ViewModel.selectedLocation().ID());
            }
            if (ViewModel.validateViewModel()) {
                Location.LocationName(ViewModel.selectedLocation().LocationName());
                Location.Database(ViewModel.selectedLocation().Database());
                Location.Table(ViewModel.selectedLocation().Table());
                Location.Column(ViewModel.selectedLocation().Column());
                Location.ColumnValue(ViewModel.selectedLocation().ColumnValue());
                ViewModel.getSchema();
                Location.Latitude(ViewModel.selectedLocation().Latitude());
                Location.Longitude(ViewModel.selectedLocation().Longitude());
                tempMarker = null;

                Map.Controller.save({
                    data: JSON.stringify(ko.mapping.toJS(Location)),
                    success: success
                });

                function success(data, status, jqxhr) {
                    $('#locationCard').css('display', 'none');
                    $('#locationTag').val('');
                    $('#locationName').val('');
                    Location.ID(data);
                    ViewModel.locationDetails().push(Location);
                    Map.View.closeDialog();
                }
            }
        },

        showDeleteDialog: function () {
            Map.View.showOverlay();
        },

        closeDialog: function (marker) {
            $('#locationCard').css('display', 'none')
            if (tempMarker) {
                var location = new google.maps.LatLng(0, 0);
                markers[markers.length - 1].setPosition(location);
                markers[markers.length - 1].setVisible(false);
                markers[markers.length - 1].setMap(null);
                markers.splice((markers.length - 1), 1);
                ViewModel.locations.splice((markers.length - 1), 1);

            }
        },

        showOverlay: function () {
            $('#overlay').css('z-index', 10);
            $('#deleteDialog').css('display', 'block');
            $('#closeDelete').on('click', Map.View.removeDeleteDialog);
            $('#deleteLocation').on('click', Map.View.deleteLocation);
        },

        removeDeleteDialog: function () {
            $('#deleteDialog').css('display', 'none');
            $('#overlay').css('z-index', -5);
        },

        deleteLocation: function () {
            var ID;

            ID = ko.mapping.toJS(ViewModel.selectedLocation().ID())
            Map.Controller.delete({
                data: '{"data": ' + ID + '}',
                success: success
            });

            function success(data, status, jqxhr) {
                Map.View.showOverlay();
                ViewModel.locations = ViewModel.locations.splice(locationIndex, 1);
                var clearLatLng = new google.maps.LatLng(0, 0);
                markers[locationIndex].setPosition(clearLatLng); //dont go to Africa
                markers[locationIndex].setVisible(false);
                markers[locationIndex].setMap(null);
                markers.splice(locationIndex, 1);
                ViewModel.locations.splice(locationIndex, 1);
                Map.View.removeDeleteDialog();
                Map.View.closeDialog();
            }
        }

    }
});

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: { lat: 54.5779746, lng: -1.1043465 },
        disableDoubleClickZoom: true
    });

    overlay = new google.maps.OverlayView();
    overlay.draw = function () { };
    overlay.setMap(map);

    map.addListener('dblclick', function (e) {
        Map.View.placeMarker(e.latLng, map, e);

        $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', e.pixel.x + 'px').css('top', e.pixel.y + 'px');
        $('#closeLocation').on('click', Map.View.closeDialog);
    });

    Map.Controller.get({
        success: success
    });

    function success(data, status, jqxhr) {
        var Location, marker;
        ViewModel = new Map.ViewModel.Index();

        for (var i = 0; i < data.length; i++) {
            ViewModel.locations.push({ lat: parseFloat(data[i].Latitude), lng: parseFloat(data[i].Longitude) });
            Location = new Map.Model.Location();
            Location.ID(data[i].ID);
            Location.LocationName(data[i].Name);
            Location.ColumnValue(data[i].ValueName);
            Location.Database(data[i].Database);
            Location.Table(data[i].Table);
            Location.Column(data[i].Column);
            Location.Latitude(parseFloat(data[i].Latitude));
            Location.Longitude(parseFloat(data[i].Longitude));
            ViewModel.locationDetails().push(Location);
        }

        markers = ViewModel.locations.map(function (location, i) {
            var marker = new google.maps.Marker({
                position: location
            });

            google.maps.event.addListener(marker, "click", function (event, data) {
                var projection, pixel;
                ViewModel.newLocation(false);
                ViewModel.selectedLocation(ViewModel.locationDetails()[i]);
                locationIndex = i;
                ViewModel.getSchema();
                projection = overlay.getProjection();
                pixel = projection.fromLatLngToContainerPixel(marker.getPosition());
                $('#locationCard').css('display', 'block').css('position', 'absolute').css('left', pixel.x + 'px').css('top', pixel.y + 'px');
                $('#cancelbtn').on('click', Map.View.closeDialog);
                $('#deletebtn').on('click', Map.View.showDeleteDialog);
                $('#savebtn').on('click', Map.View.saveLocation);
            });

            return marker;
        });

        markerCluster = new MarkerClusterer(map, markers,
              { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

        ko.applyBindings(ViewModel)
    }
}

$(function () {
    $('#savebtn').on('click', Map.View.saveLocation);
    $('#cancelbtn').on('click', Map.View.closeDialog);
    $.toast({
        text: '<ul><li>Double click to add a point</li><li>Click on a point to view and edit info</li></ul>',
        showHideTransition: 'Fade',
        bgColor: '#42a5ce',
        textColor: '#eee',
        hideAfter: 10000
    });
});
