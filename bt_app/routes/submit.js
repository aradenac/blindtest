var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');
var multer = require('multer')
var mm = require('music-metadata')
var {eCookie, dCookie} = require('../cookies.js')
var User = require('../user')

var upload = multer({dest: 'upload/'})

var debug = Debug('submit.js')
debug.log = console.log.bind(console)
var error = Debug('submit.js')

router.post('/admin/auth', (req, res, next) => {
  try{
    var name, pwd;
    debug(`${util.inspect(req.body, false, null, true)}`)
    if ('name' in req.body) name = req.body.name;
    if ('password' in req.body) pwd = req.body.password;

    debug(`expected name: ${name} pwd: ${pwd}`)

    if (name == "admin" && pwd == ",;:Pwd899:;,"){
      var cookie;
      debug('admin auth ok')
      cookie = eCookie({admin: true})
      res.cookie('userSession', cookie)
    }
    else {
      debug('admin auth nok')
    }

    res.redirect(302, '/admin')
    
  }
  catch(d){
    error(d)
  }
})

router.post('/song', upload.single('song'), (req, res, next)=> {
  var msg;
  debug(`Uploaded file: ${util.inspect(req.file, false, null, true)}`);
  
  if (req.file) {
    mm.parseFile(req.file.path)
    .then( metadata => {

      debug(`Metadata: ${util.inspect(metadata, true, null, true)}`)

      if (!('title' in metadata.common) || !('artist' in metadata.common)) {
        msg = 'Missing metadata title/artist'
      }
      else {
        msg = `file ${req.file.originalname} successfuly uploaded` 
      }

      res.render('admin', {uploadMsg: msg})
    })
    .catch( err => {
      error(err.message)
      res.render('admin', {uploadMsg: 'Invalid File'})
    })
  }
  else {
    res.render('admin', {uploadMsg: 'No file uploaded :('})
  }

});

module.exports = router;
