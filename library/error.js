exports.error = function(res, code, err) {
  if(typeof err == undefined) {
    err = code;
    code = 500;
  }
  res.json(code, { error: err });
};