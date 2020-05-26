$(function(){

  songTemplate = _.template($('#songTemplate').html());
  
  var Song = Backbone.Model.extend({
     defaults: {
       "name": "truc muche"
     }
  })


  var Songs = Backbone.Collection.extend({
    model: Song,
    url: '/songs'
  })

  var songList = new Songs;

  var SongView = Backbone.View.extend({
    tagName: "li",
    initialize: function(){
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.remove);
    },
    render: function() {
      this.$el.html(songTemplate(this.model.toJSON()));
      return this;
    },
    events: {
      "click .deleteSongButton": "clear",
      "dblclick .view": "edit",
      "keypress .edit": "updateOnEnter",
      "blur .edit": "close"
    },
    edit: function(){
      console.log('edit mode');
      this.$el.addClass('editing');
      this.$('.edit').focus();
    },
    clear: function(){
      this.model.destroy();
    },
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },
    close: function(){
      this.model.save({name: this.$('.edit').val()});
      this.$el.removeClass("editing");
    }
  })

  var AppView = Backbone.View.extend({
    el: $("#songsPanel"),

    initialize: function(){
      this.listenTo(songList, 'add', this.addOne)

      //Songs.fetch()
    },

    addOne: function(song) {
      var view = new SongView({model: song});
      newEl = view.render().el
      $('#tableSongs').append(view.render().el);
    }
  })

  var app = new AppView;

  songList.add([
    {name: "song1"},
    {name: "song2"}
  ])
});
