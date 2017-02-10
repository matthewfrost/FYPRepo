var Map = $.extend(true, {}, Map, {
    ViewModel: {
        Index: function () {
            var self = this;

            self.locations = [];
            self.locationDetails = ko.observableArray([]);
            self.selectedLocation = ko.observable({});
            self.newLocation = ko.observable(true);
            self.currentLat = 0;
            self.currentLong = 0;
            self.locationIndex = ko.observable(null);
            self.database = ko.observable(null);
            self.table = ko.observable(null);
            self.column = ko.observable(null);
            self.value = ko.observable(null);
            self.tableColumns = ko.observableArray([]);

            self.deleteLocation = function () {
                
            }

            self.getSchema = function () {
                var data = {
                    database: ko.mapping.toJS(self.database()),
                    table: ko.mapping.toJS(self.table())
                }

                Map.Controller.getSchema({
                    database: ko.mapping.toJS(self.database()),
                    table: ko.mapping.toJS(self.table()),
                    success: success
                });

                function success(data, status, jqxhr) {
                    var column;
                    for (var i = 0; i < data.length; i++) {
                        var current = data[i];
                        column = new Map.Model.Column();
                        column.Name(current.columnName);
                        self.tableColumns.push(column);
                    }
                }
            }
        }
    }
});