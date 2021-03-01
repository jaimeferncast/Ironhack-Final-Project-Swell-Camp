module.exports = {
  checkIfAdmin: () => (req, res, next) =>
    req.session.passport.user.role === "ADMIN"
      ? next()
      : res.status(401).json({ message: "user unauthorized" })
};
