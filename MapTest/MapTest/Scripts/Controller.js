var Map = $.extend(true, {}, Map, {
    Controller: {
        url: '/api/Location',
        save: function (options) {
            $.ajax({
                url: Map.Controller.url,
                type: 'POST',
                success: options.success,
                data: options.data,
                contentType: 'application/json'
            });
        },

        get: function (options) {
            $.ajax({
                url: Map.Controller.url,
                type: 'GET',
                success: options.success,
                contentType: 'application/json'
            });
        }
    }
});