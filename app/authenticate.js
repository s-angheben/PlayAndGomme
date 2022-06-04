const jwt = require('jsonwebtoken');

const authenticate = function(req, res, next) {
	console.log('Authentication');
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) {
		console.log('No token');
		return res.status(401).send({ 
			error: 'No token provided.'
		});
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {			
		if (err) {
			console.log('Token not ok')
			return res.status(403).send({
				error: 'Failed to authenticate token.'
			});		
		} else {

			console.log('Token ok');
			req.loggedUser = decoded;
			next();
		}
    });
};

module.exports = authenticate;