const express = require('express');
const router = express.Router();
const User = require('./models/user');
const jwt = require('jsonwebtoken');


router.post('',async (req,res) =>{
    if (req.body.username == '') {
        return res.status(400).json({ error: 'Authentication failed. Missing username field' });
    }
    if (req.body.password == '') {
        return res.status(400).json({ error: 'Authentication failed. Missing password field' });
    }
    let userExist = await User.findOne({username : req.body.username});

    if (userExist == null) {
        return res.status(404).json({ error: 'Authentication failed. Incorrect username.' });
    }
    if(userExist.password != req.body.password){
        return res.status(400).json({ error: 'Authentication failed. Incorrect password.' });
    }

    var payload = {
		email: userExist.email,
        id: userExist.self
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
    console.log('login ok');
	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: userExist.email,
		self: "/api/v2/" + userExist.id
	});


})

module.exports = router;