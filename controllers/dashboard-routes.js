const router = require("express").Router();
const { Post } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
  Post.findAll({
    where: { user_id: req.session.user_id }
  })
    .then(allPostData => {
      const posts = allPostData.map((post) => post.get({ plain: true }));

      res.render("displayPost", {
        posts
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect("login");
    });
});

router.get("/post", withAuth, (req, res) => {
  res.render("newPost", {
  });
});

module.exports = router;