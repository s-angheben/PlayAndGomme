import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const materialOrderedSchema = new Schema({
    "materialId" : String,
    "quantity" : {
	    type: Number,
	    min: 1
    }
})

const appointmentSchema = new Schema({
    appointmentPlaced: Date,
    service : {
	    type: String,
	    enum: ['riparazione', 'controllo', 'cambio_gomme']
    },
    userId : String,
    materials : [materialOrderedSchema],
    date : Date,
    alreadyPaid : Boolean
})


//module.exports = mongoose.model('Appointment', appointmentSchema);
export default mongoose.model('Appointment', appointmentSchema);

    
