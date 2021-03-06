var mongoose = require('../config.js').mongoose;

//Event
var EventSchema = {
  name: String,
  start: Date,
  end: Date,
  busy: Boolean,
  private: Boolean
};
var Event = mongoose.model('Event', EventSchema);

//Calendar
var CalendarSchema = {
  name: String,
  items: [EventSchema]
};
var Calendar = mongoose.model('Calendar', CalendarSchema);

//User
var UserSchema = {
  username: { type: String, index: { unique: true }, required: true },
  display_name: { type: String, required: true },
  password: { type: String, required: true },
  calendar_ids: [String],
  calendar_data: [CalendarSchema]
};
var User = mongoose.model('User', UserSchema);

exports.Event = Event;
exports.Calendar = Calendar;
exports.User = User;
exports.Disconnect = function(fn) {
  mongoose.disconnect(fn);
};