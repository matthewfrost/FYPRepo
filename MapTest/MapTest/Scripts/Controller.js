﻿var Map = $.extend(true, {}, Map, {
    Controller: {
        // url: '/api/Location',
        url: 'http://localhost:8081',
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
        }
    }
});