$(() => {
    window.enregistrerPlaylist = () => {
        //envoi en bd et rafraichissement de la page avec les modif
    }

    window.modifierPlaylist = () => {
        displayFragment(fragmentsIds.$modifyPlaylists)
    }

    window.creerPlaylist = () => {
        displayFragment(fragmentsIds.$modifyPlaylists)
        //à voir comment on fait pour une liste vierge
    }

    window.supprimerPlaylist = () => {
        displayFragment(fragmentsIds.$playlists)
        //suppression en bd et rafraichissement de la page sans la playlist
    }

    window.afficherChansonsBd = () => {
        displayFragment(fragmentsIds.$songs)
    }

    window.supprimerChansonPlaylist = () => {
        //suppression en bd et rafraichissement de la page sans la chanson
    }

    window.afficherPlaylist = () => {
        displayFragment(fragmentsIds.$playlists)
    }

    window.supprimerChansonBd = () => {
        //suppression en bd et rafraichissement de la page sans la chanson
    }

    window.ajouterChansonBd = () => {
        displayFragment($formSong);
        
    }

    function displayFragment($fragment){
        $('#fragments > div').hide();
        $fragment.show();
    }

    var fragmentsIds = {
        $songs: $('#songs'),
        $modifyPlaylists: $('#modify-playlists'),
        $formSong: $('#form-song'),
        $playlists: $('#playlists')
    }

    displayFragment(fragmentsIds.$playlists);

});