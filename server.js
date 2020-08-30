require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
//const session = require("express-session");
const passport = require("passport");
const https = require("https");
const fs = require("fs");
const IS_PROD = process.env.NODE_ENV === "production";

// Solve the CORS policy
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow session cookie from browser to pass through
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  })
);

// app.use(bodyParser.urlencoded({ extended: false }));

//Translate the body of request into json format
app.use(bodyParser.json());

require("./data/passport")(passport);

//Express Session
// app.use(
//   session({
//     secret: "petercheng7788",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

//Passport middleware
app.use(passport.initialize());
// app.use(passport.session());

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));

if (IS_PROD) {
  https
    .createServer(
      {
        key: fs.readFileSync(
          "/etc/letsencrypt/live/friendchats.xyz/privkey.pem",
          "utf8"
        ),
        cert: fs.readFileSync(
          "/etc/letsencrypt/live/friendchats.xyz/cert.pem",
          "utf8"
        ),
        ca: fs.readFileSync(
          "/etc/letsencrypt/live/friendchats.xyz/chain.pem",
          "utf8"
        ),
      },
      app
    )
    .listen(process.env.PORT, function () {
      console.log("Server Start ", process.env.NODE_ENV);
    });
} else {
  app.listen(process.env.PORT, function () {
    console.log("Server Start ");
  });
}
