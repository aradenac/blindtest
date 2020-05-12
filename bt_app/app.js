var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pseudoRouter = require('./routes/submitPseudo');
var sessions = require('./sessions.js');
var Session = require('./session.js');
var Debug = require('debug');

var debug = Debug('App.js');

var app = express();

// view engine setup
debug('setting views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

debug('declaring middlewares');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

debug('Init routes');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/submitPseudo', pseudoRouter);

// start a test game session
debug('Creating a game Session');
sessionTest = new Session();
sessions.push(sessionTest);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
