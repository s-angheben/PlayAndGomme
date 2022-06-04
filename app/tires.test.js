const request = require('supertest');
const app     = require('./app');

describe('GET /api/v2/tires', () => {

  let tireSpy;
  let tireSpyFindById;

  beforeAll( () => {
    const Tire = require('./models/tire');
    tireSpy = jest.spyOn(Tire, 'find').mockImplementation((criterias) => {
      return [{
        id: "6299ea606a13dcaaba662a1f",
        brand: 'Michelin',
        model: 'Climate',
        length: '275',
        height: '40',
        diameter: '18',
        quantity: '40',
        type: 'quattro_stagioni',
        price: '199.99'
      }];
    });
    tireSpyFindById = jest.spyOn(Tire, 'findById').mockImplementation((id) => {
      if (id=="6299ea606a13dcaaba662a1f")
        return {
            id: "6299ea606a13dcaaba662a1f",
            brand: 'Michelin',
            model: 'Climate',
            length: '275',
            height: '40',
            diameter: '18',
            quantity: '40',
            type: 'quattro_stagioni',
            price: '199.99'
        };
      else
        return null;
    });
  });

  afterAll(async () => {
    tireSpy.mockRestore();
    tireSpyFindById.mockRestore();
  });
  
  test('GET /api/v2/tires should respond with an array of tires', async () => {
    return request(app)
      .get('/api/v2/tires')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        if(res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: '/api/v2/tires/6299ea606a13dcaaba662a1f',
            brand: 'Michelin',
            model: 'Climate',
            length: '275',
            height: '40',
            diameter: '18',
            quantity: '40',
            type: 'quattro_stagioni',
            price: '199.99'
          });
        }
      });
  });

  
  test('GET /api/v2/tires/:id should respond with json', async () => {
    return request(app)
      .get('/api/v2/tires/6299ea606a13dcaaba662a1f')
      .expect('Content-Type', /json/)
      .expect(200, {
            self: '/api/v2/tires/6299ea606a13dcaaba662a1f',
            brand: 'Michelin',
            model: 'Climate',
            length: '275',
            height: '40',
            diameter: '18',
            quantity: '40',
            type: 'quattro_stagioni',
            price: '199.99'
        });
  });
});