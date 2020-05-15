var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');
var User = require('../user')
var {dCookie} = require('../cookies')

var error = Debug('index.js')
var debug = Debug('index.js')
debug.log = console.log.bind(console)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});
router.get('/help', function(req, res, next) {
  res.render('help');
});
router.get('/privacy', function(req, res, next) {
  res.render('privacy');
});
router.get('/bugs', function(req, res, next) {
  res.render('bugs');
});
router.get('/suggestions', function(req, res, next) {
  res.render('suggestions');
});
router.get('/privateSession', function(req, res, next) {
  res.render('privateSession');
});

router.get('/admin', (req, res, next) => {
  try{
    var userSession;

    debug(`${util.inspect(req.cookies, false, null, true)}`)

    if ('userSession' in req.cookies) {
      userSession = dCookie(req.cookies.userSession)
    }
    debug(`${util.inspect(userSession, false, null, true)}`)

    if (userSession && userSession.admin == true) {
      var msg="";
      debug('Admin cookie ok') 
      if ('uploadMsg' in req.cookies)
        msg = dCookie(req.cookies.uploadMsg)
      res.render('admin', {uploadMsg: msg})
    }
    else {
      debug('No admin cookie')
      res.render('adminAuth')  
    }
  }
  catch(e){
    error(e)
  }
})

module.exports = router;
