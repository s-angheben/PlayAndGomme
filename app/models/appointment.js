var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Appointment', new Schema({
    appointmentId: String,
    userId: String
}));
    
