const { Comment } = require('../models');

const commentData =
  [
    {
      body: "That's awesome!",
      user_id: 1,
      post_id: 3
    },
    {
      body: "Interesting post",
      user_id: 2,
      post_id: 2
    },
    {
      body: "Cool!",
      user_id: 3,
      post_id: 1
    }
  ]

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;