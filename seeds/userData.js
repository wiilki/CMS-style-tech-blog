const { User } = require("../models");

const userData = [
  {
    username: "saladdressing",
    password: "password12345"
  },
  {
    username: "lernantino",
    password: "password12345"
  },
  {
    username: "amiko2k20",
    password: "password12345"
  }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
