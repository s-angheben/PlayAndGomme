const request = require('supertest');
const app     = require('./app');
const visualizzaDate = require('./models/visualizzadate');
const {google} = require('googleapis');
require('dotenv').config();
const { redis } = require('googleapis/build/src/apis/redis');


describe('POST /api/v2/data', () => {

    let connection;
  
    beforeAll( async () => {
      jest.setTimeout(8000);
    });
  
    afterAll( () => {
      console.log("finito!");
    });

    test('POST /api/v2/data durataSlot is not a number', async () => {
        var dat = new Date();
        var body = { 
            slot: dat, 
            durataSlot: 'rrr' 
        }
        return request(app)
          .post('/api/v2/data')
          .set('Accept', 'application/json')
          .send(body)
          .expect(400, {status: 400, successo: 'caricamento fallito: la durata dell appuntamento deve essere un numero!'});
      });  
      
      test('POST /api/v2/data in the selected slot there is already an appointment', async () => {
        var dat = new Date('2025-12-17T08:00:00');
        var body = { 
            slot: dat, 
            durataSlot: '1' 
        }
        return request(app)
          .post('/api/v2/data')
          .set('Accept', 'application/json')
          .send(body)
          .expect(400, {status: 400, successo: 'caricamento fallito: Data selezionata gia occupata!'});
      }); 

      test('POST /api/v2/data invalid date entered', async () => {
        var dat = 'ciao';
        var body = { 
            slot: dat, 
            durataSlot: '1' 
        }
        return request(app)
          .post('/api/v2/data')
          .set('Accept', 'application/json')
          .send(body)
          .expect(400, {status: 400, successo: 'caricamento fallito: data inviata errata'});
      });
});