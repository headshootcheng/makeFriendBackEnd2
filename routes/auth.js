const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../data/account");

const checkAccountName = `SELECT * FROM account WHERE account_name = ? `;
const checkAccountEmail = `SELECT * FROM account WHERE account_email = ? `;
const insertAccount = `INSERT INTO account (account_name, account_email, account_password) VALUES (?,?,?)`;

const checkUserTable = `SELECT * FROM userList WHERE email = ? AND provider = ?`;
const insertNewUser = `INSERT INTO userList (id, username, email, provider) VALUES (?,?,?,?)`;
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
        User.query(checkAccountName, [value], function (err, result) {
          if (result && result.length > 0) {
            reject(new Error("This username is already existed"));
          } else {
            return resolve(true);
          }
        });
      });
    }),
    check("email").custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        User.query(checkAccountEmail, [value], function (err, result) {
          if (result && result.length > 0) {
            reject(new Error("This email is already existed"));
          } else {
            return resolve(true);
          }
        });
      });
    }),
  ],
  (req, res) => {
    const { username, email, password } = req.body;
    const errormsg = [];
    const errors = validationResult(req);
    //console.log(errors);
    if (errors.array().length != 0) {
      errors.array().map((error) => {
        errormsg.push(error.msg);
      });
      //console.log("errormsg: " + errormsg);
      res.json({ content: errormsg, type: 2 });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        User.query(insertAccount, [username, email, hash]);
      });
      res.json({
        content: ["Congrat!!! You are successfully registered!!!"],
        type: 1,
      });
    }
  }
);

router.post("/login", function (req, res, next) {
  passport.authenticate("local", { session: false }, function (
    err,
    user,
    info
  ) {
    if (user) {
      //console.log(user);
      const { username, email } = user;
      User.query(checkUserTable, [email, "Local"], (err, result) => {
        if (result && result.length > 0) {
          const { id, username, email, provider } = result[0];
          userInfo = {
            userId: id,
            username: username,
            email: email,
            provider: provider,
          };
          const token = jwt.sign(userInfo, "jwt_secret");
          res.json({ token: token });
        } else {
          const userId = Math.floor(Math.random() * 10000);
          //console.log(userId);
          userInfo = {
            userId: userId,
            username: username,
            email: email,
            provider: "Local",
          };
          User.query(insertNewUser, [userId, username, email, "Local"]);
          const token = jwt.sign(userInfo, "jwt_secret");
          res.json({ token: token });
        }
      });
    } else {
      res.json(info);
    }
  })(req, res, next);
});

router.post("/thirdParty", (req, res, next) => {
  //console.log("req:", req.body);
  const { username, email, provider } = req.body;
  var userInfo = {};
  User.query(checkUserTable, [email, provider], (err, result) => {
    if (result && result.length > 0) {
      const { id, username, email, provider } = result[0];
      userInfo = {
        userId: id,
        username: username,
        email: email,
        provider: provider,
      };
      const token = jwt.sign(userInfo, "jwt_secret");
      res.json({ token: token });
    } else {
      const userId = Math.floor(Math.random() * 10000);
      //console.log(userId);
      userInfo = {
        userId: userId,
        username: username,
        email: email,
        provider: provider,
      };
      User.query(insertNewUser, [userId, username, email, provider]);
      const token = jwt.sign(userInfo, "jwt_secret");
      res.json({ token: token });
    }
  });
});

// router.post(
//   "/local",
//   function (req, res, next) {
//     next();
//   },
//   passport.authenticate("local"),
//   (req, res) => {
//     res.send(req.user);
//   }
// );

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     session: false,
//     scope: ["profile", "email"],
//   })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }, (err, user, info) => {
//     if (user) {
//       const token = jwt.sign(user, "jwt_secret");
//       console.log(token);
//       res.redirect("http://127.0.0.1:3000", token);
//       //res.json({ token: token });
//     }
//   })
// );

module.exports = router;
