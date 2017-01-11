var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var shortid = require('shortid');

// Removes _ and - in the string generated to the user
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var validUrl = require('valid-url');

var port = process.env.PORT || 27017;
var ip = process.env.IP;

var mLab = "mongodb://heroku_bfkb5q1k:4fiatmu7c43if6tib8mrnsaqmj@ds161518.mlab.com:61518/heroku_bfkb5q1k";
var MongoClient = mongodb.MongoClient;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* Get new short URL */
router.get('/new/:url(*)', function (req, res, next) {
    MongoClient.connect(mLab, function (err, db) {
  if (err) {
    console.log("Unable to connect to server", err);
  } else {
    console.log("Connected to server")
    
    var collection = db.collection('links');
    var params = req.params.url;
    var local = req.get('host'); + "/"
    
    var newLink = function (db, callback) {
            collection.findOne({ "url": params }, { short: 1, _id: 0 }, function (err, doc) {
        if (doc != null) {
            res.json({ original_url: params, short_url: local + doc.short });
          } else {
        if (validUrl.isUri(params)) {
            // if URL is valid, do this
            var shortCode = shortid.generate();
            var newUrl = { url: params, short: shortCode };
            collection.insert([newUrl]);
            res.json({ original_url: params, short_url: local + shortCode });
            } else {
            // if URL is invalid, do this
            res.json({ error: "This does not look like a valid URL, try again." });
            };
        };
    });
};
 
        newLink(db, function () {
            db.close();
        });
    };
  });
});


router.get('/:short', function (req, res, next) {
 
  MongoClient.connect(mLab, function (err, db) {
    if (err) {
      console.log("Unable to connect to server", err);
    } else {
      console.log("Connected to server")
 
      var collection = db.collection('links');
      var params = req.params.short;
 
      var findLink = function (db, callback) {
          collection.findOne({ "short": params }, { url: 1, _id: 0 }, function (err, doc) {
            if (doc != null) {
            res.redirect(doc.url);
            } else {
             res.json({ error: "We did not find that shortlink in the database." });
                };
        });
      };
 
      findLink(db, function () {
        db.close();
      });
 
    };
  });
});

module.exports = router;
