require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const JWTStrategy = require("passport-jwt").Strategy;
//const GoogleStrategy = require("passport-google-oauth2").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("./account");
const { checkAccountName } = require("./sqlCommand");

const passport = (passport) => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "username",
      },
      function (username, password, done) {
        User.query(checkAccountName, [username], (err, result) => {
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

  // passport.use(
  //   new GoogleStrategy(
  //     {
  //       clientID: process.env.GOOGLE_ID,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //       callbackURL: "/auth/google/callback",
  //       passReqToCallback: true,
  //     },
  //     function (request, accessToken, refreshToken, profile, done) {
  //       return done(
  //         null,
  //         { username: profile.displayName, email: profile.email },
  //         {
  //           message: "Successfully login!!!",
  //         }
  //       );
  //     }
  //   )
  // );

  // passport.serializeUser(function (user, done) {
  //   done(null, user);
  // });

  // passport.deserializeUser(function (user, done) {
  //   done(null, user);
  // });
};

module.exports = passport;
