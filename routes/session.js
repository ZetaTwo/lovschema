var database = require('../models')
  , error = require('../library/error.js').error
  , bcrypt = require('bcrypt-nodejs');

exports.create = function(req, res) {
  //TODO: Sanitize input
  if(!req.body.username || !req.body.password) {
    res.json({ error: "Username or password not specified."});
    return;
  }

  database.User.findOne({username: req.body.username},
    function login(err, user) {
      if(err) { error(res, err); return; }

      bcrypt.compare(req.body.password, user.password, function checkPassword(err, result) {
        if(err) { error(res, err); return; }

        if(result) {
          req.session.username = user.username;
          res.json({ username: user.username });
        } else {
          req.session = null;
          res.json({ error: "Incorrect username or password."});
        }
      });
    }
  );
};

exports.destroy = function(req, res) {
  req.session = null;
  res.json({ loggedout: true });
};