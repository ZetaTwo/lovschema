var database = require('../models')
  , error = require('../library/error.js').error
  , bcrypt = require('bcrypt-nodejs');

exports.create = function(req, res) {
  //TODO: Sanitize input
  if(!req.body.username || !req.body.password) {
    res.json(400, { error: "Username or password not specified."});
    return;
  }

  database.User.findOne({username: req.body.username},
    function login(err, user) {
      //If there are errors or we don't find the user, abort
      if(err) { res.json(404, {error: err}); return; }
      if(!user) { res.json(404, {error: "User not found"}); return; }

      //Compare password hashes
      bcrypt.compare(req.body.password, user.password, function checkPassword(err, result) {
        if(err) { error(res, err); return; }

        //If everything matches, create the session.
        if(result) {
          req.session.username = user.username;
          res.json({ username: user.username });
        } else {
          req.session = null;
          res.json(404, { error: "Incorrect username or password."});
        }
      });
    }
  );
};

exports.destroy = function(req, res) {
  req.session = null;
  res.json({ loggedout: true });
};