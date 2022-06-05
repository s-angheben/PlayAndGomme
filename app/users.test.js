const request = require('supertest');
const app     = require('./app');
const mongoose = require('mongoose');
const User = require('./models/user');

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

describe('POST, PUT and DELETE /api/v2/users', () => {

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

  test('POST /api/v2/users missing username', async () => {
    var body = {
      password : "ciao"
      }
    return request(app)
      .post('/api/v2/users')
      .set('Accept', 'application/json')
      .send(body)
      .expect(400, { error: 'missing username field' });
  });
  
  test('POST /api/v2/users missing password', async () => {
    var body = {
      username: "ciao"
      }
    return request(app)
      .post('/api/v2/users')
      .set('Accept', 'application/json')
      .send(body)
      .expect(400, { error: 'missing password field' });
  });

  test('POST /api/v2/users username already exist', async () => {
    let user = await User.findOne();
    var body = {
      username : String(user.username),
      password : "ciao"
      }
    return request(app)
      .post('/api/v2/users')
      .set('Accept', 'application/json')
      .send(body)
      .expect(409, { error: 'username already exist' });
  }); 
  
//PUT---------------------------------------------------------------

test('PUT /api/v2/users incorrect id of the user', async () => {
  var body = {
    username : "ciao",
    password : "ciao"
    }
  return request(app)
    .put('/api/v2/users/629b18ca308b2597242e3e99')
    .set('Accept', 'application/json')
    .send(body)
    .expect(404, { error: 'Not found' });
}); 

test('PUT /api/v2/users update username field using the same username', async () => {
  let user = await User.findOne();
  var body = {
    username : String(user.username),
    }
  return request(app)
    .put('/api/v2/users/' + String(user._id))
    .set('Accept', 'application/json')
    .send(body)
    .expect(409, { error: 'username already exist' });
}); 

test('PUT /api/v2/users invalid email', async () => {
  let user = await User.findOne();
  var body = {
    email: "email_non_valida@.com",
    }
  return request(app)
    .put('/api/v2/users/' + String(user._id))
    .set('Accept', 'application/json')
    .send(body)
    .expect(400, { error: 'email field is not valid' });
});

test('PUT /api/v2/users invalid number', async () => {
  let user = await User.findOne();
  var body = {
    phone: "123456789", //numero non valido perché composto di 9 cifre al posto di 10
    }
  return request(app)
    .put('/api/v2/users/' + String(user._id))
    .set('Accept', 'application/json')
    .send(body)
    .expect(400, { error: 'phone number is not valid' });
});
  
//DELETE------------------------------------------------------------

  test('DELETE /api/v2/appointments invalid UserId', async () => {
    return request(app)
      .delete('/api/v2/users/629b18ca308b2597242e3ee5')
      .set('Accept', 'application/json')
      .expect(404, { error: 'user not found' });
  });
});
