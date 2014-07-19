var database = require('../models')
  , error = require('../library/error').error
  , bcrypt = require('bcrypt');

exports.get = function(req, res) {
  if(!req.session || !req.session.username) {
    return error(res, 404, "No session found.");
  }

  res.json({ username: req.session.username, display_name: req.session.display_name });
};

exports.create = function(req, res) {
  //TODO: Sanitize input
  if(!req.body.username || !req.body.password) {
    return error(res, 400, "Username or password not specified.");
  }
  var username = req.body.username.toLowerCase();

  database.User.findOne({username: username},
    function (err, user) {
      //If there are errors or we don't find the user, abort
      if(err) {
        return error(res, 404, err);
      }
      if(!user) {
        return error(res, 404, "User not found");
      }

      //Compare password hashes
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if(err) {
          return error(res, err);
        }

        //If everything matches, create the session.
        if(result) {
          req.session.username = user.username;
          req.session.display_name = user.display_name;
          res.json({ username: req.session.username, display_name: req.session.display_name });
        } else {
          req.session = null;
          return error(res, 404, "Incorrect username or password.");
        }
      });
    }
  );
};

exports.destroy = function(req, res) {
  req.session.destroy();
  req.session = null;
  res.json({ loggedout: true });
};