var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');

var debugCookies = Debug('cookies');

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

module.exports = router;
