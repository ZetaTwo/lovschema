var calendar = require('./library/calendar.js');

var parseCalendar = function(calendarId, callback) {
  calendar.events(calendarId,
    function parseCalendarEvents(err, cal) {
      if(err) { callback(err); return }

      result = {
        name: cal.summary,
        items: []
      };

      cal.items.forEach(function parseCalendarEvent(item) {
        result.items.push({
          name: item.summary,
          start: item.start,
          end: item.end,
          busy: (item.transparency !== 'transparent'),
          private: (item.summary === undefined)
        })
      });

      callback(null, result);
    }
  );
};

parseCalendar("calle.svensson@zeta-two.com", function(err, res) { console.log(res) });
parseCalendar("tony.fat@gmail.com", function(err, res) { console.log(res) });