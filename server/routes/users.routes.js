const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { checkIfAdmin } = require("../middlewares");

const User = require("../models/user.model");

// Get all users
// TO-DO:
// add checkIfAdmin
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json({ message: users });
  } catch (err) {
    res.status(500).json({ message: "Error buscando los usuarios" });
  }
});

// Create new user
// TO-DO:
// add checkIfAdmin
router.post("/new", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Rellena todos los campos" });
    return;
  }

  if (password.length < 2) {
    res.status(400).json({ message: "Contraseña insegura" });
    return;
  }

  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    await User.create({ username, password: hashPass, role });
    res.status(200).json({ message: "Usuario creado con éxito" });
  } catch {
    res.status(500).json({ message: "Error creando el usuario" });
  }
});

// Update user
// TO-DO:
// add checkIfAdmin
router.put("/:_id", async (req, res) => {
  const { username, password } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params._id,
      { username, password },
      { omitUndefined: true, new: true }
    );
    res.status(200).json({ message: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error modificando el usuario" });
  }
});

// Delete user
// TO-DO:
// add checkIfAdmin
router.delete("/:_id", (req, res) => {
  User.findByIdAndDelete(req.params._id)
    .then(res.status(200).json({ message: "Usuario borrado con éxito" }))
    .catch(() =>
      res.status(500).json({ message: "Error borrando el usuario" })
    );
});
module.exports = router;
