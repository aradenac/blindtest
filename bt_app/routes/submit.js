var express = require('express');
var router = express.Router();
var Debug = require('debug');
var util = require('util');
var multer = require('multer')
var mm = require('music-metadata')

var upload = multer({dest: 'upload/'})

var debug = Debug('submit.js')
debug.log = console.log.bind(console)
var error = Debug('submit.js')

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
