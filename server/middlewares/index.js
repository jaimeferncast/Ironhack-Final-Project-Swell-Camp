module.exports = {
  checkIfAdmin: (req, res, next) => (req.user.role === "ADMIN" ? next() : res.status(401).json({ message: "user unauthorized" })),
  checkIfLoggedIn: (req, res, next) => (req.user ? next() : res.status(401).json({ message: "user unauthorized" })),
  // checkIfLoggedIn: () => (req, res, next) => {
  //   console.log(req.user)
  //   next()
  // },
}
