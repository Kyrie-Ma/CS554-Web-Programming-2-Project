const sweetsRoutes = require('./sweets');

const constructorMethod = (app) => {
    app.use('/', sweetsRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Page Not found' });
    });
};

module.exports = constructorMethod;