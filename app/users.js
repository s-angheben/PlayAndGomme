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

function emailIsValid(email) {
    var regex_email_valida = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex_email_valida.test(email);
}

function phoneIsVaid(phone){
    if(isNumeric(phone) == false || Number.isInteger(Number(phone)) == false || Number(phone) < 0 ||  phone.toString().split('').map(Number).length != 10){
        return false;
    }
    return true;
}

function isNumeric(num){
    return !isNaN(num)
}

/**
 * @openapi
 * 
 *  /api/v2/users:
 *      get:
 *          description: Gets the list of all Users
 *          summary: View all the Users
 *          responses:
 *              200:
 *                  description: 'Collection of users'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/User'
 *              404:
 *                  description: Not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: Not found
 */

router.get('/',async(req, res) =>{
    let allUsers = await User.find();
    if(allUsers == null) res.status(404).json({ error: 'Not found'});
    else res.status(200).json(allUsers.map(userToLink));
})

router.get('/:id',async(req, res) =>{
    let user = await User.findById(req.params.id);
    if(user == null) res.status(404).json({ error: 'Not found'});
    else res.status(200).json(userToLink(user));
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

router.put('/:id', async (req,res) =>{
    let user = await User.findById(req.params.id).exec();
    if(user == null) res.status(404).json({ error: 'Not found'});

    let keys = Object.keys(req.body);
    for(let i=0; i<keys.length; i++){
        if(req.body[keys[i]] == ''){
            return res.status(400).json({ error: 'the variable ' + keys[i] + ' has not a value'});
        }
        switch(keys[i]){
            case 'email':
                if(emailIsValid(req.body[keys[i]]) == false){
                    return res.status(400).json({error: 'email field is not valid'});
                }
                break;
            case 'phone':
                if(phoneIsVaid(req.body[keys[i]]) == false){
                    return res.status(400).json({ error: 'phone number is not valid'});
                }
                break;
            case 'username':
                let alreadyExist = await User.findOne({username : req.body[keys[i]]});
                if (alreadyExist != null) {
                    return res.status(409).json({ error: 'username already exist' });
                }
                break;
        }
        user[keys[i]] = req.body[keys[i]];
    }

    user = await user.save();
    console.log('User update sucesfully');
    res.location("/api/v2/users/" + user.id).status(201).send();
});

router.delete('/:id', async (req, res) => {
    let user = await User.findById(req.params.id).exec();
    if (user == null) {
        res.status(404).json({error: 'user not found'})
        return;
    }
    await user.deleteOne()
    res.location("/api/v2/users").status(204).send();
});



module.exports = router;