var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');
var User = require('../user');
var eCookie = require('../cookies').eCookie;

var debug = Debug('routing:submitPseudo');
debug.log = console.log.bind(console)
error = Debug('routing:submitPseudo')

var onlineUsers = [];

router.post('/', function(req, res, next) {
  var newUser = new User();
  var sameName = false;
  var name = req.body.pseudo;

  //debug(`params: ${util.inspect(req.body, true, null, true)}`);    

  try {
    for (var u of onlineUsers) {
      if (u.name == name) {
        debug('user already in list')
        sameName = true;
        break;
      }
    }

    if (sameName == false) {
      debug('new user, creating cookie')
      newUser.name = name;
      onlineUsers.push(newUser);
      var userSession = eCookie({pseudo: name});

      debug(`setting cookie userSession: ${userSession}`);
      res.cookie('userSession', userSession);
    }
  }
  catch(e) {
    error(e)
  }

  res.redirect('/session');
});

module.exports = router;
