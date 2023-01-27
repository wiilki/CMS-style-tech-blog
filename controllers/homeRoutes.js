const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('homepage', { 
        title: 'Homepage', 
        message: 'Welcome to the homepage' 
    });
});

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/home');
      return;
    }
  
    res.render('login');
  });

  router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  
    res.render('signup');
  });

module.exports = router;