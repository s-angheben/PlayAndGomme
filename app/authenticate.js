const jwt = require('jsonwebtoken');
const ApiError = require('./utils/apiError');

const authenticate = function(req, res, next) {
	console.log('Authentication');
	bodyToken = null;
	if(!!req.body) bodyToken=req.body.token;
    var token = bodyToken || req.query.token || req.headers['x-access-token'];

	if (!token) {
		console.log('No token');
		throw new ApiError(401, "No token provided");
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {			
		if (err) {
			console.log('Token not ok')
			throw new ApiError(403, "Failed to authenticate token");

		} else {
			console.log('Token ok');
			req.loggedUser = decoded;
			console.log(decoded);
			next();
		}
    });
};

module.exports = authenticate;