var express = require('express');
var tedious = require('tedious');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var parser = require('body-parser');
var app = express();
var password = process.argv[2];
var types = require('tedious').TYPES;
var Location = require("./Location.js");

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

var config = {
    userName: 'FYPracticeDev',
    password: password,
    server: '192.168.1.73',
    options: {
        port: 49175,
        database: 'FYPractice',
        rowCollectionOnRequestCompletion: true
    }
}

var connection = new Connection(config);

connection.on('connect', function (err) {
    console.log("connected");
});

app.post('/submitResolution', function (req, res) {
    var data, sql, request;
    console.log("submit");
    data = req.body;
    console.log(data);
    console.log(req);
    sql = 'dbo.submitResolution';

    request = new Request(sql, function (err, rowCount, rows) {

    });

    request.addParameter('LocationID', types.Int, data.LocationID);
    request.addParameter('Value', types.BigInt, data.Value);
    request.addParameter('Resolution', types.VarChar, data.Resolution);

    connection.callProcedure(request);
});

app.get('/getAnomalies', function (req, res) {
    var lat, long, posLat, posLong, negLat, negLong, sql, request, data, currentLocation, currentIndex;

    var url = req.query;

    lat = parseFloat(url.lat);
    long = parseFloat(url.long);

    earthRadius = 6378;

    posLat = lat + (0.1 / earthRadius) * (180 / Math.PI);
    posLong = long + (0.1 / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
    negLat = lat + (-0.100 / earthRadius) * (180 / Math.PI);
    negLong = long + (-0.100 / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

    sql = 'dbo.getAnomalyLocations'
    data = [];
    currentLocation = '';
    currentIndex = -1;
    request = new Request(sql, function (err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            var rowArray = [];
            rows.forEach(function (columns) {
                var location = new Location(columns[0].value, columns[1].value, columns[2].value, columns[3].value);
                if(location.Name != currentLocation){
                    data.push([]);
                    currentLocation = location.Name;
                    currentIndex++;
                }
                data[currentIndex].push(location);
            });

            for(var i = 0; i < data.length; i++){
                calculateStDev(data[i]);
            }

            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
            console.log("here " + ip);
            res.json(json);
            json = [];
        }

    });

    request.addParameter('negLat', types.Float, negLat);
    request.addParameter('posLat', types.Float, posLat);
    request.addParameter('negLong', types.Float, negLong);
    request.addParameter('posLong', types.Float, posLong);

    connection.callProcedure(request);
});

function calculateStDev(data) {
    var total, mean, diffData, diff, sum;

    total = 0;
    diffData = [];
    for (var i = 1; i < data.length; i++) {
        diff = 0;
        diff = data[i].Data - data[i - 1].Data;
        diffData.push({ Location: data[i].Name, Value: diff, Timestamp: data[i].Timestamp });
        total += diff;
        
    }
    console.log(total);

    mean = total / data.length;
    var x, temp;
    x = 0;
    temp = 0;
    for (var i = 0; i < diffData.length; i++) {
        x = diffData[i].Value - mean;
        temp += Math.pow(x, 2.0);
    }
    
    var y = temp / diffData.length;
    var stdDev = Math.pow(y, 0.5);
    for (var i = 0; i < diffData.length; i++) {
        var current = diffData[i];
        if (current.Value > (mean + (2 * stdDev)) || current.Value < (mean - (2 * stdDev))) {
            json.push(current);
        }
    }
}

app.listen(process.env.PORT || '8083');

exports = module.exports = app;