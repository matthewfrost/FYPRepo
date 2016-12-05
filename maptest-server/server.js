var Connection = require('tedious').Connection;
var Tag = require("./tag.js");
var express = require('express');
var app = express();
var json = [];
var config = {
    userName: 'MatthewDev',
    password: 'Elliot1995',
    server: '192.168.1.77',
    
    options: {database: 'FYPractice', rowCollectionOnRequestCompletion: true}
  };

  var connection = new Connection(config);

  var Request = require('tedious').Request;

  connection.on('connect', function(err) {
    // If no error, then good to go...
        console.log("connected");
        //executeQuery();
    }
  );

  app.get('/getAll', function (req, res){
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
      }
      
    });
    connection.execSql(request);
      
  });

  app.listen(process.env.PORT || '8081');

  exports = module.exports = app;