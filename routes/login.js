const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const users = require('../data/users');
const bcrypt = require('bcryptjs');
/*
var User = require('../data/signup');
var Users = require('../routes/signup');
*/

router.post('/', async (req, res) => {
  try {
    if (req.session.AuthCookie) {
      res.redirect('/');
      return;
    }
    const {username, pwd} = req.body;
    const user = users.getUserByName(username);
    if (user && users.verifyPassword(user, pwd)) {
      req.session.AuthCookie = req.sessionID;
      req.session.user = user;
      res.redirect(user.balance ? 'bet' : 'fund');
    }
  }
  else {
    displayMessage = "login"
    loginMessage = "Username/Password not correct"
    res.status(401).render("login", {displayMessage, loginMessage});
  }
  catch (e) {
    res.status(401).render('login', {error: true});
    console.log(e.message);
  }
});

router.get('/', async (req, res) => {
  res.redirect('/');
});

router.get("/", async (req, res) => {
  if (!req.session.AuthCookie) {
    res.render('login', {});
    return;
  }
  const user = req.session.user;
  if (user)
    if (user.balance) {
      console.log(2);
      res.redirect('bet');
      console.log(3);
    }
    else
      res.redirect('fund');
  else
    res.status(401).send("No user but active session error");
}

/*
  const user = req.session.user;
  if (user && await users.getUserById(user._id))
    res.redirect("/bet");
  if (user) {
    try {
      if (await users.getUserById(user._id))
    }
    catch (e) {
      displayMessage = "login"
      loginMessage = "Username/Password not correct"
      res.status(401);
      res.render("login", { displayMessage: displayMessage, loginMessage: loginMessage });
    }
  }
  else {
    console.log(1);
    res.redirect('/signup');
  }
});
*/

module.exports = router;