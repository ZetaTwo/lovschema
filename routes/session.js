var database = require('../models')
  , error = require('../library/error').error
  , bcrypt = require('bcrypt');

exports.get = function(req, res) {
  if(!req.session || !req.session.username) {
    return error(res, 404, "No session found."); return;
  }

  res.json({ username: req.session.username });
};

exports.create = function(req, res) {
  //TODO: Sanitize input
  if(!req.body.username || !req.body.password) {
    return error(res, 400, "Username or password not specified.");
  }

  database.User.findOne({username: req.body.username},
    function login(err, user) {
      //If there are errors or we don't find the user, abort
      if(err) { return error(res, 404, err); }
      if(!user) { return error(res, 404, "User not found"); }

      //Compare password hashes
      bcrypt.compare(req.body.password, user.password, function checkPassword(err, result) {
        if(err) { error(res, err); return; }

        //If everything matches, create the session.
        if(result) {
          req.session.username = user.username;
          res.json({ username: user.username });
        } else {
          req.session = null;
          return error(res, 404, "Incorrect username or password.");
        }
      });
    }
  );
};

exports.destroy = function(req, res) {
  req.session = null;
  res.json({ loggedout: true });
};