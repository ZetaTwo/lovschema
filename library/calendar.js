var google = require('./google.js')
  , moment = require('moment');

exports.list = function(oauth2tokens, callback) {
  google.login(oauth2tokens);

  //Request calendar API
  google.calendar(function doCalendarRequest(err, client) {
    if(err) { callback(err); return; }

    //Request all calendars
    google.authexecute(client.calendar.calendarList.list(),
      function processCalendarRequest(err, cal) {
        if(err) { callback(err); return; }
        if(err) { callback(null, cal); }
      }
    );
  });
};

exports.get = function(oauth2tokens, callback) {
  google.login(oauth2tokens);

  //Request calendar API
  google.calendar(function doCalendarRequest(err, client) {
    if(err) { callback(err); return; }

    //Request all calendars
    google.authexecute(client.calendar.calendarList.get({calendarId: req.params.calendarId}),
      function processCalendarRequest(err, cal) {
        if(err) { callback(err); return; }

        callback(null, cal);
      }
    );
  });
};

exports.events = function(calendarId, callback) {
  //Request calendar API
  google.calendar(function doCalendarRequest(err, client) {
    if(err) { callback(err); return; }

    //Request all calendars from today and one month forward
    var timeMin = moment().startOf('day');
    var timeMax = moment().add('month', 1).startOf('day');

    google.execute(client.calendar.events.list({calendarId: calendarId, timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString() }),
      function processCalendarRequest(err, cal) {
        if(err) { callback(err); return; }
        callback(null, cal);
      }
    );
  });
};

exports.event = function(calendarId, eventId, callback) {
  //Request calendar API
  google.calendar(function doCalendarRequest(err, client) {
    if(err) { callback(err); return; }

    //Request all calendars
    google.execute(client.calendar.events.get({calendarId: calendarId, eventId: eventId }),
      function processCalendarRequest(err, cal) {
        if(err) { callback(err); return; }
        callback(null, cal);
      }
    );
  });
};