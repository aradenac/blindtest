var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');

router.post('/', (req, res, next)=> {
    res.send('prout')
});

router.get('/', (req, res, next)=> {
    res.send('ok')
});

router.delete('/', (req, res, next)=> {
    res.send('boubou')
});

module.exports = router;