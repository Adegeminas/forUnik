var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {
  app.get('/', require('./frontpage').get);
  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);
  app.post('/logout', require('./logout').post);
  app.get('/entries', checkAuth, require('./entries').get);
  app.get('/reports', checkAuth, require('./reports').get);
  app.get('/test', checkAuth, require('./test').get);
};
