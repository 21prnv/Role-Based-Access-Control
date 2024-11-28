const express = require("express");
const { register, login } = require("../controllers/authController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//  dashboard and admin using auth middleware
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  (req, res) => {
    res.json({ message: "Welcome to the dashboard", user: req.user });
  }
);

router.get("/admin", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Welcome to the admin panel", user: req.user });
});

module.exports = router;
