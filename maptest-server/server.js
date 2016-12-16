var Connection = require('tedious').Connection;
var Tag = require("./tag.js");
var express = require('express');
var app = express();
var json = [];

var config = {
    userName: 'FYPracticeDev',
    password: 'password',
    server: '192.168.56.1',
    
    options: {port: 49175, database: 'FYPractice', rowCollectionOnRequestCompletion: true}
  };

  var connection = new Connection(config);

  var Request = require('tedious').Request;

  connection.on('connect', function(err) {
        console.log("connected");
    }
  );

  app.all('*', function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
  });

  app.get('/getAll', function (req, res) {
      request = new Request("select * from Location", function(err, rowCount, rows) {
      if (err) {
        console.log(err);
      } else {
          var rowArray = [];
          rows.forEach(function(columns){
                var tag = new Tag(columns[0].value,columns[1].value, columns[2].value, columns[3].value, columns[4].value);
                json.push(tag);
          });
          res.json(json);
          json = [];
      }
      
    });
    connection.execSql(request);     
  });

  app.listen(process.env.PORT || '8081');

  exports = module.exports = app;