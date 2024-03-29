$(document).ready(function(){

    playlistTemplate = _.template($('#playlist-template').html());
    
    var Playlist = Backbone.Model.extend({
       defaults: {
         "name": "truc muche"
       }
    })
  
    var Playlists = Backbone.Collection.extend({
      model: Playlist,
      url: '/api/playlists',
      initialize: function(){
        this.fetch();
      }
    })
  
    var playlists = new Playlists;
  
    var PlaylistView = Backbone.View.extend({
      tagName: "tr",
      initialize: function(){
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.remove);
      },
      render: function() {
        this.$el.html(playlistTemplate(this.model.toJSON()));
        return this;
      },
      
      events: {
        "click .deletePlaylistButton": "clear",
        "click .editButton": "edit"
      },

      edit: function() {
        playlistAppView.editPlaylist(this.model)
      },

      clear: function(e){
        this.model.destroy();
      }
    })


    var PlaylistAppView = Backbone.View.extend({
      el: "#ctnr-app-playlist-mngr",

      currentView: null,

      fragmentsIds:  {
        $songs: $('#songs'),
        $modifyPlaylists: $('#modify-playlists'),
        $formSong: $('#form-song'),
        $playlists: $('#playlists')
      },

      displayFragment: function ($fragment){
          $('#fragments > div').hide();
          $fragment.show();
      },

      editPlaylist: function(playlistModel) {
        this.displayFragment(this.fragmentsIds.$modifyPlaylists) 
      },
  
      initialize: function(){
        this.displayQueryView()
      },

      displayQueryView: function(){
        this.displayFragment(this.fragmentsIds.$playlists)
        this.currentView = new PlaylistQueryView
      }
  
    })
  
    var PlaylistQueryView = Backbone.View.extend({
      el: "#tbody-playlist-ctnr",
  
      initialize: function(){
        this.listenTo(playlists, 'add', this.addOne)
      },
  
      addOne: function(playlistModel) {
        var view = new PlaylistView({model: playlistModel});
        newEl = view.render().el
        $("#tbody-playlist-ctnr").append(newEl);
      }
    })
  
    var playlistAppView = new PlaylistAppView;


});
  
