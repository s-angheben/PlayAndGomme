var express = require('express');
var router = express.Router();
const visualizzaDate = require('../visualizzadate');

/**
 *  @openapi
 *  components:
 *      schemas:
 *          visualizzaDate:
 *              type: object
 *              required:
 *                  - gSettimana
 *                  - giorno
 *                  - slotOrari[36]
 *              properties:
 *                  gSettimana:
 *                      type: string
 *                      description: 'Day of the week'
 *                  giorno:
 *                      type: string
 *                      description: 'Date in the format: dd/mm/yyyy'
 *                  slotOrari[36]:
 *                      type: boolean
 *                      description: 'Array that reports occupied slots with "true"'
 */

// CALENDARIO GOOGLE
const {google} = require('googleapis');
const res = require('express/lib/response');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendario API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// TIMEOFFSET Offset
const TIMEOFFSET = '+02:00';

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


/**
 *  @openapi
 *  /visualdata:
 *      get:
 *          description: Get a graphical interface showing free and occupied time slots.
 *          summary: View available time slots
 *          responses:
 *              200:
 *                  description: 'Graphic interface that allows to visualize the available datas and time slots for booking an appointment. This datas are synchronized with the tire dealers Google chalendar: "https://calendar.google.com/calendar/u/1?cid=NDByZDU4M2wxdWhmODFydHIyMjMzc2FrdXNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ"'
 */


router.get('/', function(req, res, next) {
  res.render('visualdata');
});


/**
 *  @openapi
 *  /visualdata/dat:
 *      post:
 *          description: Get a json with the data regarding the dates and available time slots.
 *          summary: Take data regarding time slots
 *          responses:
 *              200:
 *                  description: 'API that, through the Google chalendars APIs, gives back a json file made of one array of the above elements.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/visualizzaDate'
 */


router.post('/dat', async (req,res) => {  
    var array = [new Date()];
    var dateInvio = [new visualizzaDate(array[0].getDay(), array[0].getDate(), array[0].getMonth(), array[0].getFullYear())];
    for (var i=1; i<10; i++){
        array.push(new Date(new Date().setDate(array[i-1].getDate()+1)));
        console.log(array[i]);
        if(i>=1){
            dateInvio.push(new visualizzaDate(array[i].getDay(), array[i].getDate(), array[i].getMonth(), array[i].getFullYear()));
        }
    }
    dateInvio[0].orarioPartenza(array[0].getHours(), array[0].getMinutes());
    //CALENDARIO GOOGLE
    getEvents(array[0], array[9])
        .then((ris) => {
            console.log(ris);
            for(var i=0; i<ris.length; i++){
                var data1 = new Date(ris[i].start.dateTime);
                var data2 = new Date(ris[i].end.dateTime);
                var z = 0;
                while (data1.getDate() != array[z].getDate()){
                    z++;
                }
                dateInvio[z].aggiungiSlot(data1.getHours(), data1.getMinutes(), data2.getHours(), data2.getMinutes());
            }
            console.log(dateInvio);
            console.log('CORRETTO');
            res.send({dateInvio});
        })
        .catch((err) => {
            console.log(err);
            console.log('errore!');
        }); 
}); 
  
module.exports = router;
