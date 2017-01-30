var Map = $.extend(true, {}, Map, {
    Model: {
        Location: function() {
            var self = this;
            self.ID = ko.observable(null);
            self.Name = ko.observable(null);
            self.Tag = ko.observable(null);
            self.Latitude = ko.observable(null);
            self.Longitude = ko.observable(null);
        }
    }
});