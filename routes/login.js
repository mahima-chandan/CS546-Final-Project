const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const users = require('../data/users');
const bcrypt = require('bcryptjs');

function manage(txt) {
  var bt = document.getElementById('submit');
  var ele = document.getElementsByTagName('input'); 

  // Loop through each element.
  for (i = 0; i < ele.length; i++) {

      // Check the element type
      if (ele[i].type == 'text' && ele[i].value == '') {
          bt.disabled = true;    // Disable the button.
          return false;
      }
      else {
          bt.disabled = false;   // Enable the button.
      }
  }
}    

router.post('/', async (req, res) => {
  try {
    if (req.session.AuthCookie) {
      res.redirect('/');
      return;
    }
    const {username, pwd} = req.body;
    const user = await users.getUserByName(username);
    if (user && await users.verifyPassword(user, pwd)) {
      req.session.AuthCookie = req.sessionID;
      req.session.user = user;
      res.redirect(user.balance >= c.appConfig.minBet ? 'bet' : 'fund');
    }
    else {
      displayMessage = "login"
      loginMessage = "Username/Password not correct"
      res.status(401).render("login", {displayMessage, loginMessage});
    }
  }
  catch (e) {
    res.status(401).render('login', {error: true});
    console.log(e.message);
  }
});

router.get('/', async (req, res, next) => {
  console.log("login.js / GET routes finds AuthCookie " + req.session.AuthCookie);
  if (!req.session.AuthCookie) {
    res.render('login', {cssOverrides: "login.css"});
    next();
    return;
  }
  console.log("req.session.user is " + JSON.stringify(req.session.user));
  const user = req.session.user;
  if (user)
    if (user.balance) {
      res.redirect('bet');
    }
    else
      res.redirect('fund');
  else {
    console.error("login.js finds no user but active session");
    res.status(401).send("No user but active session error");
  }

});

module.exports = {router,manage};