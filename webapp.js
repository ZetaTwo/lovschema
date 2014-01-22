/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.json());
app.use(express.urlencoded());

app.use(express.cookieParser());
app.use(express.cookieSession({secret: "7EqdDP5ZfgeM776"}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Not used
app.get('/oauth2/request', routes.oauth2.request);
app.get('/oauth2/callback', routes.oauth2.callback);

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

//Session
app.post('/session', routes.session.create);
app.delete('/session', routes.session.destroy);

//Close connection on shutdown
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});