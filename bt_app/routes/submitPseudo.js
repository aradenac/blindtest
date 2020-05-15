var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');
var User = require('../user');
var eCookie = require('../cookies').eCookie;

var debug = Debug('routing:submitPseudo');
debug.log = console.log.bind(console)

var onlineUsers = [];

router.post('/', function(req, res, next) {
    var newUser = new User();
    var sameName = false;
    var name = req.body.pseudo;
    
    debug(`params: ${util.inspect(req.body, true, null, true)}`);    

    for (var u of onlineUsers) {
        if (u.name == name) {
            sameName = true;
            break;
        }
    }
  
    if (sameName == false) {
      newUser.name = name;
      onlineUsers.push(newUser);
      var userSession = eCookie({pseudo: name});
      
      debug(`setting cookie userSession: ${userSession}`);
      res.cookie('userSession', userSession);
    }

    res.redirect('/session');
});

module.exports = router;
