var google = require('./google.js');

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

    //Request all calendars
    var timeMin = new Date();
    //TODO: Remove debug value
    google.execute(client.calendar.events.list({calendarId: calendarId, timeMin: timeMin.toISOString(), timeMax: "2014-01-25T16:12:16.768Z"}),
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