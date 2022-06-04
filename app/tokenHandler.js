const express = require('express');
const router = express.Router();
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const ApiError = require('./utils/apiError');

router.post('',async (req,res) =>{
    if (req.body == null)                          throw new ApiError(400, "The request is empty");
    if (req.body.username == null)                 throw new ApiError(400, "Authentication failed. Missing username field");
    if (req.body.password == null)                 throw new ApiError(400, 'Authentication failed. Missing password field');

    let userExist = await User.findOne({username : req.body.username});

    if (userExist == null)                          throw new ApiError(404, 'Authentication failed. Incorrect username.');
    if(userExist.password != req.body.password)     throw new ApiError(400, 'Authentication failed. Incorrect password.');

    let adminPermission = false;
    if (userExist.admin) adminPermission = true;
    var payload = {
		username: userExist.username,
        id: userExist.id,
        admin: adminPermission
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