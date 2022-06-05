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

/**
 *  @openapi
 *  /api/v2/users/{id}:
 *  get:
 *      description: Get a json containing the user with that specific id.
 *      summary: View the user with that specific id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: string
 *            description: The ID of the user to return.
 *            example: 6287f53594cf2c342a3a9d81
 *      responses:
 *          200:
 *              description: 'User'
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Not found
 */

router.get('/:id',async(req, res) =>{
    let user = await User.findById(req.params.id);
    if(user == null) res.status(404).json({ error: 'Not found'});
    else res.status(200).json(userToLink(user));
})

/**
 *  @openapi
 *  /api/v2/users:
 *  post:
 *      description: Create a new User
 *      summary: used to create a new user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: User Saved correctly
 *          400:
 *              description: A field of the body (username or password) is empty
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: missing field
 *          409:
 *              description: Username already exist
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Already exist
 */

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


/**
 *  @openapi
 *  /api/v2/users/{id}:
 *  put:
 *      description: Update the user with that specific id. In the body of the method you can insert all the data you want to update; the data that will not be inserted in the body will remain the same as before the call.
 *      summary: used to update the user with id={id}
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: string
 *            description: The ID of the User to modify.
 *            example: 6287f53594cf2c342a3a9d81
 *      requestBody:
 *          required: false
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: User update correctly
 *          404:
 *              description: Tire id incorrect
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Not found
 *          400:
 *              description: A field of the body has not a valid value
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: the variable {field} has not a (valid) value
 *          409:
 *              description: Username already exist
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Already exist
 */

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

/**
 *  @openapi
 *  /api/v2/users/{id}:
 *  delete:
 *      description: Delete the user with that specific id.
 *      summary: Delete the tire with id={id}
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: string
 *            description: The ID of the user to delete.
 *            example: 6287f53594cf2c342a3a9d81
 *      responses:
 *          204:
 *              description: User removed correctly
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: User removed
 *          404:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Not found
 */

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