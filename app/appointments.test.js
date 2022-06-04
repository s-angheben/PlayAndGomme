const request = require('supertest');
const app = require('./app');

describe('GET /api/v2/appointments', () => {

    // Moking Book.find method
    let appointmentSpy;
    // Moking Book.findById method
    let appointmentSpyFindById;
  
    beforeAll( () => {
      const Appointment = require('./models/appointment');

      appointmentSpy = jest.spyOn(Appointment, 'find').mockImplementation((criterias) => {
        return [{
            id: "123456789abc",
            appointmentPlaced: "2022-06-18",
            service : "riparazione",
            userId : "userid3",
            materials : [],
            date : "2022-07-08",
            alreadyPaid : false
        }];
      });

      appointmentSpyFindById = jest.spyOn(Appointment, 'findById').mockImplementation((id) => {
        if (id=="123456789abc"){
          return {
            id: "123456789abc",
            appointmentPlaced: "2022-06-18",
            service : "riparazione",
            userId : "userid3",
            materials : [],
            date : "2022-07-08",
            alreadyPaid : false
          };
        } else {return {};}
      });

    });
  
    afterAll(async () => {
      appointmentSpy.mockRestore();
      appointmentSpyFindById.mockRestore();
    });
    
    test('GET /api/v2/appointments with an appointment saved in db', async () => {
      return request(app)
        .get('/api/v2/appointments')
        .expect('Content-Type', /json/)
        .expect(200)
        .then( (res) => {
          if(res.body && res.body[0]) {
            expect(res.body[0]).toEqual({
                self: "/api/v2/appointments/123456789abc",
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


    test('GET /api/v1/appointments/:id with correct id', async () => {
        return request(app)
          .get('/api/v2/appointments/123456789abc')
          .expect('Content-Type', /json/)
          .expect(200, {
                self: "/api/v2/appointments/123456789abc",
                appointmentPlaced: "2022-06-18",
                service : "riparazione",
                userId : "/api/v2/users/userid3",
                materials : [],
                date : "2022-07-08",
                alreadyPaid : false
            });
      });

      test('GET /api/v1/appointments/:id with incorrect id', async () => {
        return request(app)
          .get('/api/v2/appointments/123456789aaa')
          .expect('Content-Type', /json/)
          .expect(404, {error: "Appointment not found"});
      });


  });