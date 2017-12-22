var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {
  app.get('/', require('./frontpage').get);
  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);
  app.post('/logout', require('./logout').post);
  app.get('/entries', checkAuth, require('./entries').get);
  app.get('/entries_test', checkAuth, require('./entries_test').get);
  app.get('/reports', checkAuth, require('./reports').get);
};
