const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken');

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

    var payload = {
      username: 'admin',
      id: 'admin',
      admin: true
    }

    var options = {
      expiresIn: 86400 // expires in 24 hours
    }

    var token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);

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