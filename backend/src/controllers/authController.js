const jwt = require("jsonwebtoken");
const {
  createUser,
  getUserByEmail,
  getSafeUserById,
  listUsers,
  verifyPassword
} = require("../services/userService");

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });

const validateSignup = ({ name, email, password, role }) => {
  const allowedRoles = ["student", "mentor", "admin"];
  if (!name || !email || !password || !role) {
    return "Name, email, password, and role are required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (!allowedRoles.includes(role)) {
    return "Role must be student, mentor, or admin";
  }
  return null;
};

const signup = async (req, res, next) => {
  try {
    const error = validateSignup(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const existing = await getUserByEmail(req.body.email);
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await createUser(req.body);
    const token = signToken(user);

    return res.status(201).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = await getSafeUserById(user.id);
    const token = signToken(safeUser);
    return res.json({ token, user: safeUser });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await getSafeUserById(req.user.id);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
};

const users = async (_req, res, next) => {
  try {
    const result = await listUsers();
    return res.json({ users: result });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signup,
  login,
  me,
  users
};

