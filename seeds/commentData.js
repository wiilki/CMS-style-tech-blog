const { Comment } = require('../models');

const commentData = 
[
    {
      "body": "That's awesome!"
    },
    {
      "body": "Interesting post"
    },
    {
      "body": "Cool!"
     }
  ]

  const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;