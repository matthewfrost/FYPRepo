var Map = $.extend(true, {}, Map, {
    Model: {
        Location: function() {
            var self = this;
            self.ID = ko.observable(null);
            self.LocationName = ko.observable(null);
            self.Database = ko.observable(null);
            self.Table = ko.observable(null);
            self.Column = ko.observable(null);
            self.ColumnValue = ko.observable(null);
            self.Latitude = ko.observable(null);
            self.Longitude = ko.observable(null);
        }
    }
});