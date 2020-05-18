var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');

var debugCookies = Debug('cookies');

router.get('/', function(req, res, next) {
  debugCookies('Cookies:')
  debugCookies(`${util.inspect(req.cookies)}`); 
  if ('userSession' in req.cookies) {
    debugCookies('session cookie ok')
    res.render('session');
  }
  else {
    debugCookies('session cookie Nok');
    res.render('choosePseudo');
  }
});

module.exports = router;
