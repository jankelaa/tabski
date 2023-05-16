const { isNil } = require("lodash");
const bcrypt = require("bcrypt");
const pool = require("../database");

const saltRounds = 10;

let instance = null;

class UserService {
  async getAllUsers() {
    const query = "SELECT * FROM users";
    return (await pool.query(query)).rows;
  }

  async getUserById(id) {
    const query = "SELECT * FROM users WHERE id = $1";
    const res = await pool.query(query, [id]);
    return res.rows[0];
  }

  async createUser(name, email, password) {
    const passwordHash = await generatePasswordHash(password);

    const query =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
    const res = await pool.query(query, [name, email, passwordHash]);
    return res.rows[0];
  }

  async updateUserById(id, name, email, password) {
    const passwordHash = await generatePasswordHash(password);

    const query =
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *";
    const res = await pool.query(query, [name, email, passwordHash, id]);
    return res.rows[0];
  }

  async deleteUserById(id) {
    const query = "DELETE FROM users WHERE id = $1";
    return (await pool.query(query, [id])).rowCount > 0;
  }

  async isCorrectPassword(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
  }
}

const generatePasswordHash = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

module.exports = (() => {
  if (isNil(instance)) {
    instance = new UserService();
  }

  return instance;
})();
