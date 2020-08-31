const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../data/account");
const { createRoom, getRoomList, deleteRoom } = require("../data/sqlCommand");

router.get(
  "/userInfo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //console.log(req.user);
    res.json(req.user);
  }
);

router.post("/createNewRoom", (req, res) => {
  const { roomName, owner, userId } = req.body;
  User.query(createRoom, [roomName, owner, userId]);
  res.json({ success: "success" });
});

router.get("/getRoomInfo", (req, res) => {
  User.query(getRoomList, [], (err, result) => {
    //console.log("reuslt ", result);
    res.json({ roomList: result });
  });
});

router.delete("/deleteRoom", (req, res) => {
  const { userId, roomName } = req.body;
  User.query(deleteRoom, [userId, roomName]);
  res.json({ success: "success" });
});

module.exports = router;
