require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const categories = require('../data/categories');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signin')
        .send({
          email: 'john@arbuckle.com',
          password: '1234'
        });
      
        token = signInData.body.token; // eslint-disable-line
    }, 10000);  
    
    test('GET /categories for John', async()=> {
      const expectation = categories;
      const data = await fakeRequest(app)
        .get('/api/categories')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    }); 

    test('POST /categories for John', async()=> {
      const expectation = {
        parent_id: 4, description: 'dog food', user_id: 1
      };
      const data = await fakeRequest(app)
        .post('/api/categories')
        .send(expectation)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      const { id, ...rest } = data.body;
      expect(rest).toEqual(expectation);
      expect(id).toBeGreaterThan(0);
    });

    afterAll(done => {
      return client.end(done);
    });

    
  });
});
