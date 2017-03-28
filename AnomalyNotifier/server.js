var express = require('express');
var tedious = require('tedious');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var Parser = require('parser');
var app = express();
var password = process.argv[2];

var config = {
    userName: 'MatthewDev',
    password: password,
    server: '192.168.1.77',
    options: {
        port: 1433,
        database: 'FYPractice',
        rowCollectionOnRequestCompletion: true
    }
}

var connection = new Connection(config);

connection.on('connect', function (err) {
    console.log("connected");
});

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var json = [];
app.use(parser.urlencoded({
    extended: true
}));
app.use(parser.json());

app.get('/getAnomalies', function (req, res) {
    var lat, long, posLat, posLong, negLat, negLong;

    var url = req.query;

    lat = parseFloat(url.lat);
    long = parseFloat(url.long);

    earthRadius = 6378;

    posLat = latitude + (0.1 / earthRadius) * (180 / Math.PI);
    posLong = longitude + (0.1 / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
    negLat = latitude + (-0.100 / earthRadius) * (180 / Math.PI);
    negLong = longitude + (-0.100 / earthRadius) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);


});