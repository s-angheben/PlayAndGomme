var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const newsScheme = new Schema({
    Titolo : {
        type: String,
        required: true
    },
    Testo : {
	    type: String,
        required: true
    }
})

const infoAziendaSchema = new Schema({
    nome : {
        type: String,
        required: true
    },
    descrizione : {
        type: String,
        required: true
    },
    indirizzo : {
        type: String,
        required: true
    },
    orari: {
        type: String,
        required: true
    },
    numero_telefono: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    news: {
        type: [newsScheme],
        required: false
    },
    instagram: {
        type: String,
        required: false
    },
    facebook: {
        type: String,
        required: false
    },
    youtube: {
        type: String,
        required: false
    },
});


const infoAzienda = mongoose.model('infoazienda', infoAziendaSchema);
module.exports = infoAzienda;