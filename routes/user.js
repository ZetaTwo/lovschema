var database = require('../models')
  , error = require('../library/error.js').error
  , bcrypt = require('bcrypt-nodejs');

exports.list = function(req, res) {
  database.User.find({},
    { '__v': 0, '_id': 0, 'calendar_data._id': 0, 'calendar_data.items._id': 0, 'password': 0 },
    function getUsers(err, users) {
      if(err) { error(res, err); return; }
      res.json(users);
    }
  );
};

exports.get = function(req, res) {
  database.User.findOne({username: req.params.username},
    { '__v': 0, '_id': 0, 'calendar_data._id': 0, 'calendar_data.items._id': 0, 'password': 0 },
    function getUsers(err, user) {
      if(err) { error(err); return; }
      res.json(user);
    }
  );
};

exports.create = function(req, res) {
  //TODO: Sanitize input
  if(!req.body.username || !req.body.password) {
    res.json({ error: "Username or password not specified."});
    return;
  }

  //Hash password
  //TODO: Replace with bcrypt native
  bcrypt.hash(req.body.password, null, null, function createUser(err, hash) {
    if(err) { error(res, err); return; }

    //Create user
    var user = new database.User({
      username: req.body.username,
      password: hash
    });

    //Save user
    user.save(function savedUser(err, user) {
      if(err) { error(res, err); return; }
      res.json(user);
    });
  });
};

exports.update = function(req, res) {
  if(req.session.username !== req.params.username) {
    error(res, "Access not allowed"); return;
  }

  database.User.findOne({username: req.params.username},
    { '__v': 0, '_id': 0, 'calendar_data._id': 0, 'calendar_data.items._id': 0, 'password': 0 },
    function getUsers(err, user) {
    if(err) { error(err); return; }

    user.calendar_ids = req.body.calendar_ids;
    user.save(function saveUser(err, user_saved) {
      if(err) { error(err); return; }

      res.json(user_saved);
    });
  });
};