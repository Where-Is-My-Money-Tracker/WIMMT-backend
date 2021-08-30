require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

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
    test('initial test', () => {
      const number = 1;
      const expectation = 1;

      expect(number).toEqual(expectation);
        
    });  
      
    afterAll(done => {
      return client.end(done);
    });

    
  });
});
