const MongoClient = require('mongodb').MongoClient;
const {ObjectId} = require('mongodb');
const {compareTwoStrings} = require('string-similarity');
const assert = require('assert');
const Debug = require('debug');
const util = require('util');
const {encode, decode} = require('./cookies');

const url = 'mongodb://192.168.0.10:27017';
const debug = Debug('Session');
var error = Debug('Session:error');

class Session {
  constructor(){
    const client = new MongoClient(url);
    this.players = [];
    this.songs = [];
    this.songIdx = 0;
    this.runningGame = false;

    debug(`connection to mongodb server ${url}`); 

    client.connect()
      .then((client)=>{
        //assert.equal(null, err);
        if (client == null) {
          debug(err);
          return Promise.reject();
        }

        debug(`opening collection 'blindtest.playlists'`);
        const db = client.db('blindtest');
        var playlists = db.collection('playlists');


        playlists.findOne({name: 'testPlaylist'})

          .then((playlist)=>{
            var promises = [];
            debug(`opening blindtest.musics`);
            var musics = db.collection('musics');

            for (var songID of playlist.songIDs) {
              var promise;

              promise = musics.findOne({_id: new ObjectId(songID)}).then( (song)=>{
                debug(`add song ${song.title} (${song.artist})`);
                this.songs.push(song);
              });

              promises.push(promise);
            }

            return Promise.all(promises);
          })
          .then(()=>{
            debug("startGame and close db")
            this.startGame();
            client.close();
          })
          .catch((err)=>{
            error(err);
          } );
      })
  }

  addPlayer(player) {
    debug(`adding player ${ util.inspect(player, true, 0, true)} }`);

    var p = this.playerByName(player.name);

    if (p) {
      p.socket = player.socket;
      debug('user exists');
    }
    else {
      this.players.push(player);
      debug('appending player');
    }

    debug('declare submitAnswer socketio event');
    player.socket.on('submitAnswer', (this.submitAnswer).bind(this));
  }

playerByName(name){
  var player = null;
  for (var p of this.players){
    if (p.name == name) {
      player = p;
      break;
    }
  }
  return player;
}

delPlayer(name) {
  var idx;

  for (idx in this.players){
    var p = this.players[idx];
    if (p.name == name) {
      break;
    }
  }

  debug(`deleting player ${name} at index ${idx}`);

  this.players = this.players.splice(idx, 1);
}

submitAnswer(params) {
  var answer = params.answer;
  var player;
  var name;
  var currentSong = this.songs[this.songIdx];
  var result = false;

  debug(`submitAnswer params: ${util.inspect(params)}`);

  var userSession = decode(params.userSession);
  debug(`userSession: ${userSession}`);

  var name = userSession.pseudo;


  player = this.playerByName(name);

  debug(`${name} answer: ${answer}`);

  var similarity = compareTwoStrings(answer.toLowerCase(), currentSong.artist.toLowerCase());

  if (similarity > 0.5) {
    result = true;
  }

  debug(`similarity ${similarity} result is ${result}`);

  player.socket.emit('answerResponse', result);
}
startGame(){
  debug('(re)starting game');
  this.songs.sort(() => Math.random() - 0.5);
  this.songIdx = 0;
  this.startSong();
  this.runningGame = true;
}
emitAll(eventName, params) {
  debug(`emit socketio event ${eventName} to each individually`);
  for (var p of this.players) {
    p.socket.emit(eventName, params);
  }
}
startSong(){
  var timeout = 30000; 
  var song = this.songs[this.songIdx];
  /*notify all players*/
  this.emitAll('startSong', song.file)
  setTimeout((this.stopSong).bind(this), timeout);
  debug(`Starting song ${song.file} for ${timeout/1000}s`);
}
getSong(){
  return this.songs[this.songIdx];
}
stopSong(){
  /*notify all players*/
  this.emitAll('stopSong');

  if (this.songIdx >= this.songs.length-1){
    this.emitAll('startGame');
    this.startGame();
  } else {
    this.songIdx++; 
    this.startSong();
  }
}

}

module.exports = Session;
