const marvelRoutes = require('./marvel');

const constructorMethod = (app) => {
    app.use('/', marvelRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Page Not found' });
    });
};

module.exports = constructorMethod;