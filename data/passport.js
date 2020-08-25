const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("./account");
const checkUsername = `SELECT * FROM account WHERE account_name = ? `;

const passport = (passport) => {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "username",
      },
      function (username, password, done) {
        User.query(checkUsername, [username], (err, result) => {
          if (err) throw err;
          if (result.length === 0) {
            return done(null, false, {
              message: "Wrong Username or Password!!!",
            });
          } else {
            //console.log(result[0].account_password);
            bcrypt.compare(password, result[0].account_password, function (
              err,
              match
            ) {
              if (err) throw err;
              if (match) {
                let { account_name, account_email } = result[0];
                return done(
                  null,
                  { username: account_name, email: account_email },
                  {
                    message: "Successfully login!!!",
                  }
                );
              } else {
                return done(null, false, {
                  message: "Wrong Username or Password!!!",
                });
              }
            });
          }
        });
      }
    )
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "jwt_secret",
      },
      (jwt_payload, done) => {
        return done(null, jwt_payload);
      }
    )
  );
};

module.exports = passport;
