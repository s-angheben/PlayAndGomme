const {google} = require('googleapis');
require('dotenv').config();
var express = require('express');
var router = express.Router();
const visualizzaDate = require('./models/visualizzadate');
const { redis } = require('googleapis/build/src/apis/redis');


const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});
const TIMEOFFSET = '+02:00';

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);


//get calendario eventi
const getEvents = async (dateTimeStart, dateTimeEnd) => {
    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Europe/Rome'
        });
    
        let items = response['data']['items'];
        return items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};

//inserisci nuovo evento google calendar
const insertEvent = async (event) => {
    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};



//GET

/**
 * @openapi
 * 
 *  /api/v2/data:
 *      get:
            description: >-
                Get a json with the data regarding the dates and available time slots.
        summary: Take data regarding time slots
        responses:
            '200':
                description: 'API that, through the Google chalendars APIs, gives back a json file made of one array of the above elements. The array is made of datas that represen the ten days after the day in which the request was made.'
                content:
                application/json:
                schema:
                    type: array
                    items:
 *                      visualizzaDate:
                            type: object
                            required:
                                - gSettimana
                                - giorno
                                - slotOrari[36]
                            properties:
                                gSettimana:
                                    type: string
                                    description: 'Day of the week'
                                giorno:
                                    type: string
                                    description: 'Date in the format: dd/mm/yyyy'
                                slotOrari[36]:
                                    type: boolean
                                    description: 'Array that reports occupied slots with "true"'
 * 
 */


router.get('/',async(req, res) =>{
    var array = [new Date()];
    var dateInvio = [new visualizzaDate(array[0].getDay(), array[0].getDate(), array[0].getMonth(), array[0].getFullYear())];
    for (var i=1; i<10; i++){
        var temp = new Date(array[i-1]);
        array.push(new Date(temp.setDate(array[i-1].getDate()+1)));
        if(i>=1){
            dateInvio.push(new visualizzaDate(array[i].getDay(), array[i].getDate(), array[i].getMonth(), array[i].getFullYear()));
        }
    }
    console.log(array);
    dateInvio[0].orarioPartenza(array[0].getHours(), array[0].getMinutes());
    //CALENDARIO GOOGLE
    getEvents(array[0], array[9])
        .then((ris) => {
            console.log(ris);
            for(var i=0; i<ris.length; i++){
                var data1 = new Date(ris[i].start.dateTime);
                var data2 = new Date(ris[i].end.dateTime);
                console.log(data1);
                console.log(data2);
                console.log(data1.getHours());
                var z = 0;
                while (data1.getDate() != array[z].getDate()){
                    z++;
                }
                dateInvio[z].aggiungiSlot(data1.getHours(), data1.getMinutes(), data2.getHours(), data2.getMinutes());
                console.log(z);
            }
            console.log(dateInvio);
            res.status(200).json(dateInvio);
            console.log('CORRETTO');
        })
        .catch((err) => {
            console.log(err);
            console.log('errore!');
        }); 
});

function soloNumeri(str){
    return /^[0-9]+$/.test(str);
}

const eunaData = (str) => {
    return (new Date(str) !== "Invalid Date") && !isNaN(new Date(str));
}



//POST

/**
 *  @openapi
 *  /api/v2/data:
 *  post:
 *      description: >-
            Receives a json with the data regarding the time slot you want to fix appointment in and send a response.
        summary: Allows to mark time slots as busy
 *      requestBody:
            description: 'API receives the complete date (day and time) and the duration of the appointment you want to book. It should be specified that the duration must be expressed as a number which is a multiplier of 15 minutes, which is the standard duration of a time slot.'
            content:
                application/json:
                    schema:
                        salvaDate:
                            type: object
                            required:
                                - slot
                                - durataSlot
                            properties:
                                slot:
                                    type: string
                                    description: 'Date in the standard javascript format "Date" with the time corresponding to the selected slot'
                                durataSlot:
                                    type: number
                                    description: 'Number of slots to be occupied starting from the one indicated by "slot"'
 *      responses:
 *          '201':
                description: 'If the operation is successful, the API saves the appointment on Google Calendar and returns a 201 message confirming the success.'
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
 */


router.post('', async (req, res) => {
    console.log(req.body.durataSlot);
    if(!soloNumeri((req.body.durataSlot))){
        res.status(400).json({status: 400, successo: 'caricamento fallito: la durata dell appuntamento deve essere un numero!'});
        return;
    }
    console.log(eunaData(req.body.slot));
    if(eunaData(req.body.slot) == true){
        console.log('data creata con successo');
    }else{
        console.log('errore nella creazione della data');
        res.status(400).json({status: 400, successo: 'caricamento fallito: data inviata errata'});
        return;
    }
    var data3 = new Date(req.body.slot)
    var data4 = new Date(data3);
    data4.setMinutes(data3.getMinutes() + (15*req.body.durataSlot));
    console.log(data3 + ' ');
    console.log(data4 + ' ');
    getEvents(data3, data4)
        .then((risp) => {
            console.log(risp);
            if(risp.length > 0){
                res.status(400).json({status: 400, successo: 'caricamento fallito: Data selezionata gia occupata!'});
                return;
            }
            let event = {
                'summary': `Appuntamento Gommista`,
                'description': `Appuntamento prenotato tramite sito web`,
                'start': {
                    'dateTime': data3,
                    'timeZone': 'Europe/Rome'
                },
                'end': {
                    'dateTime': data4,
                    'timeZone': 'Europe/Rome'
                }
            };
            insertEvent(event)
                .then((ris) => {
                    console.log(ris);
                    res.status(201).json({status: 201, successo: 'caricamento avvenuto con successo!'});
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({status: 400, successo: 'caricamento fallito: ' + err});
                });
        });
});


module.exports = {
    router : router,
    insertEvent : insertEvent,
};  