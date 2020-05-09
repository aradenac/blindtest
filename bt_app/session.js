
const MongoClient = require('mongodb').MongoClient;
const {ObjectId} = require('mongodb');
const {compareTwoStrings} = require('string-similarity');
const assert = require('assert');
const url = 'mongodb://192.168.0.10:27017';

class Session {
    constructor(){
        const client = new MongoClient(url);
        this.players = [];
        this.songs = [];
        this.songIdx = 0;
        this.runningGame = false;

        client.connect()
        .then((client)=>{
            //assert.equal(null, err);
            if (client == null) {
                console.log(err);
                return Promise.reject();
            }

            const db = client.db('blindtest');
            var playlists = db.collection('playlists');

            playlists.findOne({name: 'testPlaylist'})

            .then((playlist)=>{
                console.log(`from db playlist ${playlist.name}`);

                var promises = [];
                var musics = db.collection('musics');

                for (var songID of playlist.songIDs) {
                    var promise;
                    promise = musics.findOne({_id: new ObjectId(songID)}).then( (song)=>{
                        this.songs.push(song);
                    });

                    promises.push(promise);
                }

                return Promise.all(promises);
            })
            .then(()=>{
                console.log("startGame and close db")
                this.startGame();
                client.close();
            })
        })
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
        var currentSong = this.songs[this.songIdx];
        var result = false;

        player = this.playerByName(name);

        console.log(`${name} answer: ${answer}`)

        var similarity = compareTwoStrings(answer.toLowerCase(), currentSong.artist.toLowerCase());

        if (similarity > 0.5) {
            result = true;
        }

        player.socket.emit('answerResponse', result);
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