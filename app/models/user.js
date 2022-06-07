var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 
 *  @openapi
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              required:
 *                  - username
 *                  - password
 *              properties:
 *                  admin:
 *                      type: boolean
 *                      description: 'If is an adimin or not'
 *                  name:
 *                      type: string
 *                      description: 'Name of the user'
 *                  surname:
 *                      type: string
 *                      description: 'Surname of the user'
 *                  email:
 *                      type: string
 *                      description: 'email of the user'
 *                  phone:
 *                      type: number
 *                      description: 'phone of the user'
 *                  username:
 *                      type: string
 *                      description: 'username of the user'
 *                  password:
 *                      type: string
 *                      description: 'password of the user'
 */

const userSchema = new Schema({
    admin : {
        type: Boolean,  // possible to give admin permission only by hand
    },
    name : {
        type: String,
    },
    surname : {
	    type: String,
    },
    email : {
	    type: String,
    },
    phone : {
	    type: Number,
    },
    username : {
	    type: String,
        required: true
    },
    password : {
	    type: String,
        required: true
    },
})

module.exports = mongoose.model('User', userSchema);
