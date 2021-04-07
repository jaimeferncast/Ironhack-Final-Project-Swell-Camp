module.exports = (app) => {
  // Base URLS
  app.use('/api/auth', require('./auth.routes.js'))
  app.use('/api/users', require('./users.routes.js'))
  app.use('/api/bookings', require('./bookings.routes.js'))
  app.use('/api/occupancies', require('./occupancies.routes.js'))
  app.use('/api/lessons', require('./lessons.routes.js'))
  app.use('/api/meals', require('./meals.routes.js'))
  app.use('/api/rates', require('./rates.routes.js'))
  app.use('/api/beds', require('./beds.routes.js'))
  app.use('/api/seasons', require('./seasons.routes.js'))
  app.use('/api/discounts', require('./discounts.routes.js'))
}
