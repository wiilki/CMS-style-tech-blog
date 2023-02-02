const router = require("express").Router();
const { Comment } = require("../../models/");
const withAuth = require("../../utils/auth");

router.get('/', (req, res) => {
  Comment.findAll({})
    .then(commentData => res.json(commentData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", withAuth, (req, res) => {
  Comment.create({ ...req.body, userId: req.session.userId })
    .then(commentData => {
      res.json(commentData);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;