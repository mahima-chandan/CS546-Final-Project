const adminRoutes = require('./admin');
const betRoutes = require('./bet');
const fundRoutes = require('./fund');
const historyRoutes = require('./history');
const linesRoutes = require('./lines');
const logoutRoutes = require('./logout');
const signupRoutes = require('./signup');
const path = require('path');

const constructorMethod = (app) => {
  app.use('/admin', adminRoutes);
  app.use('/api/lines', linesRoutes);
  app.use('/bet', betRoutes);
  app.use('/fund', fundRoutes);
  app.use('/history', historyRoutes);
  app.use('/logout', logoutRoutes);
  app.use('/signup', signupRoutes);
  app.get('/about', (req, res) => {
        res.sendFile(path.resolve('static/about.html'));
    });
  app.use('*', (req, res) => {
    console.error("unknown route: " + req.method + " " + req.path);
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;

