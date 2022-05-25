var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
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
