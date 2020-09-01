const users = [];

const addUser = ({ id, username, userId, room_name }) => {
  const user = { id, username, userId, room_name };

  users.push(user);

  return { user };
};

const removeUser = (socketId) => {
  console.log(users);
  const user = users.find(({ id }) => id === socketId);
  console.log(user);
  return user;
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
