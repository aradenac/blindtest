var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');

var debugCookies = Debug('cookies');

router.get('/', function(req, res, next) {
    debugCookies(`${util.inspect(req.cookies)}`); 
    if ('userSession' in req.cookies) {
        res.render('session');
    }
    else {
        res.render('choosePseudo');
    }
});

module.exports = router;
