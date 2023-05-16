const { isNil } = require("lodash");
const pool = require("../database");

let instance = null;

class PostService {
  async getAllPosts() {
    const query = `SELECT p.*, COUNT (l.*) AS likes
    FROM posts AS p
    LEFT JOIN likes AS l ON p.id = l."postId"
    GROUP BY p.id;`;

    return (await pool.query(query)).rows;
  }

  async getPostById(id) {
    const query = `SELECT p.*, COUNT (l.*) AS likes
    FROM posts AS p
    LEFT JOIN likes AS l ON p.id = l."postId"
    WHERE p.id = $1
    GROUP BY p.id;`;
    const res = await pool.query(query, [id]);
    return res.rows[0];
  }

  async getPostsByAuthorId(authorId) {
    const query = `SELECT p.*, COUNT (l.*) AS likes
    FROM posts AS p
    LEFT JOIN likes AS l ON p.id = l."postId"
    WHERE p."authorId" = $1
    GROUP BY p.id;`;
    return (await pool.query(query, [authorId])).rows;
  }

  async createPost(title, content, authorId) {
    const query = `INSERT INTO posts (title, content, "authorId") VALUES ($1, $2, $3) RETURNING *`;
    const res = await pool.query(query, [title, content, authorId]);
    return res.rows[0];
  }

  async updatePostById(id, title, content) {
    const query =
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *";
    const res = await pool.query(query, [title, content, id]);
    return res.rows[0];
  }

  async deletePostById(id) {
    const query = "DELETE FROM posts WHERE id = $1";
    return (await pool.query(query, [id])).rowCount > 0;
  }

  async fetchLike(postId, userId) {
    const query = `SELECT * FROM likes WHERE "userId" = $1 AND "postId" = $2`;
    return (await pool.query(query, [userId, postId])).rows.length > 0;
  }

  async likePost(postId, userId) {
    const query = `INSERT INTO likes ("userId", "postId") VALUES ($1, $2) RETURNING *;`;
    const res = await pool.query(query, [userId, postId]);
    return res.rows[0];
  }

  async unlikePost(postId, userId) {
    const query = `DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2;`;
    return (await pool.query(query, [userId, postId])).rowCount > 0;
  }
}

module.exports = (() => {
  if (isNil(instance)) {
    instance = new PostService();
  }

  return instance;
})();
