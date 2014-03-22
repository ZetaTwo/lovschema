var express = require('express');
//var http = require('http');
var path = require('path');
var routes = require('./routes');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.session({secret: 'H3lg1WJGwUjtIN6c5Ags'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//Calendar
app.get('/calendar', routes.calendar.list);
app.get('/calendar/:calendarId', routes.calendar.get);
app.get('/calendar/:calendarId/events', routes.calendar.events);
app.get('/calendar/:calendarId/events/:eventId', routes.calendar.event);

//User
app.get('/user', routes.user.list);
app.post('/user', routes.user.create);
app.put('/user/:username', routes.user.update);
app.get('/user/:username', routes.user.get);
app.get('/user/:username/events', routes.user.events);

//Session
app.get('/session', routes.session.get);
app.post('/session', routes.session.create);
app.delete('/session', routes.session.destroy);

//Close connection on shutdown
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});


module.exports = app;
