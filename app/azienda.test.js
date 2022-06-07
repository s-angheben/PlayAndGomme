const request = require('supertest');
const app     = require('./app');
const mongoose = require('mongoose');
const infoAzienda = require('./models/infoazienda');

jest.setTimeout(20000);

describe('GET /api/v2/azienda', () => {

  let aziendaS;

  beforeAll( () => {
    aziendaS = jest.spyOn(infoAzienda, 'find').mockImplementation(() => {
      return [{
        _id: '6298b795f4367796d8ac1b90',
        nome: 'Play and Gomme',
        descrizione: 'Inserire una descrizione dell Azienda',
        indirizzo: 'Inserire la Via dell Azienda',
        orari: 'Inserire l orario di apertura dell Azienda',
        numero_telefono: '3333333333',
        email: 'Gommista@gmail.com',
        news: [{
            Titolo: 'NEWS DI PROVA',
            Testo: 'questa news è una prova !!!!',
            _id: '629cbe5e1a89bdc7457ad017'
        }],
        instagram: 'https://www.instagram.com/',
        facebook: 'https://www.facebook.com/',
        youtube: 'https://www.youtube.com/'
      }];
    });
  });

  afterAll(async () => {
    aziendaS.mockRestore();
  });
  
  test('GET /api/v2/azienda should respond with the data of the company', async () => {
    return request(app)
      .get('/api/v2/azienda')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        if(res.body) {
            expect(res.body).toEqual({
                _id: '6298b795f4367796d8ac1b90',
                nome: 'Play and Gomme',
                descrizione: 'Inserire una descrizione dell Azienda',
                indirizzo: 'Inserire la Via dell Azienda',
                orari: 'Inserire l orario di apertura dell Azienda',
                numero_telefono: '3333333333',
                email: 'Gommista@gmail.com',
                news: [{
                    Titolo: 'NEWS DI PROVA',
                    Testo: 'questa news è una prova !!!!',
                    _id: '629cbe5e1a89bdc7457ad017'
                }],
                instagram: 'https://www.instagram.com/',
                facebook: 'https://www.facebook.com/',
                youtube: 'https://www.youtube.com/'
              });
        }
      });
  });
});


describe('POST /api/v2/azienda', () => {

    let connection;
  
    beforeAll( async () => {
      jest.setTimeout(8000);
      jest.unmock('mongoose');
      connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
      console.log('Database connected!');
    });
  
    afterAll( () => {
      mongoose.connection.close(true);
      console.log("Database connection closed");
    });

    test('POST /api/v2/azienda parameter to change unknow', async () => {
        var body = { 
            oggetto: "zzz", 
            titolo: "", 
            text: "dd", 
            array: "" 
          }
        return request(app)
          .post('/api/v2/azienda')
          .set('Accept', 'application/json')
          .send(body)
          .expect(400, {status: 400, successo: 'Operazione selezionata non valida!'});
      });

      test('POST /api/v2/azienda youtube invalid URL entered', async () => {
        var body = { 
            oggetto: "youtube", 
            titolo: "", 
            text: "pppppp", 
            array: "" 
          }
        return request(app)
          .post('/api/v2/azienda')
          .set('Accept', 'application/json')
          .send(body)
          .expect(400, {status: 400, successo: 'URL inserito non valido'});
      });

      test('POST /api/v2/azienda instagram invalid URL entered', async () => {
        var body = { 
            oggetto: "instagram", 
            titolo: "", 
            text: "pppppp", 
            array: "" 
          }
        return request(app)
          .post('/api/v2/azienda')
          .set('Accept', 'application/json')
          .send(body)
          .expect(400, {status: 400, successo: 'URL inserito non valido'});
      });

      test('POST /api/v2/azienda facebook invalid URL entered', async () => {
        var body = { 
            oggetto: "facebook", 
            titolo: "", 
            text: "pppppp", 
            array: "" 
          }
        return request(app)
          .post('/api/v2/azienda')
          .set('Accept', 'application/json')
          .send(body)
          .expect(400, {status: 400, successo: 'URL inserito non valido'});
      });

      test('POST /api/v2/azienda phone number entered invalid', async () => {
        var body = { 
            oggetto: "numerotelefono", 
            titolo: "", 
            text: "pppppp", 
            array: "" 
          }
        return request(app)
          .post('/api/v2/azienda')
          .set('Accept', 'application/json')
          .send(body)
          .expect(400, {status: 400, successo: 'Numero di telefono non valido'});
      });

      test('POST /api/v2/azienda news to delete not found', async () => {
        var body = { 
            oggetto: "news", 
            titolo: "", 
            array: ['uviasbv'],
            text: "",
          }
        return request(app)
          .post('/api/v2/azienda')
          .set('Accept', 'application/json')
          .send(body)
          .expect(404, {status: 404, successo: 'News da eliminare non trovata riprovare'});
      });

      test('POST /api/v2/azienda new news text or title absent', async () => {
        var body = { 
            oggetto: "news", 
            titolo: "TTT", 
            text: "",
            array: ""
          }
        return request(app)
          .post('/api/v2/azienda')
          .set('Accept', 'application/json')
          .send(body)
          .expect(400, {status: 400, successo: 'Per inserire una News servono sia il Titolo che il Testo'});
      });      
});