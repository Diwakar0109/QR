const express = require("express");
const { signup, login, me, users } = require("../controllers/authController");
const { authRequired, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authRequired, me);
router.get("/users", authRequired, allowRoles("admin"), users);

module.exports = router;

