var database = require('../models')
  , error = require('../library/error').error
  , bcrypt = require('bcrypt');

exports.list = function(req, res) {
  database.User.find({},
    { '__v': 0, '_id': 0, 'calendar_ids': 0, 'calendar_data': 0, 'password': 0 },
    function getUsers(err, users) {
      if(err) { res.json(404, err); return; }
      res.json(users);
    }
  );
};

exports.get = function(req, res) {
  database.User.findOne({username: req.params.username},
    { '__v': 0, '_id': 0, 'calendar_data': 0, 'password': 0 },
    function getUsers(err, user) {
      if(err) { return error(res, 404, err); }
      res.json(user);
    }
  );
};

exports.events = function(req, res) {
  database.User.findOne({username: req.params.username},
    { '__v': 0, '_id': 0, 'calendar_data._id': 0, 'calendar_data.items._id': 0, 'password': 0 },
    function getUsers(err, user) {
      if(err) { return error(res, 404, err); }
      res.json(user);
    }
  );
};

exports.create = function(req, res) {
  //TODO: Sanitize input
  if(!req.body.username || !req.body.password) {
    return error(res, 400, "Username or password not specified.");
  }

  //Hash password
  bcrypt.hash(req.body.password, 10, function createUser(err, hash) {
    if(err) { error(res, 500, err); }

    //Create user
    var user = new database.User({
      username: req.body.username,
      password: hash
    });

    //Save user
    user.save(function savedUser(err, user) {
      if(err) {
        if(err.code == 11000) {
          return error(res, 403, "User already exists");
        } else {
          return error(res, 403, err);
        }
      }
      res.json(user);
    });
  });
};

var save_updated_user = function(res) {
  return function saveUser(err, user_saved) {
    if(err) { return error(res, 500, err); }

    user_saved = user_saved.toObject();
    delete user_saved['password'];
    delete user_saved._id;
    delete user_saved.__v;
    res.json(user_saved);
  }
}

exports.update = function(req, res) {
  if(req.session.username !== req.params.username) {
    return error(res, 403, "Access not allowed");
  }

  database.User.findOne({username: req.params.username},
    { 'calendar_data': 0 },
    function getUsers(err, user) {
      if(err) { return error(404, err); }

      user.calendar_ids = req.body.calendar_ids;

      if(req.body.old_password && req.body.password) {
        bcrypt.compare(req.body.old_password, user.password, function checkPassword(err, result) {
          if(err) { return error(res, 403, "Incorrect password"); }
          bcrypt.hash(req.body.password, 10, function createUser(err, hash) {
            if(err) { return error(res, 500, err); }

            user.password = hash;
            user.save(save_updated_user(res));
          });
        });
      } else {
        user.save(save_updated_user(res));
      }
    }
  );
};