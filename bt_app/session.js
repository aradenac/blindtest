
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://192.168.0.10:27017';
const dbName = 'blindtest';

class Session {
    constructor(){
        const client = new MongoClient(url);
        this.players = [];
        this.songs = [];
        this.songIdx = 0;
        this.runningGame = false;
        client.connect(function(err){
            assert.equal(null, err);
            const db = client.db(dbName);
            var musics = db.collection("musics");
            musics.find({}).toArray(((err, songs) =>{
                this.songs = songs;
                this.startGame();
            }).bind(this));
            console.log("Connected to database");
        }.bind(this));
    }
    
    addPlayer(player) {

        var p = this.playerByName(player.name);

        if (p) {
            p.socket = player.socket;
            console.log('user exists');
        }
        else {
            this.players.push(player);
            console.log('appending player');
        }
        
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
        
        this.players = this.players.splice(idx, 1);
    }
    submitAnswer(params) {
        var answer = params.answer;
        var name = params.name;
        var player;

        player = this.playerByName(name);

        console.log(`${name} answer: ${answer}`)
        player.socket.emit('answerResponse', 'false');
    }
    startGame(){
        this.songIdx = 0;
        this.startSong();
        this.runningGame = true;
    }
    emitAll(eventName, params) {
        for (var p of this.players) {
            p.socket.emit(eventName, params);
        }
    }
    startSong(){
        var song = this.songs[this.songIdx];
        /*notify all players*/
        this.emitAll('startSong', song.file)
        setTimeout((this.stopSong).bind(this), 30000);
        console.log(`Starting song ${song.file}`);
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