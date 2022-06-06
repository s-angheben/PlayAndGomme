const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Tire = require('./models/tire');
const User = require('./models/user');
const Appointment = require('./models/appointment');
var payload = {
  username: 'admin',
  id: 'admin',
  admin: true
}

var options = {
  expiresIn: 86400 // expires in 24 hours
}

var token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);

describe('GET /api/v2/appointments', () => {

    let appointmentSpy;
    let appointmentSpyFindById;

    beforeAll( () => {
      const Appointment = require('./models/appointment');

      appointmentSpy = jest.spyOn(Appointment, 'find').mockImplementation((criterias) => {
        return [{
            id: "629b18ca308b2597242e3ee4",
            appointmentPlaced: "2022-06-18",
            service : "riparazione",
            userId : "userid3",
            materials : [],
            date : "2022-07-08",
            alreadyPaid : false
        }];
      });

      appointmentSpyFindById = jest.spyOn(Appointment, 'findById').mockImplementation((id) => {
        if (id=="629b18ca308b2597242e3ee4"){
          return {
            id: "629b18ca308b2597242e3ee4",
            appointmentPlaced: "2022-06-18",
            service : "riparazione",
            userId : "userid3",
            materials : [],
            date : "2022-07-08",
            alreadyPaid : false
          };
        } else {return null;}
      });

    });
  
    afterAll(async () => {
      appointmentSpy.mockRestore();
      appointmentSpyFindById.mockRestore();
    });


    test('GET /api/v2/appointments with an appointment saved in db', async () => {
      return request(app)
        .get('/api/v2/appointments')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then( (res) => {
          if(res.body && res.body[0]) {
            expect(res.body[0]).toEqual({
                self: "/api/v2/appointments/629b18ca308b2597242e3ee4",
                appointmentPlaced: "2022-06-18",
                service : "riparazione",
                userId : "/api/v2/users/userid3",
                materials : [],
                date : "2022-07-08",
                alreadyPaid : false
            });
          }
        });
    });


    test('GET /api/v2/appointments/:id with correct id', async () => {
        return request(app)
          .get('/api/v2/appointments/629b18ca308b2597242e3ee4')
          .set('x-access-token', token)
          .expect('Content-Type', /json/)
          .expect(200, {
                self: "/api/v2/appointments/629b18ca308b2597242e3ee4",
                appointmentPlaced: "2022-06-18",
                service : "riparazione",
                userId : "/api/v2/users/userid3",
                materials : [],
                date : "2022-07-08",
                alreadyPaid : false
            });
      });

      test('GET /api/v2/appointments/:id with incorrect id', async () => {
        return request(app)
          .get('/api/v2/appointments/629b18ca308b2597242e3ee5')
          .set('x-access-token', token)
          .expect('Content-Type', /json/)
          .expect(404, {error: "Appointment not found"});
      });

  });

describe('POST, PUT and DELETE /api/v2/appointments', () => {

  let connection;

  beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    //return connection; // Need to return the Promise db connection?
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
  
//POST--------------------------------------------------------------

    test('POST /api/v2/appointments invalid userId', async () => {
      let tire = await Tire.findOne();
      var body = {
        appointmentPlaced: "2022-06-18",
        service : "riparazione",
        userId : "629b18ca308b2597242e3ee5",
        materials : [{"materialId" : tire._id,
        "quantity" : "4"}],
        date : "2022-07-08",
        alreadyPaid : false
        }
      return request(app)
        .post('/api/v2/appointments')
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .send(body)
        .expect(404, { error: 'user does not exist' });
    });
  
    test('POST /api/v2/appointments invalid tireId', async () => {
      let user = await User.findOne();
      var body = {
        appointmentPlaced: "2022-06-18",
        service : "riparazione",
        userId : user._id,
        materials : [{"materialId" : "629b18ca308b2597242e3ee5",
        "quantity" : "4"}],
        date : "2022-07-08",
        alreadyPaid : false
        }
      return request(app)
        .post('/api/v2/appointments')
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .send(body)
        .expect(404, { error: 'material not found' });
    });
  
    test('POST /api/v2/appointments invalid service', async () => {
      let tire = await Tire.findOne();
      let user = await User.findOne();
      var body = {
        appointmentPlaced: "2022-06-18",
        service : "servizio_non_valido",
        userId : user._id,
        materials : [{"materialId" : tire._id,
        "quantity" : "4"}],
        date : "2022-07-08",
        alreadyPaid : false
        }
      return request(app)
        .post('/api/v2/appointments')
        .set('x-access-token', token)
        .set('Accept', 'application/json')
        .send(body)
        .expect(400, { error: 'service not valid' });
    });

  test('POST /api/v2/appointments without body', () => {
    return request(app)
      .post('/api/v2/appointments')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .expect(400, { error: 'empty request' });
  });

//PUT---------------------------------------------------------------

  test('PUT /api/v2/appointments invalid userId', async () => {
    let tire = await Tire.findOne();
    let user = await User.findOne();
    let appointment = await Appointment.findOne();
    var body = {
      userId : "629b18ca308b2597242e3ee5"
      }
    return request(app)
      .put('/api/v2/appointments/' + String(appointment._id))
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send(body)
      .expect(404, { error: 'user does not exist' });
  });

  test('PUT /api/v2/appointments invalid appointmentId', async () => {
    let tire = await Tire.findOne();
    let user = await User.findOne();
    let appointment = await Appointment.findOne();
    var body = {
      userId : String(appointment._id)
      }
    return request(app)
      .put('/api/v2/appointments/629b18ca308b2597242e3ee5')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send(body)
      .expect(404, { error: 'Appointment not found' });
  });

  test('PUT /api/v2/appointments no body', async () => {
    let appointment = await Appointment.findOne();
    return request(app)
      .put('/api/v2/appointments/' +String(appointment._id))
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .expect(400, { error: 'empty request' });
  });

//DELETE------------------------------------------------------------

  test('DELETE /api/v2/appointments invalid AppointmentId', async () => {
    return request(app)
      .delete('/api/v2/appointments/629b18ca308b2597242e3ee5')
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .expect(404, { error: 'Appointment not found' });
  });
});
