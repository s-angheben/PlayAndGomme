const request = require('supertest');
const app     = require('./app');

describe('GET /api/v2/users', () => {

  let tireSpy;
  let tireSpyFindById;

  beforeAll( () => {
    const User = require('./models/user');
    tireSpy = jest.spyOn(User, 'find').mockImplementation((criterias) => {
      return [
        {
        id: "629b18ca308b2597242e3ee7",
        name: "John",
        surname: "Jee",
        phone: 6651235869,
        email: "john@io.com",
        username: "user1",
        password: "pass1" 
        },
        {
        id: "629b18ca308b2597242e3ee8",
        name: "Paul",
        surname: "Goo",
        phone: 2251655368,
        email: "paul@io.com",
        username: "user2",
        password: "pass2"
        }
      ];
    });
    tireSpyFindById = jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id=="629b18ca308b2597242e3ee7")
        return {
        id: "629b18ca308b2597242e3ee7",
        name: "John",
        surname: "Jee",
        phone: 6651235869,
        email: "john@io.com",
        username: "user1",
        password: "pass1" 
        };
      else if (id=="629b18ca308b2597242e3ee8")
        return {
        id: "629b18ca308b2597242e3ee8",
        name: "Paul",
        surname: "Goo",
        phone: 2251655368,
        email: "paul@io.com",
        username: "user2",
        }
      else
        return null;
    });
  });

  afterAll(async () => {
    tireSpy.mockRestore();
    tireSpyFindById.mockRestore();
  });
 
  // the password is not give
  test('GET /api/v2/users should respond with an array of users', async () => {
    return request(app)
      .get('/api/v2/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        if(res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: "/api/v2/users/629b18ca308b2597242e3ee7",
            name: "John",
            surname: "Jee",
            phone: 6651235869,
            email: "john@io.com",
            username: "user1",
          });
        }
      });
  });

  
  // the password is not give
  test('GET /api/v2/users/:id should respond with json', async () => {
    return request(app)
      .get('/api/v2/users/629b18ca308b2597242e3ee7')
      .expect('Content-Type', /json/)
      .expect(200, {
            self: "/api/v2/users/629b18ca308b2597242e3ee7",
            name: "John",
            surname: "Jee",
            phone: 6651235869,
            email: "john@io.com",
            username: "user1",
        });
  });
});