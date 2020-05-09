class Session {
    constructor(){
        this.players = [];
        this.songs = ["./public/music/m1.mp3", "./public/music/m2.mp3"];
        this.songIdx = 0;
        this.runningGame = false;
    }
    addPlayer(player) {
        this.players.push(player);
    }
    startGame(){
        this.songIdx = 0;
        this.startSong();
        this.runningGame = true;
    }
    startSong(){
        /*notify all players*/
        setTimeout(stopSong, 30000);
    }
    getSong(){
        return this.songs[this.songIdx];
    }
    stopSong(){
        /*notify all players*/
        if (this.songIdx >= this.songs.length-1){
            /*notify all plauers*/
            this.startGame();
        } else {
            this.songIdx++; 
            this.startSong();
        }
    }

}