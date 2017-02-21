var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var Tag = require("./tag.js");
var express = require('express');
var app = express();
var parser = require('body-parser');
var types = require('tedious').TYPES;

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
    password: 'password',
    server: '152.105.197.153',

    options: { port: 49175, database: 'FYPractice', rowCollectionOnRequestCompletion: true }
};

var connection = new Connection(config);

connection.on('connect', function (err) {
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
            console.log("here")
            res.json(json);
            json = [];
        }

    });
    request.addParameter('Database', types.VarChar, db);
    request.addParameter('Table', types.VarChar, table);
    connection.callProcedure(request);

});

//Mongo config
//var MongoClient = require('mongodb').MongoClient;
//var assert = require('assert')
//var url = 'mongodb://localhost:27017/TagsDb';
//var mongo;

//MongoClient.connect(url, function (err, db) {
//    assert.equal(null, err);
//    console.log("Connected successfully to server");
//    mongo = db;
//    //db.close();
//});

//var getAllTags = function (db, callback) {
//    var collection = db.collection('tags');
//    collection.find({}).toArray(function (err, docs) {
//        assert.equal(err, null);
//        callback(docs);
//    });
//}

//var createTag = function (item, db, callback) {
//    var collection = db.collection('tags');
//    var tag = { Name: item.Name, tag_name: item.TagName, Latitude: item.Latitude, Longitude: item.Longitude };
//    collection.insert([tag], function (err, result) {
//        if (err) {

//        }
//        else {
//            console.log("inserted");
//        }
//    });
//}

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
            res.json(json).status(200);
            //res.sendStatus(200);
            json = [];
        }

    });
    connection.execSql(request);
});

var deleteTag = function (id) {
    var sql = 'dbo.Location_Delete';
    var request = new Request(sql, function (err) {

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
            console.log("here")
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

    deleteTag(id.data);
    res.sendStatus(200);
});

app.post('/submit', function (req, res) {
    var item;
    item = req.body;

    var createTag = function (item) {
        debugger;
        var sql = 'dbo.Location_Merge';
        var request = new Request(sql, function (err, rowCount, rows) {
            var item = rows[0];

            res.json(item[0].value);
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

    createTag(item);


    //res.sendStatus(200);
});

app.listen(process.env.PORT || '8081');

exports = module.exports = app;