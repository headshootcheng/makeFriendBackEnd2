const sqlCommand = {
  checkAccountName: `SELECT * FROM account WHERE account_name = ? `,
  checkAccountEmail: `SELECT * FROM account WHERE account_email = ? `,
  insertAccount: `INSERT INTO account (account_name, account_email, account_password) VALUES (?,?,?)`,

  checkUserTable: `SELECT * FROM userList WHERE email = ? AND provider = ?`,
  insertNewUser: `INSERT INTO userList (id, username, email, provider) VALUES (?,?,?,?)`,

  createRoom: `INSERT INTO chatroom (room_name,room_owner,room_ownerId) VALUES (?,?,?)`,
  getRoomList: `SELECT * FROM chatroom`,
  deleteRoom: `DELETE FROM chatroom WHERE room_ownerId = ? AND room_name = ?`,
};

module.exports = sqlCommand;
