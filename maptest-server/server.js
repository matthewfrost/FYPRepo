//var Connection = require('tedious').Connection;
var Tag = require("./tag.js");
var express = require('express');
var app = express();
var json = [];

//SQL config
// var config = {
//     userName: 'FYPracticeDev',
//     password: 'password',
//     server: '192.168.56.1',
    
//     options: {port: 49175, database: 'FYPractice', rowCollectionOnRequestCompletion: true}
//   };

//   var connection = new Connection(config);


  //var Request = require('tedious').Request;

  // connection.on('connect', function(err) {
  //       console.log("connected");
  //   }
  // );

//Mongo config
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var url = 'mongodb://localhost:27017/TagsDb';
var mongo;

  MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  mongo = db;
  //db.close();
});

var getAllTags = function(db, callback){
  var collection = db.collection('tags');
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var createTag = function(item, db, callback){
  var collection = db.collection('tags');
  var tag = {Name: item.Name, tag_name: item.TagName, Latitude: item.Latitude, Longitude: item.Longitude};
  collection.insert([tag], function(err, result){
    if(err){

    }
    else{
      console.log("inserted");
    }
  });
}

  app.all('*', function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
  });

  app.get('/getAll', function (req, res) {
      //request = new Request("select * from Location", function(err, rowCount, rows) {
      // if (err) {
      //   console.log(err);
      // } else {
          var rowArray = [];
          // rows.forEach(function(columns){
          //       var tag = new Tag(columns[0].value,columns[1].value, columns[2].value, columns[3].value, columns[4].value);
          //       json.push(tag);
          // });
          console.log("here")
         // console.log(getAllTags(mongo, toTag))
          
          var toTag = function(docs){
            var current, tag, result;
            result = [];
            for(var i = 0; i < docs.length; i++){
              current = docs[i];
              console.log(current.Name);
              tag = new Tag(current._id, current.Name, current.tag_name, current.Latitude, current.Longitude);
              result.push(tag);
              //tag = new Tag(current)
            }
            res.json(result);
          }

          getAllTags(mongo, toTag);
          //res.json(getAllTags(mongo, toTag));
          json = [];
//      }
      
 //   });
    //connection.execSql(request);     
  });

  app.post('/submit', function(req, res){
    var item = req.body;

    createTag(item, mongo);
  });

  app.listen(process.env.PORT || '8081');

  exports = module.exports = app;