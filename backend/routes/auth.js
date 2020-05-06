const express = require('express');

const auth = require('../middlewares/authentication');
const AuthController = require('../controllers/auth');
const UserController = require('../controllers/admin-users');

const router = express.Router();

// Authentication Module
router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);

// Admin > User Module
router.get("", auth, UserController.getUsers);
router.get("/:id", auth, UserController.getUser);
router.post("", auth, UserController.createUser);
router.put("/:id", auth, UserController.updateUser);
router.delete("/:id", auth, UserController.deleteUser);
router.put("/change/:id", auth, UserController.changePassword);

module.exports = router;
