var calendar = require('./library/calendar.js')
  , moment = require('moment')
  , database = require('./models')
  , async = require('async');

var parseCalendar = function(calendarId, callback) {
  //Get events from Google
  calendar.events(calendarId,
    function parseCalendarEvents(err, cal) {
      if(err) { callback(err); return }

      //Create calendar
      var result = {
        name: cal.summary,
        items: []
      };

      //Create all events
      cal.items.forEach(function parseCalendarEvent(item) {
        var start, end;

        //Get dateTime if available otherwise just date
        if(item.start) { start = (item.start.dateTime)?item.start.dateTime:item.start.date; }
        if(item.end) { end = (item.end.dateTime)?item.end.dateTime:item.end.date; }

        //Round events to nearest hour but make sure it is at least 1 hour
        start = moment(start).add('minutes', 30).startOf('hour');
        end = moment(end).add('minutes', 30).startOf('hour');
        if(start.isSame(end)) { end.add('hour', 1); }

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

var getUsers = function() {
  database.User.find({},
    { username: 1, calendar_ids: 1, calendar_data: 1},
    function parseUsers(err, users) {
      if(err) { console.log(err); return; }

      var user_tasks = [];
      //Create user tasks
      users.forEach(function(user) {
        user_tasks.push(function parseUser(callback) {
          //Construct the calendar parsing tasks
          var cal_tasks = [];
          user.calendar_ids.forEach(function(calendarId) {
            cal_tasks.push(function getCalendar(callback) {
              parseCalendar(calendarId, callback);
            });
          });

          //Run calendar tasks
          async.parallel(cal_tasks, function addCalendars(err, calendars) {
            //And save the results
            user.calendar_data = calendars;
            user.save(function savedUsed(err, user) {
              if(err) { console.log(err); return; }

              console.log('Updated user: ' + user.username);
              callback(null, user);
            });
          });
        });
      });

      //Run user tasks
      async.parallel(user_tasks, function finishedUsers(err, users) {
        if(err) { console.log(err); return; }

        console.log('Finished updating users');
        database.Disconnect();
      });
    }
  );
};

//Start the worker
getUsers();