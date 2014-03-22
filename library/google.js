var googleapis = require('googleapis')
  , config = require('../config.js').google;

var authclient = new googleapis.auth.OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URL);

exports.calendar = function(executor) {
  googleapis
    .discover('calendar', 'v3')
    .execute(executor);
};

exports.authexecute = function(google_request, executor) {
  google_request
    .withAuthClient(authclient)
    .execute(executor);
};

exports.execute = function(google_request, executor) {
  google_request
    .withApiKey(config.API_KEY)
    .execute(executor);
};

exports.login = function(tokens) {
  authclient.credentials = tokens;
};

exports.oauth2Client = authclient;
exports.api = googleapis;