var mongoose = require('mongoose');

//Database
db_config = {
  HOST: "",
  DATABASE: ""
};
mongoose.connect('mongodb://' + db_config.HOST + '/' + db_config.DATABASE);
exports.mongoose = mongoose;

//Google
exports.google = {
  API_KEY: '',
  CLIENT_ID: "",
  CLIENT_SECRET: "",
  REDIRECT_URL: ""
};

//BCrypt
exports.bcrypt = {
  work_factor: 10
};