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

router.post('', async (req, res) => {
    var data3;
    var skip = false;
    if(data3 = new Date(req.body.slot)){
        console.log('data creata con successo');
    }else{
        console.log('errore nella creazione della data');
        res.status(400).json({status: 400, successo: 'caricamento fallito: data inviata errata'});
        return;
    }
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