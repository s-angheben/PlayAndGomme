const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tireSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    diameter: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['invernali', 'estive', 'quattro_stagioni'],
        required: true
    }
}, {timestamps: true});

const Tire = mongoose.model('Tire', tireSchema);
module.exports = Tire;