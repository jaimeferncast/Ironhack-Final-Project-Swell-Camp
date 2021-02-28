module.exports = (app) => {
  // Base URLS
  app.use("/api/auth", require("./auth.routes.js"));
  app.use("/api/users", require("./users.routes.js"));
  app.use("/api/bookings", require("./bookings.routes.js"));
  app.use("/api/occupancies", require("./occupancies.routes.js"));
};