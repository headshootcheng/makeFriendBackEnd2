require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
//const session = require("express-session");
const passport = require("passport");
const http = require("http");
const https = require("https");
const fs = require("fs");
const IS_PROD = process.env.NODE_ENV === "production";
const socketio = require("socket.io");
const { addUser, getUser, removeUser } = require("./data/roomLogic");

if (IS_PROD) {
  server = https.createServer(
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
  );
} else {
  server = http.createServer(app);
}

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("new connection");

  socket.on("join", ({ name, userId, username }) => {
    const { user } = addUser({
      id: socket.id,
      username: username,
      userId: userId,
      room_name: name,
    });

    if (user) {
      console.log(user.room_name);
      socket.join(user.room_name);

      io.sockets.in(user.room_name).emit("message", {
        username: "admin",
        userId: 0,
        text: `${user.username}!  Welcome to room ${user.room_name}!!!`,
      });
    }
  });

  socket.on("sendMessage", ({ userId, text }) => {
    const user = getUser(userId);
    if (user) {
      io.sockets.in(user.room_name).emit("message", {
        username: user.username,
        userId: user.userId,
        text: text,
      });
    }
  });

  socket.on("quitRoom", ({ userId }, callback) => {
    const user = removeUser(userId);
    if (user) {
      io.sockets.in(user.room_name).emit("message", {
        username: "admin",
        userId: 0,
        text: `${user.username} has quited !!!`,
      });
      callback({ msg: "success" });
    } else {
      callback({ msg: "error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

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

server.listen(process.env.PORT, function () {
  console.log("Server Start");
});
