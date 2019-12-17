var express = require('express');
var router = express.Router();
var User = require('../models/user');
const Joi = require("joi");

/**
 * Create a new user
 *
 * @param {req.body.username} Display name of the new user
 * @param {req.body.first_name} First name of the user - optional
 * @param {req.body.last_name} Last name of the user - optional
 * @param {req.body.city} City user lives in - optional
 * @param {req.body.primary_email} Email address of the user
 * @param {req.body.password} Password for the user
 * @return {201, {username,primary_email}} Return username and others
 */
router.post('/', function(req, res) {
  let schema = Joi.object().keys({
    username: Joi.string()
        .lowercase()
        .alphanum()
        .min(3)
        .max(32)
        .required(),
    primary_email: Joi.string()
        .lowercase()
        .email()
        .required(),
    first_name: Joi.string().allow(""),
    last_name: Joi.string().allow(""),
    city: Joi.string().default(""),
    password: Joi.string()
        .min(8)
        .required()
  });
  Joi.validate(
      req.body,
      schema,
      { stripUnknown: true },
      async (err, data) => {
        if (err) {
          const message = err.details[0].message;
          console.log(`User.create validation failure: ${message}`);
          res.status(400).send({ error: message });
        } else {
          // Try to create the user
          let user = new User(data);
          try {
            await user.save();
            res.status(201).send({
              username: data.username,
              primary_email: data.primary_email
            });
          } catch (err) {
            // Error if username or email is already in use
            if (err.code === 11000) {
              if (err.message.indexOf("username_1") !== -1)
                res.status(400).send({ error: "username already in use" });
              if (err.message.indexOf("primary_email_1") !== -1)
                res.status(400).send({ error: "email address already in use" });
            }
            // Something else in the username failed
            else res.status(400).send({ error: "invalid username" });
          }
        }
      }
  )
});

/**
 * See if user exists
 *
 * @param {req.params.username} Username of the user to query for
 * @return {200 || 400}
 */
router.head("/:username", async (req, res) => {
  let user = await User.findOne({
    username: req.params.username.toLowerCase()
  });
  if (!user)
    res.status(404).send({ error: `unknown user: ${req.params.username}` });
  else
    res.status(200).end();
});

/**
 * Fetch user information
 *
 * @param {req.params.username} Username of the user to query for
 * @return {200, {username, primary_email, first_name, last_name, city}}
 */
router.get("/:username", async (req, res) => {
  let user = await User.findOne({
    username: req.params.username.toLowerCase()
  })
      .exec();
  if (!user)
    res.status(404).send({ error: `unknown user: ${req.params.username}` });
  else {
    res.status(200).send({
      username: user.username,
      primary_email: user.primary_email,
      first_name: user.first_name,
      last_name: user.last_name,
      city: user.city,
    });
  }
});

/**
 * Log a user in
 *
 * @param {req.body.username} Username of user trying to log in
 * @param {req.body.password} Password of user trying to log in
 * @return { 200, {username, primary_email} }
 */
router.post("/session", (req, res) => {
  let schema = Joi.object().keys({
    username: Joi.string()
        .lowercase()
        .required(),
    password: Joi.string().required()
  });
  Joi.validate(req.body, schema, { stripUnknown: true }, (err, data) => {
    if (err) {
      const message = err.details[0].message;
      console.log(`Login validation failure: ${message}`);
      res.status(400).send({ error: message });
    } else {
      User.findOne({ username: data.username }, (err, user) => {
        if (err) res.status(500).send({ error: "internal server error" });
        else if (!user) res.status(401).send({ error: "unauthorized" });
        else if (user.authenticate(data.password)) {
          req.session.regenerate(() => {
            req.session.user = user;
            console.log(
                `Login success: ${req.session.user.username}`
            );
            res.status(200).send({
              username: user.username,
              primary_email: user.primary_email
            });
          });
        } else {
          console.log(`Login failed. Incorrect credentials.`);
          res.status(401).send({ error: "unauthorized" });
        }
      });
    }
  });
});

/**
 * Log a user out
 *
 * @return { 204 if was logged in, 200 if no user in session }
 */
router.delete("/session", (req, res) => {
  if (req.session.user) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(200).end();
  }
});

module.exports = router;
