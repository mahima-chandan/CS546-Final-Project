const linesRoutes = require('./lines');

const constructorMethod = (app) => {
  app.use('/api/lines', linesRoutes);
  
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;

