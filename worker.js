var calendar = require('./library/calendar.js')
  , moment = require('moment')
  , database = require('./models')
  , async = require('async');

var parseCalendar = function(calendarId, callback) {
  //Get events from Google
  calendar.events(calendarId,
    function (err, cal) {
      if(err) {
        if(err.code === 404) {
          console.error('Calendar: ' + calendarId + ' not found.');
          return callback(null, null);
        } else {
          return callback(err);
        }
      }

      //Create calendar
      var result = {
        name: cal.summary,
        items: []
      };

      //Create all events
      cal.items.forEach(function (item) {
        var start, end;

        //Only count current events
        if(item.status === 'cancelled') {
          return;
        }

        //Get dateTime if available otherwise just date
        if(item.start) {
          start = (item.start.dateTime) ? item.start.dateTime : item.start.date;
        }
        if(item.end) {
          end = (item.end.dateTime) ? item.end.dateTime : item.end.date;
        }

        //Round events to nearest hour but make sure it is at least 1 hour
        start = moment(start).add('minutes', 30).startOf('hour');
        end = moment(end).add('minutes', 30).startOf('hour');
        if(start.isSame(end)) {
          end.add('hour', 1);
        }

        //Add item to result
        if(!item.transparency) {
          result.items.push({
            name: item.summary,
            start: start,
            end: end,
            busy: (item.transparency !== 'transparent'),
            private: (item.summary === undefined)
          });
        }
      });

      //Convert to model and pass to callback
      callback(null, new database.Calendar(result));
    }
  );
};

var parseUser = function(user, callback) {
  //Construct the calendar parsing tasks
  var cal_tasks = [];
  user.calendar_ids.forEach(function(calendarId) {
    cal_tasks.push(function (callback) {
      parseCalendar(calendarId, callback);
    });
  });

  //Run calendar tasks
  async.parallel(cal_tasks, function (err, calendars) {
    if(err) {
      return console.trace(err);
    }

    user.calendar_data = [];
    for(var i = 0; i < calendars.length; i++) {
      if(calendars[i] !== null) {
        user.calendar_data.push(calendars[i]);
      }
    }

    //And save the results
    user.save(function (err, user) {
      if(err) {
        return console.trace(err);
      }

      console.log('Updated user: ' + user.username);
      callback(null, user);
    });
  });
};

var getUsers = function(callback) {
  database.User.find({},
    { username: 1, calendar_ids: 1, calendar_data: 1},
    function (err, users) {
      if(err) {
        return console.trace(err);
      }

      var user_tasks = [];
      //Create user tasks
      users.forEach(function (user) {
        user_tasks.push(function(callback) {
          parseUser(user, callback);
        });
      });

      //Run user tasks
      async.parallel(user_tasks, callback);
    }
  );
};

//Start the worker
exports.updateCalendars = function() {
  getUsers(function (err, users) {
    if(err) {
      return console.trace(err);
    }
    console.log('Finished updating ' + users.length + ' users');
  });
};