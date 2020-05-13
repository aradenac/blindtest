var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pseudoRouter = require('./routes/submitPseudo');
var sessionRouter = require('./routes/session');
var sessions = require('./sessions.js');
var Session = require('./session.js');
var Debug = require('debug');
var compression = require('compression');
var hsts = require('hsts');
const csp = require('helmet-csp');
const dontSniffMimetype = require('dont-sniff-mimetype')

var debug = Debug('App.js');

var app = express();
var httpApp = express();

app.disable('x-powered-by')
httpApp.disable('x-powered-by')

httpApp.set('port', process.env.PORT || 80);
httpApp.use(express.static(path.join(__dirname, 'public')));
httpApp.use(hsts({maxAge: 15552000}))
httpApp.use(compression());
httpApp.all("*", function (req, res, next) {
  if(req.url === "/sitemap.xml"){
    req.pipe(filed('./public/sitemap.xml')).pipe(resp);
  }
  else {
    var hn = req.headers.host;
    if (hn.match(/^www/) !== null) {
      hn = hn.replace(/^www\./, '')
    }
    res.redirect(301, "https://" + hn + "/");
  }
});
// view engine setup
debug('setting views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

debug('declaring middlewares');
app.use(csp({
  // Specify directives as normal.
  directives: {
    defaultSrc: ["'self'", 'https://whatsong.fr/'],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'www.google-analytics.com'],
    styleSrc: ['style.com'],
    fontSrc: ["'self'"],
    baseUri: ["'self'"],
    imgSrc: ["'self'"],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/report-violation',
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false  // This is not set.
  },

  // This module will detect common mistakes in your directives and throw errors
  // if it finds any. To disable this, enable "loose mode".
  loose: false,

  // Set to true if you only want browsers to report errors, not block them.
  // You may also set this to a function(req, res) in order to decide dynamically
  // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
  reportOnly: false,

  // Set to true if you want to blindly set all headers: Content-Security-Policy,
  // X-WebKit-CSP, and X-Content-Security-Policy.
  setAllHeaders: false,

  // Set to true if you want to disable CSP on Android where it can be buggy.
  disableAndroid: false,

  // Set to false if you want to completely disable any user-agent sniffing.
  // This may make the headers less compatible but it will be much faster.
  // This defaults to `true`.
  browserSniff: true
}))
app.use(dontSniffMimetype())
app.use(compression());
app.use(hsts({maxAge: 15552000}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

debug('Init routes');
app.all('/*', function(req, res, next) {
  console.log(req.headers.host);
  if (req.headers.host.match(/^www/) !== null ) {
    res.redirect('https://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();
  }
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/submitPseudo', pseudoRouter);
app.use('/session', sessionRouter);

// start a test game session
debug('Creating a game Session');
sessionTest = new Session();
sessions.push(sessionTest);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  debug(`remote ip: ${req.ip}`)
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

module.exports = {app, httpApp};
