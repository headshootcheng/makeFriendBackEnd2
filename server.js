require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");

// Solve the CORS policy
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  })
);

// app.use(bodyParser.urlencoded({ extended: false }));

//Translate the body of request into json format
app.use(bodyParser.json());

require("./data/passport")(passport);
//Passport middleware
app.use(passport.initialize());

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));

app.listen(8080, function () {
  console.log("Server Start");
});
