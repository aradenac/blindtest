
class Session {
    constructor(){
        this.players = [];
        this.songs = ["music/m1.mp3", "music/m2.mp3"];
        this.songIdx = 0;
        this.runningGame = false;
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
        this.emitAll('startSong', song)
        setTimeout((this.stopSong).bind(this), 30000);
        console.log(`Starting song ${song}`);
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