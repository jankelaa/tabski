const { Router } = require("express");
const Joi = require("joi");

const userService = require("../services/user.service");
const { isNil } = require("lodash");

const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const users = await userService.getAllUsers();

      const data = { users };

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  })
  .post(async (req, res) => {
    try {
      const validationSchema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
          // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
          .min(8)
          .required(),
      });

      const validate = validationSchema.validate(req.body);

      if (!isNil(validate.error)) {
        return res.status(400).send(validate.error.message);
      }

      const { name, email, password } = req.body;
      const user = await userService.createUser(name, email, password);

      const data = { user };

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

      const user = await userService.getUserById(id);

      const data = { user };

      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })
  .put(async (req, res) => {
    try {
      const validationSchema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      });

      const validate = validationSchema.validate(req.body);

      if (!isNil(validate.error)) {
        return res.status(400).send(validate.error.message);
      }

      const { id } = req.params;
      const { name, email, password } = req.body;
      const user = await userService.updateUserById(id, name, email, password);

      const data = { user };

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.params;

      const isDeleted = await userService.deleteUserById(id);

      const data = { isDeleted };

      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

module.exports = router;
