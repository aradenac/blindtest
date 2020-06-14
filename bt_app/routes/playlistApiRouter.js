var express = require('express');
var router = express.Router();
const {ObjectId, MongoClient} = require('mongodb');
const Debug = require('debug');
const util = require('util');

var debug = Debug('playlistApi');
debug.log = console.log.bind(console);
var error = Debug('playlistApi:error');

router.get('/', function(req, res, next) {

  try{
    const client = new MongoClient('mongodb://192.168.0.10:27017', {useNewUrlParser:true, useUnifiedTopology:true});

    debug('connecting to the client');

    client.connect()
    .then((client)=>{
      debug('connected to db client');

      debug(`opening collection 'blindtest.playlists'`);
      const db = client.db('blindtest');
      var playlists = db.collection('playlists');

      let collectionCursor = playlists.find()
      collectionCursor.toArray()
      .then( (playlistArray) => {
        res.send(JSON.stringify(playlistArray));
      })

    })
    .catch( (err) => {
      error(err);
    });

  }
  catch(e){
    error(e);
  }

})

module.exports = router;
