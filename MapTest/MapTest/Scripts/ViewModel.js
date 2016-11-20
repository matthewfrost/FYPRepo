var Map = $.extend(true, {}, Map, {
    ViewModel: {
        Index: function () {
            var self = this;

            self.locations = [];
            self.locationDetails = ko.observableArray([]);
            self.selectedLocation = ko.observable(null);
            self.currentLat = 0;
            self.currentLong = 0;
        }
    }
});