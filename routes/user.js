const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../data/account");
const { Result } = require("express-validator");

const createRoom = `INSERT INTO chatroom (room_name,room_owner) VALUES (?,?)`;
const getRoomList = `select * from chatroom`;

router.get(
  "/userInfo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //console.log(req.user);
    res.json(req.user);
  }
);

router.post("/createNewRoom", (req, res) => {
  const { roomName, owner } = req.body;
  User.query(createRoom, [roomName, owner]);
  //console.log(roomName);
  res.json({ success: "sucess" });
});

router.get("/getRoomInfo", (req, res) => {
  User.query(getRoomList, [], (err, result) => {
    //console.log("reuslt ", result);
    res.json({ roomList: result });
  });
});

module.exports = router;
