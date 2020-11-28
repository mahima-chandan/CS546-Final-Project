const loginRoutes = require('./login');
const linesRoutes = require('./lines');
const betRoutes = require('./bet');

const constructorMethod = (app) => {
  app.use('/', loginRoutes);
  app.use('/api/lines', linesRoutes);
  app.use('/bet', betRoutes);
  
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;

