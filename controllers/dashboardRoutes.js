const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
  Post.findAll({
    where: { user_id: req.session.user_id },
    include: [
      {
        model: Comment,
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((postData) => {
      // serialize data before passing to template
      const posts = postData.map((post) => post.get({ plain: true }));
      res.render('dashboard', { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/post', withAuth, (req, res) => {
  Post.findAll({
    where: { user_id: req.session.user_id },
    include: [
      {
        model: Comment,
        include: {
          model: User
        },
      },
      {
        model: User
      },
    ],
  })
    .then((postData) => {
      // serialize data before passing to template
      const posts = postData.map((post) => post.get({ plain: true }));
      res.render('newPost', { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
