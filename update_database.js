var database = require('./models');

database.User.find({}, function parseUsers(err, users) {
    if(err) { console.trace(err); return; }

    users.forEach(function startParseUser(user) {
      user.display_name = user.username;
      user.username = user.username.toLowerCase();
      user.save();
    });
  }
);