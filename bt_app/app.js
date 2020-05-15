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
const requestIp = require('request-ip')
const helmet = require('helmet')
const expectCt = require('expect-ct')
const featurePolicy = require('feature-policy')
const argv = require('yargs').argv
var ipgeoblock = require('node-ipgeoblock')

var debug = Debug('App.js');

debug = console.log.bind(console);

var httpsApp;
var httpApp;
var apps = [];

if (argv['redirect-http']) {
  argv.http = true;
  httpApp = express();
  console.log('redirect 301 http->https')
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
}

if(argv.http){
  console.log('creating http app')
  if (!httpApp)
    httpApp = express();
  httpApp.set('port', process.env.HTTP_PORT || 80);
  apps.push(httpApp);
}

if(argv.https){
  console.log('creating https app')
  httpsApp = express();
  var app = httpsApp;
  app.set('port', process.env.HTTPS_PORT || 443);
  
  app.use(ipgeoblock({
    geolite2: "./GeoLite2-Country.mmdb",
    allowedCountries: ['FR']
  }))

  app.use(helmet())
  app.use(expectCt({
    enforce: true,
    maxAge: 86400
  }))
  app.use(featurePolicy({
    features: {
      fullscreen: ["'self'"]
    }
  }))
  app.disable('x-powered-by')
 
  app.use(csp({
    // Specify directives as normal.
    directives: {
      defaultSrc: ["'none'"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      scriptSrc: ["'self'", /*"'strict-dynamic'",*/ "'unsafe-inline'", 'https://www.googletagmanager.com', 'www.google-analytics.com', 'code.jquery.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'],
      styleSrc: ["'self'"],
      fontSrc: ["'self'"],
      baseUri: ["'self'"],
      imgSrc: ["'self'", 'www.google-analytics.com'],
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
  app.use(hsts({maxAge: 31536000, includeSubDomains: true, preload: true}))

  app.all('/*', function(req, res, next) {
    debug(req.headers.host);
    if (req.headers.host.match(/^www/) !== null ) {
      res.redirect(301, 'https://' + req.headers.host.replace(/^www\./, '') + req.url);
    } else {
      next();
    }
  })

  apps.push(app);
}

for (app of apps){

  if (app.get('port') == 80 && argv['redirect-http']) 
    console.log('passing http routing (301 rediretion)');

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(requestIp.mw())
  app.use(function(req, res, next) {
    const ip = req.clientIp;
    debug(`client ip: ${ip}`);
    next();
  })
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());

  debug('Init routes');
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
/*
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

  debug('declaring middlewares');
  */
}

module.exports = {httpsApp, httpApp, argv};
