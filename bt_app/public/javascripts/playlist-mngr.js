$(() => {
    window.enregistrerPlaylist = () => {
        //envoi en bd et rafraichissement de la page avec les modif
    }

    window.modifierPlaylist = () => {
        $ctnr.html(fragmentsIds.$modifyPlaylists.html())
    }

    window.creerPlaylist = () => {
        $ctnr.html(fragmentsIds.$modifyPlaylists.html())
        //à voir comment on fait pour une liste vierge
    }

    window.supprimerPlaylist = () => {
        $ctnr.html(fragmentsIds.$playlists.html())
        //suppression en bd et rafraichissement de la page sans la playlist
    }

    window.afficherChansonsBd = () => {
        $ctnr.html(fragmentsIds.$songs.html())
    }

    window.supprimerChansonPlaylist = () => {
        //suppression en bd et rafraichissement de la page sans la chanson
    }

    window.afficherPlaylist = () => {
        $ctnr.html(fragmentsIds.$playlists.html())
    }

    window.supprimerChansonBd = () => {
        //suppression en bd et rafraichissement de la page sans la chanson
    }

    window.ajouterChansonBd = () => {
        $ctnr.html(fragmentsIds.$formSong.html());
        
    }

    var fragmentsIds = {
        $songs: $('#songs'),
        $modifyPlaylists: $('#modify-playlists'),
        $formSong: $('#form-song'),
        $playlists: $('#playlists')
    }

    var $ctnr = $('#view')

    for (fragmentName of Object.keys(fragmentsIds) )
    {
        var $fragment = fragmentsIds[fragmentName];
        $fragment.hide()
    }

    $ctnr.html(fragmentsIds.$playlists.html())

    $('#view input[alt="ajouter"]').click(() => {
        $ctnr.html(fragmentsIds.$songs.html())
    })

});