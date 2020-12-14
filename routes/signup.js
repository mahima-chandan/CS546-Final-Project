const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const data = require('../data');


router.post('/signup', (req, res, next) => {
	console.log(req.body);
	var personInfo = req.body;


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
module.exports = router;
