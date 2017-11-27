var User = require('../lib/mongoose').models.users;

module.exports = function(req, res, next) {
  req.user = res.locals.user = null;
  if (!req.session.user) return next();
  User.findById(req.session.user, function(err, user) {
    if (err) return next(err);
    req.user = res.locals.user = user;
    req.someinfo = res.locals.someinfo = {};
    next();
  });
};
