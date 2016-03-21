var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var mongoURL = 'mongodb://localhost:27017/test';
var Twitter = require('twitter');
var counter = 0;

var client = new Twitter({
  consumer_key: 'KXdzujUy8NHjC1h2obqNPtMVL',
  consumer_secret: '7f24ZangnSfEx14iJ1MsghO5AuoHHZJHTLiazNiznthdTfuKJE',
  access_token_key: '14812487-06dGq8Lr1VkKZS21iuuZ0tr36tg5oi9yycWFcjpnV',
  access_token_secret: 'fFFOlemWQbnS7n56rtppDLR0TCy4zrrgmheL81abj6vA2',
});
//console.log(consumer_key +" : "+ consumer_secret +" : "+ access_token_key +" : "+ z)
/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/

// europe '35.47,-20.65,72.16, 43.02'
// uk 49.90, -13.52, 61.52, 1.14'
client.stream('statuses/filter', {location: '35.47,-20.65,72.16, 43.02'},  function(stream){

  stream.on('data', function(tweet) {
    checkContent(tweet, function(){
      MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        insertDocument(db,tweet, function() {
          db.close();
        });
      });
    });
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

var checkContent = function (tweet, callback) {
    if(tweet.text.indexOf('brexit')){
      callback();
    }
    else(tweet.text.indexOf('bremain')){
      callback();
    }
};

var insertDocument = function(db, newtweet, callback) {
   db.collection('tweets').insertOne( newtweet, function(err, result) {
    assert.equal(err, null);
    //console.log("Inserted a document into the tweets collection.");
    callback();
  });
};