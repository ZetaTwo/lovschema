var mongoose = require('mongoose');

//Database
db_config = {
  HOST: "localhost",
  DATABASE: "lovschema"
};
mongoose.connect('mongodb://' + db_config.HOST + '/' + db_config.DATABASE);
exports.mongoose = mongoose;

//Google
exports.google = {
  API_KEY: 'AIzaSyA9BMKIQb6Kk5uTySWXp9kWtTn4dSRojzQ',
  CLIENT_ID: "",
  CLIENT_SECRET: "",
  REDIRECT_URL: ""
};

//BCrypt
exports.bcrypt = {
  work_factor: 10
};