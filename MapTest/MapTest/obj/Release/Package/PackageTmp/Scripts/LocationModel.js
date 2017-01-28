var Map = $.extend(true, {}, Map, {
    Model: {
        Location: function() {
            var self = this;
            self.Name = ko.observable(null);
            self.Tag = ko.observable(null);
            self.Latitude = ko.observable(null);
            self.Longitude = ko.observable(null);
        }
    }
});