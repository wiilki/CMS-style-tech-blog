
const { Post } = require('../models');

const postData = [
  {
    title: "Why MVC is so important",
    description: "MVC allows developers to maintain a true separation of concerns, devising their code between the Model layer for data, the View layer for design, and the Controller layer for application logic."
  },
  {
    title: "Authentication vs. Authorization",
    description: "There is a difference between authentication and authorization. Authentication means confirming your own identity, whereas authorization means being allowed access to the system."
  },
  {
    title: "Object-Relational Mapping",
    description: "I have really loved learning about ORMS. It's really simplified the way I create queries in SQL!"
  }
]

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;