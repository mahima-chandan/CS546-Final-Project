var express = require('express');
var router = express.Router();

module.exports = router; 
router.get('/', function(req, res){
	req.session.destroy(function(){
	   console.log("user logged out.")
	 
	});
	req.session = null; 
	res.redirect('/');
 });
 module.exports = router; 
