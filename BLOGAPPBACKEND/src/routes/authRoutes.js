const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
/**
 * @description routes for register
 * @method POST
 * @route POST /api/auth/v1/register
 * @access Public
 * @body { username, email, password }
 * @returns { message, user }on success
 * @returns { error } on failure
 *
 */
router.post("/register", authController.register);
// Login route
/**
 * @description routes for login
 * @method POST
 * @route POST /api/auth/v1/login
 * @access Public
 * @body { email, password }
 * @returns { message, token, user } on success
 * @returns { error } on failure
 */
router.post("/login", authController.login);

// Get all users (no password field returned)
/**
 * @description get all users
 * @method GET
 * @route GET /api/auth/v1/users
 * @access Public (consider protecting this in production)
 */
router.get("/users", authController.getAllUsers);

// http method
// GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD

module.exports = router;
