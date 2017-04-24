var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var Tag = require("./tag.js");
var express = require('express');
var app = express();
var parser = require('body-parser');
var types = require('tedious').TYPES;
var password = process.argv[2];

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(parser.urlencoded({
    extended: true
}));

app.use(parser.json());
var json = [];

//SQL config
var config = {
    userName: 'FYPracticeDev',
    password: password,
    server: '192.168.1.73',

    options: { port: 49175, database: 'FYPractice', rowCollectionOnRequestCompletion: true }
};

var connection = new Connection(config);

connection.on('connect', function (err) {
    console.log(password);
    console.log("connected");
});

app.get('/getSchema', function (req, res) {
    var db, table;
    var data = req.query;

    db = data.database;
    table = data.table;
    var sql = 'dbo.TableSchema_Get'

    request = new Request(sql, function (err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            var rowArray = [];
            rows.forEach(function (columns) {
                //var tag = new Tag(columns[0].value, columns[1].value, columns[2].value, columns[3].value, columns[4].value);
                json.push({
                    columnName: columns[0].value
                });
            });
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||req.socket.remoteAddress || req.connection.socket.remoteAddress;
            console.log("here " + ip);
            res.json(json);
            json = [];
        }

    });
    request.addParameter('Database', types.VarChar, db);
    request.addParameter('Table', types.VarChar, table);
    connection.callProcedure(request);

});


app.get('/getAll', function (req, res) {
    request = new Request("select * from Location where DeletedOn is null", function (err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            var rowArray = [];
            rows.forEach(function (columns) {
                var tag = new Tag(columns[0].value, columns[1].value, columns[2].value, columns[3].value, columns[4].value, columns[5].value, columns[6].value, columns[7].value);
                json.push(tag);
            });
            console.log("here")
            res.status(200).send(json);
            //res.sendStatus(200);
            json = [];
        }

    });
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    console.log("here " + ip);
    connection.execSql(request);
});

var deleteTag = function (id, res) {
    var sql = 'dbo.Location_Delete';
    var request = new Request(sql, function (err) {
        if (err) {
            res.sendStatus(500);
        }
        else {
            res.sendStatus(200);
        }
    });

    request.addParameter('ID', types.Int, id);
    connection.callProcedure(request);
}

app.get('/getByLocation', function (req, res) {
    var data = req.query;
    var latitude, longitude, posLat, posLong, negLat, negLong, earthRadius, sql;
    var LatDiff, LongDiff

    latitude = parseFloat(data.lat);
    longitude = parseFloat(data.long);
    earthRadius = 6378;

    posLat = latitude + (0.1 / earthRadius) * (180 / Math.PI);
    posLong = longitude + (0.1 / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
    negLat = latitude + (-0.100 / earthRadius) * (180 / Math.PI);
    negLong = longitude + (-0.100 / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);

    sql = 'dbo.Location_GetByLocation';

    request = new Request(sql, function (err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            var rowArray = [];
            rows.forEach(function (columns) {
                var tag = new Tag(columns[0].value, columns[1].value, columns[2].value, columns[3].value, columns[4].value, columns[5].value, columns[6].value, columns[7].value);
                json.push(tag);
            });
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
            console.log("here " + ip);
            res.json(json);
            json = [];
        }

    });

    request.addParameter('Latitude1', types.Float, negLat);
    request.addParameter('Latitude2', types.Float, posLat);
    request.addParameter('Longitude1', types.Float, negLong);
    request.addParameter('Longitude2', types.Float, posLong);

    connection.callProcedure(request);
});

app.put('/delete', function (req, res) {
    var id;
    debugger;
    id = req.body;

    deleteTag(id.data, res);
    //res.sendStatus(200);
});

app.post('/submit', function (req, res) {
    var item;
    item = req.body;

    var createTag = function (item) {
        var sql = 'dbo.Location_Merge';
        var request = new Request(sql, function (err, rowCount, rows) {
            var item = rows[0];
            if (err) {
                res.json(500);
            }
            else {
                res.json(item[0].value);
            }
        });

        request.addParameter('ID', types.Int, item.ID);
        request.addParameter('Name', types.VarChar, item.LocationName);
        request.addParameter('ValueName', types.VarChar, item.ColumnValue);
        request.addParameter('Database', types.VarChar, item.Database);
        request.addParameter('Table', types.VarChar, item.Table);
        request.addParameter('Column', types.VarChar, item.Column);
        request.addParameter('Latitude', types.Float, item.Latitude);
        request.addParameter('Longitude', types.Float, item.Longitude);
        //request.addOutputParameter('ID', types.Int);

        request.on('returnValue', function (parameterName, value, metadata) {
            res.json["{'ID': " + value + "}"];
        });

        connection.callProcedure(request);
    }
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    console.log("here " + ip);
    createTag(item);


    //res.sendStatus(200);
});

//app.post('/submitResolution', function (req, res) {
//    var data, sql, request;
//    console.log("submit");
//    data = req.body;

//    sql = 'dbo.submitResolution';

//    request = new Request(sql, function (err, rowCount, rows) {

//    });

//    request.addParameter('LocationID', types.Int, data.LocationID);
//    request.addParameter('Value', types.BigInt, data.Value);
//    request.addParameter('Resolution', types.VarChar, data.Resolution);

//    connection.callProcedure(request);
//});

app.listen(process.env.PORT || '8081');

exports = module.exports = app;