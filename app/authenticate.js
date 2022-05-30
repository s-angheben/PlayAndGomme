const jwt = require('jsonwebtoken');

const authenticate = function(req, res, next) {
	console.log('Authentication');
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
	// if there is no token
	if (!token) {
		console.log('No token');
		return res.status(401).send({ 
			success: false,
			message: 'No token provided.'
		});
	}
	// decode token, verifies secret and checks exp
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {			
		if (err) {
			console.log('Token not ok')
			return res.status(403).send({
				success: false,
				message: 'Failed to authenticate token.'
			});		
		} else {
			// if everything is good, save to request for use in other routes
			console.log('Token ok');
			req.loggedUser = decoded;
			next();
		}
    });
};

module.exports = authenticate;