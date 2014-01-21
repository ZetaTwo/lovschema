google = require('../config.js');

exports.request = function(req, res){
  var url = google.oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar.readonly'
  });

  res.json({ url: url });
};

exports.callback = function(req, res) {
  google.oauth2Client.getToken(req.query.code, function(err, tokens) {
    if(err) {
      res.json({ error: err });
      return;
    }

    req.session.oauth2tokens = tokens;
    res.json({ error: 0, result: "Logged in" });
    return;
  });
};