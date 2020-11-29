const adminRoutes = require('./admin');
const betRoutes = require('./bet');
const fundRoutes = require('./fund');
const historyRoutes = require('./history');
const linesRoutes = require('./lines');
const loginRoutes = require('./login');

const constructorMethod = (app) => {
  app.use('/', loginRoutes);
  app.use('/admin', adminRoutes);
  app.use('/api/lines', linesRoutes);
  app.use('/bet', betRoutes);
  app.use('/fund', fundRoutes);
  app.use('/history', historyRoutes);
  
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;

