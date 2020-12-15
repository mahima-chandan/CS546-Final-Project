const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const {users} = require('../data');

router.get('/', async (req, res) => {
  res.render('signup', {cssOverrides: "signup.css"});
});

router.post('/', async (req, res) => {
  try {
	  const {username, pwd, cpwd} = req.body;
    if (!username || !pwd || !cpwd)
      throw Error(`required fields missing`);
    let user = await users.getUserByName(username);
    if (user)
      throw Error(`that user already exists, please select another`);
    if (username.length < 8 || username.length > 16)
      throw Error(`username length must be 8-16 characters long`);
    if (pwd.length < 8 || pwd.length > 16)
      throw Error(`password length must be 8-16 characters long`);
    if (pwd !== cpwd)
      throw Error(`password and confirmed password do not match`);
    if (!pwd.match(/[A-Z]/) || !pwd.match(/[a-z]/) || !pwd.match(/[0-9]/))
      throw Error(`password must have 1 upper, 1 lower, and 1 number minimum`);

    await users.createUser(username, pwd);
    res.render('login', {cssOverrides: "signup.css", username})
  }
  catch (e) {
    res.render('signup', {error: e.message,
                          cssOverrides: "signup.css"});
  }
});

/*

	if (!personInfo.firstname ||!personInfo.lastname ||!personInfo.email || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) {
					var c;
					User.findOne({}, (err, data) => {

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						var newPerson = new User({
                            unique_id: c,
                            firstname: personInfo.firstname,
                            lastname: personInfo.lastname,
							email: personInfo.email,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} 
	}
});
*/

module.exports = router;
