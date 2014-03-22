var database = require('../models')
  , moment = require('moment')
  , error = require('../library/error').error

exports.list = function(req, res) {
  database.User.find({},
    { '__v': 0, '_id': 0, 'calendar_ids': 0, 'calendar_data._id': 0, 'calendar_data.items._id': 0, 'password': 0 },
    function getUsers(err, users) {
      if(err) { res.json(404, err); return; }

      var result = { events: [], users: [] };

      for(var i = 0; i < users.length; i++) {
        result.users.push(users[i].username);
      }

      var days = {};
      var counter = 0;
      var cur_day = moment().startOf('day');
      var max_day = moment().startOf('day').add('days', 30);

      //Initialize all hours from 08-23
      for (var day = cur_day; day.isBefore(max_day); day.add('days', 1)) {
        var max_hour = moment(day); max_hour.add('days', 1);
        for (var hour = moment(day); hour.isBefore(max_hour); hour.add('hours', 1)) {
          days[hour] = counter++;
          result.events.push({ datetime: moment(hour), free: true });
        }
      }

      //Insert all events
      for(var i = 0; i < users.length; i++) {
        var user = users[i];

        for(var j = 0; j < user.calendar_data.length; j++) {
          var cal = user.calendar_data[j];

          for(var k = 0; k < cal.items.length; k++) {
            var event = cal.items[k];

            var start_index = days[moment(event.start)];
            var end_index = days[moment(event.end)];

            for(var x = start_index; x <= end_index; x++) {
              if(!result.events[x].hasOwnProperty('users')) {
                result.events[x].users = {};
                result.events[x].free = false;
              }
              if(!result.events[x].users.hasOwnProperty(user.username)) {
                result.events[x].users[user.username] = [];
              }
              result.events[x].users[user.username].push(event);
            }
          }
        }
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