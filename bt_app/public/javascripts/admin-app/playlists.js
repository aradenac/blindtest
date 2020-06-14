$(document).ready(function(){

    playlistTemplate = _.template($('#playlist-template').html());
    
    var Playlist = Backbone.Model.extend({
       defaults: {
         "title": "truc muche"
       }
    })
  
    var Playlists = Backbone.Collection.extend({
      model: Playlist,
      url: '/admin/playlists'
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
      },

      clear: function(e){
        this.model.destroy();
      }
    })
  
    var PlaylistAppView = Backbone.View.extend({
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
  
    var playlistApp = new PlaylistAppView;

    playlists.add([
      {title: "playlist1"},
      {title: "playlist2"}
    ])

});
  