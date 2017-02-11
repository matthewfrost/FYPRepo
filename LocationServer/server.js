var SQL = require('tedious');
var express = require('express');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var parser = require('body-parser');
var app = express();
var TagData = require('./TagData.js');
var types = require('tedious').TYPES;

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

app.get('/getData', function(req,res){
    var db, table, column, columnValue;

    var data = req.query;

    db = data.database;
    table = data.table;
    column = data.column;
    columnValue = data.columnValue;

    var query = "dbo.GetData"

    request = new Request(sql, function (err, rowCount, rows) {
        if (err) {
            console.log(err);
        } else {
            var rowArray = [];
            rows.forEach(function (columns) {
                var tagData = new TagData(columns[0].value, columns[1].value, columns[2].value, columns[3].value);
                json.push(tagData);
            });
            console.log("here")
            res.json(json);
            json = [];
        }

    });
    request.addParameter('Database', types.VarChar, db);
    request.addParameter('Table', types.VarChar, table);
    request.addParameter('Column', types.VarChar, column);
    request.addParameter('ColumnValue', types.VarChar, columnValue);

    connection.callProcedure(request);
});

app.listen(process.env.PORT || '8081');

exports = module.exports = app;