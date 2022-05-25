const express = require('express');
const router = express.Router();
const User = require('./models/user');

function userToLink(user) {
    return {
		self: '/api/v2/users/' + user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        username: user.username
	};
}

router.get('/',async(req, res) =>{
    let allUsers = await User.find();
    if(allUsers == null) res.status(404).json({ error: 'Not found'});
    else res.status(200).json(allUsers.map(userToLink));
})

router.post('', async (req, res) => {
    if (req.body.username == null) {
        return res.status(400).json({ error: 'missing username field'});
    }
    if (req.body.password == null) {
        return res.status(400).json({ error: 'missing password field'});
    }

    let alreadyExist = await User.findOne({username : req.body.username});
    if (alreadyExist != null) {
        return res.status(409).json({ error: 'username already exist' });
    }

    let user = new User({
        username: req.body.username,
        password: req.body.password
    });

    user = await user.save();
    res.location("/api/v2/users/" + user.id).status(201).send();
});

module.exports = router;