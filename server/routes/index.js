module.exports = app => {

    // Base URLS
    app.use('/api/auth', require('./auth.routes.js'))
    app.use('/api/lessons', require('./lessons.routes.js'))
    app.use('/api/meals', require('./meals.routes.js'))
    app.use('/api/rates', require('./rates.routes.js'))
    app.use('/api/beds', require('./beds.routes.js'))
}