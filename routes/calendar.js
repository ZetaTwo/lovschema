var database = require('../models')
  , moment = require('moment')
  , error = require('../library/error').error;


function initDays(start_day, num_days) {
  var result = {
    events: [],
    days: {}
  };
  var counter = 0;
  var cur_day = moment().startOf('day').add('days', start_day);
  var max_day = moment().startOf('day').add('days', num_days);

  //Initialize all hours from 08-23
  for (var day = cur_day; day.isBefore(max_day); day.add('days', 1)) {
    var max_hour = moment(day).add('days', 1);

    for (var hour = moment(day); hour.isBefore(max_hour); hour.add('hours', 1)) {
      result.days[hour] = counter++;
      result.events.push({ datetime: moment(hour), free: true });
    }
  }
  return result;
}

function insertUserEvent(days, event, result, user) {
  var start_index = days[moment(event.start)];
  var end_index = days[moment(event.end)];

  for (var x = start_index; x < end_index; x++) {
    if (!result.events[x].hasOwnProperty('users')) {
      result.events[x].users = {};
      result.events[x].free = false;
    }
    if (!result.events[x].users.hasOwnProperty(user.username)) {
      result.events[x].users[user.username] = [];
    }
    result.events[x].users[user.username].push(event);
  }
}

function insertUserEvents(user, days, result) {
  for (var j = 0; j < user.calendar_data.length; j++) {
    var cal = user.calendar_data[j];

    for (var k = 0; k < cal.items.length; k++) {
      var event = cal.items[k];

      insertUserEvent(days, event, result, user);
    }
  }
}

exports.list = function(req, res) {
  database.User.find({},
    { '__v': 0, '_id': 0, 'calendar_ids': 0, 'calendar_data._id': 0, 'calendar_data.items._id': 0, 'password': 0 },
    function (err, users) {
      if(err) {
        return res.json(404, err);
      }

      var result, i, days;
      days = initDays(0, 30);
      result = {
        events: days.events,
        users: []
      };
      days = days.days;

      for(i = 0; i < users.length; i++) {
        result.users.push({username: users[i].username, display_name: users[i].display_name});
      }

      //Insert all events
      for(i = 0; i < users.length; i++) {
        var user = users[i];

        insertUserEvents(user, days, result);
      }

      res.json(result);
    }
  );
};

exports.get = function(req, res) {
  res.json({ error: "Not implemented"});
};

exports.events = function(req, res) {
  res.json({ error: "Not implemented"});
};

exports.event = function(req, res) {
  res.json({ error: "Not implemented"});
};