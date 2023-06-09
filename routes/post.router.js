const { Router } = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const postService = require("../services/post.service");
const { isNil } = require("lodash");

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const posts = await postService.getAllPosts();

      const data = { posts };

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  })
  .post(async (req, res) => {
    try {
      const validationSchema = Joi.object().keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
        authorId: Joi.string().required(),
      });

      const validate = validationSchema.validate(req.body);

      if (!isNil(validate.error)) {
        return res.status(400).send(validate.error.message);
      }

      const { title, content, authorId } = req.body;
      const post = await postService.createPost(title, content, authorId);

      const data = { post };

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  });

router.get("/author/:id", async (req, res) => {
  try {
    const validationSchema = Joi.object().keys({
      id: Joi.string().required(),
    });

    const validate = validationSchema.validate(req.params);

    if (!isNil(validate.error)) {
      return res.status(400).send(validate.error.message);
    }

    const { id } = req.params;

    const posts = await postService.getPostsByAuthorId(id);

    const data = { posts };

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/like/:id", async (req, res) => {
  try {
    const validationSchema = Joi.object().keys({
      id: Joi.string().required(),
    });

    const validate = validationSchema.validate(req.params);

    if (!isNil(validate.error)) {
      return res.status(400).send(validate.error.message);
    }

    const { id } = req.params;
    const userId = getUserId(req.headers.authorization);

    const likeExists = await postService.fetchLike(id, userId);

    if (likeExists) {
      return res.status(400).send({
        message: "Like already exists.",
      });
    }

    const like = await postService.likePost(id, userId);

    const data = { like };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete("/unlike/:id", async (req, res) => {
  try {
    const validationSchema = Joi.object().keys({
      id: Joi.string().required(),
    });

    const validate = validationSchema.validate(req.params);

    if (!isNil(validate.error)) {
      return res.status(400).send(validate.error.message);
    }

    const { id } = req.params;
    const userId = getUserId(req.headers.authorization);

    const isDeleted = await postService.unlikePost(id, userId);

    const data = { isDeleted };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const validationSchema = Joi.object().keys({
        id: Joi.string().required(),
      });

      const validate = validationSchema.validate(req.params);

      if (!isNil(validate.error)) {
        return res.status(400).send(validate.error.message);
      }

      const { id } = req.params;

      const post = await postService.getPostById(id);

      const data = { post };

      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })
  .put(async (req, res) => {
    try {
      const validationSchema = Joi.object().keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
      });

      const validate = validationSchema.validate(req.body);

      if (!isNil(validate.error)) {
        return res.status(400).send(validate.error.message);
      }

      const { id } = req.params;
      const { title, content } = req.body;
      const post = await postService.updatePostById(id, title, content);

      const data = { post };

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.params;

      const isDeleted = await postService.deletePostById(id);

      const data = { isDeleted };

      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

const getUserId = (authorization) => {
  const token = authorization.substring(7, authorization.length);
  const decode = jwt.decode(token);
  const { userId } = decode;
  return userId;
};

module.exports = router;
