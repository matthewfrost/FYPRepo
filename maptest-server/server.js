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
    server: '192.168.1.73',

    options: { port: 49175, database: 'FYPractice', rowCollectionOnRequestCompletion: true }
};

var connection = new Connection(config);

connection.on('connect', function (err) {
    console.log("connected");
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
                var tag = new Tag(columns[0].value, columns[1].value, columns[2].value, columns[3].value, columns[4].value);
                json.push(tag);
            });
            console.log("here")
            res.json(json);
            json = [];
        }

    });
    connection.execSql(request);
});

var deleteTag = function (id) {
    var sql = 'dbo.Location_Delete';
    debugger;
    var request = new Request(sql, function (err) {

    });

    request.addParameter('ID', types.Int, id);
    connection.callProcedure(request);
}

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
        var sql = 'dbo.Location_Merge';
        var request = new Request(sql, function (err, rowCount, rows) {
            var item = rows[0];

            res.json(item[0].value);
        });

        request.addParameter('ID', types.Int, item.ID);
        request.addParameter('Name', types.VarChar, item.Name);
        request.addParameter('TagName', types.VarChar, item.Tag);
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