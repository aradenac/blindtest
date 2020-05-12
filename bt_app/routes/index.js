var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');

var debugCookies = Debug('cookies');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
