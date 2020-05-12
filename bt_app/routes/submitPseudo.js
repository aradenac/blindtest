var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');
var User = require('../user');
const base64url = require('base64url');

var debug = Debug('routing:submitPseudo');

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
      var userSession = base64url.encode(JSON.stringify({pseudo: name}));
      
      debug(`setting cookie userSession: ${userSession}`);
      res.cookie('userSession', userSession);
    }

    res.render('index');
});

module.exports = router;
