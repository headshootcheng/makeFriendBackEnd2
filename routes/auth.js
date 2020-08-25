const express = require("express");
const router = express.Router();
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../data/account");

const checkUsername = `SELECT * FROM account WHERE account_name = ? `;
const checkEmail = `SELECT * FROM account WHERE account_email = ? `;

router.get("/test", function (req, res, next) {
  res.send("test");
});

router.post(
  "/register",
  [
    check("confirmedPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),
    check("email").isEmail().withMessage("Wrong Email Format!!!"),
    check("username").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Username cannot be empty!!!");
      }
      return true;
    }),
    check("email").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Email cannot be empty!!!");
      }
      return true;
    }),
    check("password").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Password cannot be empty!!!");
      }
      return true;
    }),
    check("username").custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        User.query(checkUsername, [value], function (err, result) {
          if (result.length > 0) {
            reject(new Error("This username is already existed"));
          } else {
            return resolve(true);
          }
        });
      });
    }),
    check("email").custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        User.query(checkEmail, [value], function (err, result) {
          if (result.length > 0) {
            reject(new Error("This email is already existed"));
          } else {
            return resolve(true);
          }
        });
      });
    }),
  ],
  (req, res) => {
    const errormsg = [];
    const errors = validationResult(req);
    console.log(errors);
    if (errors.array().length != 0) {
      errors.array().map((error) => {
        errormsg.push(error.msg);
      });
      //console.log("errormsg: " + errormsg);
      res.json({ content: errormsg, type: 2 });
    } else {
      res.json({ content: ["test"], type: 1 });
    }
  }
);

module.exports = router;
