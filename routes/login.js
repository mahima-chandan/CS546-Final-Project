const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
var User = require('../data/signup');
var Users = require('../routes/signup');

router.post('/', (req, res, next) => {
	//console.log(req.body);
	User.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({ "Success": "Success!" });
        res.redirect('/bet');
			} else {
				res.send({ "Success": "Wrong username or password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

router.get("/", async (req, res) => {
  if (req.session.userID) {
    try {
      userId = req.session.userID;
      let user = await user.get(userId)
      res.redirect("/bet");
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


module.exports = router;