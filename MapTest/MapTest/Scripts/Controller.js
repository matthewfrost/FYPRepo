var Map = $.extend(true, {}, Map, {
    Controller: {
        // url: '/api/Location',
        url: 'http://109.147.44.95:3000',
        save: function (options) {
            $.ajax({
                url: Map.Controller.url + '/submit',
                type: 'POST',
                success: options.success,
                data: options.data,
                contentType: 'application/json'
            });
        },

        get: function (options) {
            $.ajax({
                url: Map.Controller.url + '/getAll',
                type: 'GET',
                success: options.success,
                contentType: 'application/json'
            });
        },

        delete: function (options) {
            $.ajax({
                url: Map.Controller.url + '/delete',
                type: 'PUT',
                success: options.success,
                contentType: 'application/json',
                data: options.data
            });
        },

        getSchema: function (options) {
            $.ajax({
                url: Map.Controller.url + '/getSchema?database=' + options.database + '&table=' + options.table,
                type: 'GET',
                success: options.success,
                contentType: 'application/json',
               // data: options.data
            });
        }
    }
});