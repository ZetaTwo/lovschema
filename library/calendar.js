var google = require('./google.js')
  , moment = require('moment');

exports.list = function(oauth2tokens, callback) {
  google.login(oauth2tokens);

  //Request calendar API
  google.calendar(function (err, client) {
    if(err) {
      return callback(err);
    }

    //Request all calendars
    google.authexecute(client.calendar.calendarList.list(),
      function (err, cal) {
        if(err) {
          return callback(err);
        }
        return callback(null, cal);
      }
    );
  });
};

exports.get = function(oauth2tokens, callback) {
  google.login(oauth2tokens);

  //Request calendar API
  google.calendar(function (err, client) {
    if(err) {
      return callback(err);
    }

    //Request all calendars
    google.authexecute(client.calendar.calendarList.get({calendarId: req.params.calendarId}),
      function (err, cal) {
        if(err) {
          return callback(err);
        }
        callback(null, cal);
      }
    );
  });
};

exports.events = function(calendarId, callback) {
  //Request calendar API
  google.calendar(function (err, client) {
    if(err) {
      return callback(err);
    }

    //Request all calendars from today and one month forward
    var timeMin = moment().startOf('day');
    var timeMax = moment().add('month', 1).startOf('day');

    google.execute(client.calendar.events.list({calendarId: calendarId, timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString() }),
      function (err, cal) {
        if(err) {
          return callback(err);
        }
        callback(null, cal);
      }
    );
  });
};

exports.event = function(calendarId, eventId, callback) {
  //Request calendar API
  google.calendar(function (err, client) {
    if(err) {
      return callback(err);
    }

    //Request all calendars
    google.execute(client.calendar.events.get({calendarId: calendarId, eventId: eventId }),
      function (err, cal) {
        if(err) {
          return callback(err);
        }
        callback(null, cal);
      }
    );
  });
};