$(() => {
    window.enregistrerPlaylist = () => {
        $ctnr.html(fragmentsIds.$formSong.html())
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

    $ctnr.html(fragmentsIds.$modifyPlaylists.html())

    $('#view input[alt="ajouter"]').click(() => {
        $ctnr.html(fragmentsIds.$songs.html())
    })

});