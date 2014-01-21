exports.error = function(res, err) {
  res.json({ error: err });
  return;
}