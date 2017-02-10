var Map = $.extend(true, {}, Map, {
    Model: {
        Column: function () {
            var self = this;

            self.Name = ko.observable(null);
        }
    }
});