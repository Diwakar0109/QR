const bcrypt = require("bcryptjs");
const { run, get, all } = require("../config/db");

const SALT_ROUNDS = 10;

const createUser = async ({ name, email, password, role }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await run(
    "INSERT INTO users(name, email, password_hash, role) VALUES(?, ?, ?, ?)",
    [name, email.toLowerCase(), passwordHash, role]
  );
  return getSafeUserById(result.id);
};

const getUserByEmail = (email) =>
  get("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);

const getSafeUserById = (id) =>
  get("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [id]);

const listUsers = () =>
  all("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC");

const verifyPassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash);

module.exports = {
  createUser,
  getUserByEmail,
  getSafeUserById,
  listUsers,
  verifyPassword
};

