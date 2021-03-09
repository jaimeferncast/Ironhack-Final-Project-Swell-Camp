const express = require("express")
const router = express.Router()
const passport = require("passport")

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: "Error authenticating user" })
      return
    }

    if (!theUser) {
      res.status(401).json(failureDetails)
      return
    }

    req.login(theUser, (err) => (err ? res.status(500).json({ message: "Session error" }) : res.json(theUser)))
  })(req, res, next)
})

router.post("/logout", (req, res) => {
  req.logout()
  res.json({ message: "Log out success!" })
})

router.get("/loggedin", (req, res) =>
  req.isAuthenticated() ? res.json(req.user) : res.status(403).json({ message: "Unauthorized", loggedUser: undefined })
)

module.exports = router
