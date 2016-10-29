var Map = $.extend(true, {}, Map, {
    Model: {
        Location: function() {
            var self = this;
            self.Name = "";
            self.Tag = ""
            self.Latitude = 0,
            self.Longitude = 0
        }
    }
});