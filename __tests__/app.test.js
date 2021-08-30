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

    test('GET /purchases returns list of purchases', async() => {

      const expectation = [
        {
          id: 1,
          user_id: 1,
          description: 'Hungry man TV dinner x 4',
          category_id: 2,
          timestamp: '1630297328170',
          cost: '$19.96'
        },
        {
          id: 2,
          user_id: 1,
          description: 'PHOever Yum',
          category_id: 3,
          timestamp: '1630297328170',
          cost: '$10.95'
        },
        {
          id: 3,
          user_id: 1,
          description: 'Cat food',
          category_id: 5,
          timestamp: '1630297328170',
          cost: '$18.75'
        },
        {
          id: 4,
          user_id: 1,
          description: 'Dog food',
          category_id: 6,
          timestamp: '1630297328170',
          cost: '$12.95'
        },
        {
          id: 5,
          user_id: 1,
          description: 'Polka Lessons',
          category_id: 10,
          timestamp: '1630297328170',
          cost: '$75.00'
        },
        {
          id: 6,  
          user_id: 1,
          description: 'Karaoke Machine',
          category_id: 10,
          timestamp: '1630297328170',
          cost: '$95.00'
        },
        {
          id: 7,
          user_id: 1,
          description: 'Weight Loss Program',
          category_id: 10,
          timestamp: '1630297328170',
          cost: '$129.00'
        }, 
      ];

      const data = await fakeRequest(app)
        .get('/api/purchases')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });  
    
    test('GET /categories for John', async()=> {
      const expectation = categories;
      const data = await fakeRequest(app)
        .get('/api/categories')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });    

    test('POST /purchases to authorized user list', async() => {

      const newPurchase = {
        id: 8,
        user_id: 1,
        description: 'Hungry man TV dinner x 4',
        category_id: 2,
        timestamp: '1630297328170',
        cost: '$19.96'
      };

      const data = await fakeRequest(app)
        .post('/api/purchases')
        .send(newPurchase)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(newPurchase);
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

    test('GET /api/recurring route for John', async() => {
      const expectation = [
        {
          id: 1,
          user_id: 1,
          description: 'eharmony membership',
          cost: '$35.90',
          category_id: 9,
          frequency: 'monthly', // change this to a time in seconds
          start_timestamp: '1630297328170',
          stop_timestamp: '1630297328170' // change these times
        },
        {
          id: 2,
          user_id: 1,
          description: 'Scientific American',
          cost: '$0.00', // fill this in
          category_id: 9,
          frequency: 'monthly', // change this to a time in seconds
          start_timestamp: '1630297328170', 
          stop_timestamp: '1630297328170' // change these times
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/recurring')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('POST /recurring new subscription for john', async() => {

      const expectation = {
        id: 3,
        user_id: 1,
        description: 'Mens health magazine',
        cost: '$39.96',
        category_id: 9,
        frequency: 'annual',
        start_timestamp: '1630297328170',
        stop_timestamp: '1630297328170'
      };
      const newRecurringPurchase = {
        user_id: 1,
        description: 'Mens health magazine',
        cost: '$39.96',
        category_id: 9,
        frequency: 'annual',
        start_timestamp: 1630297328170,
        stop_timestamp: 1630297328170
      };

      const data = await fakeRequest(app)
        .post('/api/recurring')
        .send(newRecurringPurchase)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    afterAll(done => {
      return client.end(done);
    });
  });
});