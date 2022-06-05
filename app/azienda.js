const express = require('express');
const infoazienda = require('./models/infoazienda');
const router = express.Router();
const infoAzienda = require('./models/infoazienda');



router.get('/',async(req, res) =>{
    let aziendaDati = await infoAzienda.find();
    if(aziendaDati.length == 0){
        var dat0 = new infoAzienda({
            nome: 'Play and Gomme',
            descrizione: 'Inserire una descrizione dell Azienda',
            indirizzo: 'Inserire la Via dell Azienda',
            orari: 'Inserire l orario di apertura dell Azienda',
            numero_telefono: '3333333333',
            email: 'Gommista@gmail.com',
            news: [{
                Titolo: 'NEWS DI PROVA',
                Testo: 'questa news è una prova !!!!'
            }],
            instagram: 'https://www.instagram.com/',
            facebook: 'https://www.facebook.com/',
            youtube: 'https://www.youtube.com/'
        });
        aziendaDati = await dat0.save();
    }
    aziendaDati = await infoAzienda.find();
    console.log(aziendaDati);
    console.log(aziendaDati[0]._id);
    let dati = await infoAzienda.findById(aziendaDati[0]._id).exec();
    console.log(dati);
    res.status(200).json(dati);
});

function soloNumeri(str){
    return /^[0-9]+$/.test(str);
}

router.post('', async (req, res) => {
    console.log(req.body);
    let aziendaDati = await infoAzienda.find();
    let dati = await infoAzienda.findById(aziendaDati[0]._id).exec();
    console.log(dati);
    if(req.body.oggetto == 'titolo'){
        dati.nome = req.body.text;
    }else if(req.body.oggetto == 'descrizione'){
        dati.descrizione = req.body.text;
    }else if(req.body.oggetto == 'indirizzo'){
        dati.indirizzo = req.body.text;
    }else if(req.body.oggetto == 'orari'){
        dati.orari = req.body.text;
    }else if(req.body.oggetto == 'numerotelefono'){
        console.log(soloNumeri(req.body.text));
        if(soloNumeri(req.body.text) == true){
            dati.numero_telefono = req.body.text;
        }else{
            res.status(400).json({status: 400, successo: 'Numero di telefono non valido'});
            return;
        }
    }else if(req.body.oggetto == 'email'){
        dati.email = req.body.text;
    }else if(req.body.oggetto == 'news'){
        //
        if(req.body.array.length > 0){ //elementi da eliminare
            for (var i=(req.body.array.length - 1); i>=0; i--){
                var ii = 0;
                while (dati.news[ii]._id.toString() != req.body.array[i]){
                    ii++;
                    if(ii > dati.news.length){
                        res.status(400).json({status: 400, successo: 'News da eliminare non trovata riprovare'});
                        return;
                    }
                }
                console.log(ii);
                dati.news.pop(dati.news[ii]);
            }
        }
        if((req.body.titolo != '')&&(req.body.text != '')){
            dati.news.push({
                Titolo: req.body.titolo,
                Testo: req.body.text
            });
        }
        //
    }else if(req.body.oggetto == 'youtube'){
        dati.youtube = req.body.text;
    }else if(req.body.oggetto == 'facebook'){
        dati.facebook = req.body.text;
    }else if(req.body.oggetto == 'instagram'){
        dati.instagram = req.body.text;
    }
    dati = await dati.save();
    res.status(201).json({status: 201, successo: 'caricamento avvenuto con successo!'});
    //res.status(400).json({status: 400, successo: 'caricamento fallito'});
});



module.exports = router;  