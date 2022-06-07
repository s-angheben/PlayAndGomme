const express = require('express');
const router = express.Router();
const infoAzienda = require('./models/infoazienda');



//GET

/**
 * @openapi
 * 
 *  /api/v2/data:
 *      get:
      description: >-
        Get a json with the data regarding the company information.
      summary: Take data regarding company
      responses:
        '200':
          description: 'API that takes all the information of the company from the database and returns them in a json having the structure indicated above.'
          content:
            application/json:
              schema:
                type: array
                items:
 *                      infoazz:
                        type: object
                        required:
                            - nome
                            - descrizione
                            - indirizzo
                            - orari
                            - numero_telefono
                            - email
                            - news
                            - instagram
                            - facebook
                            - youtube
                        properties:
                            nome:
                                type: string
                                description: 'Name of the company'
                            descrizione:
                                type: string
                                description: 'Description of the company'
                            indirizzo:
                                type: string
                                description: 'Address of the company'
                            orari:
                                type: string
                                description: 'opening time of the company'
                            numero_telefono:
                                type: number
                                description: 'Telephone number that customers can contact in case of difficulty'
                            email:
                                type: string
                                description: 'Email that customers can contact in case of difficulty'
                            news[]:
                                type: array
                                description: 'Array of news or elements composed of 2 strings: Title and Text. This tool allows you to give additional information to customers'
                            instagram:
                                type: string
                                description: 'Link to the company s instagram if it has one or "null" if not'
                            facebook:
                                type: string
                                description: 'Link to the company s facebook if it has one or "null" if not'
                            youtube:
                                type: string
                                description: 'Link to the company s youtube if it has one or "null" if not'
 * 
 */

router.get('/',async(req, res) =>{
    //let dati = await infoAzienda.find();
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
        aziendaDati = await infoAzienda.find();
    }
    console.log(aziendaDati);
    var dati = aziendaDati[0];
    console.log(dati);
    res.status(200).json(dati);
});

function soloNumeri(str){
    return /^[0-9]+$/.test(str);
}

function ValidURL(str) { 
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/; 
    if(!regex .test(str)) {
        return false; 
    } else { 
        return true; 
    }
} 




//POST

/**
 *  @openapi
 *  /api/v2/data:
 *  post:
      description: >-
        Receive a json with information regarding the data you want to change and the new data.
      summary: Change the parameters of the company
 *       requestBody:
            description: 'The API receives in input a json with the illustrated structure. Note that some fields of this structure (Array and Title) are used only for some options. More specifically, if the "oggetto" argument of the json is any of the database fields, the API changes the content of this database field with the one contained in "text". If the "oggetto" is "news", on the other hand, the API saves the new one and deletes those indicated in the "array" field.'
            content:
                application/json:
                schema:
                        cambia:
                            type: object
                            required:
                                - oggetto
                                - titolo
                                - text
                                - array[]
                            properties:
                                oggetto:
                                    type: string
                                    description: 'String containing the action to perform with the other data'
                                titolo:
                                    type: number
                                    description: 'Parameter used only to add News. This field is the title of the new news'
                                text:
                                    type: string
                                    description: 'String containing the new item to save. In case of News this element is the text of the news to be added'
                                array[]:
                                    type: array
                                    description: 'Array containing the ids of the news to be removed'


 *      responses:
 *          '201':
                description: 'If the operation was successful the API saves or deletes the new parameter and returns a 201 message.'
                content:
                    application/json:
                    schema:
                        type: array
                        items:
                        risposta:
                            type: object
                            required:
                                - status
                                - successo
                            properties:
                                status:
                                    type: number
                                    description: 'Response type number: 201 for success and 400 for error.'
                                successo:
                                    type: string
                                    description: 'Message that tells whether the operation was successful or not and clarifies the possible causes of the failure.'

 *          400:
 *              description: 'If the operation fails, a message with status 400 is sent'
                content:
                application/json:
                    schema:
                        type: array
                        items:
                            risposta:
                                type: object
                                required:
                                    - status
                                    - successo
                                properties:
                                    status:
                                        type: number
                                        description: 'Response type number: 201 for success and 400 for error.'
                                    successo:
                                        type: string
                                        description: 'Message that tells whether the operation was successful or not and clarifies the possible causes of the failure.'
            404:
 *              description: 'If the operation fails due to an element not found, a message with status 404 is sent'
                content:
                application/json:
                    schema:
                        type: array
                        items:
                            risposta:
                                type: object
                                required:
                                    - status
                                    - successo
                                properties:
                                    status:
                                        type: number
                                        description: 'Response type number: 201 for success and 400 for error.'
                                    successo:
                                        type: string
                                        description: 'Message that tells whether the operation was successful or not and clarifies the possible causes of the failure.'
 */



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
        if(req.body.array.length > 0){
            for (var i=(req.body.array.length - 1); i>=0; i--){
                var ii = 0;
                while (dati.news[ii]._id.toString() != req.body.array[i]){
                    ii++;
                    if(ii >= dati.news.length){
                        res.status(404).json({status: 404, successo: 'News da eliminare non trovata riprovare'});
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
        }else{
            res.status(400).json({status: 400, successo: 'Per inserire una News servono sia il Titolo che il Testo'})
            return;
        }
    }else if(req.body.oggetto == 'youtube'){
        if(ValidURL(req.body.text)||(req.body.text == 'null')){
            dati.youtube = req.body.text;
        } else{
            res.status(400).json({status: 400, successo: 'URL inserito non valido'})
            return;
        }
    }else if(req.body.oggetto == 'facebook'){
        if(ValidURL(req.body.text)||(req.body.text == 'null')){
            dati.facebook = req.body.text;
        } else{
            res.status(400).json({status: 400, successo: 'URL inserito non valido'})
            return;
        }
    }else if(req.body.oggetto == 'instagram'){
        if(ValidURL(req.body.text)||(req.body.text == 'null')){
            dati.instagram = req.body.text;
        } else{
            res.status(400).json({status: 400, successo: 'URL inserito non valido'})
            return;
        }
    }else{
        res.status(400).json({status: 400, successo: 'Operazione selezionata non valida!'})
        return;
    }
    dati = await dati.save();
    res.status(201).json({status: 201, successo: 'caricamento avvenuto con successo!'});
});



module.exports = router;  