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
    }, 100000);

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
        {
          id: 8,
          user_id: 1,
          description: 'Trader Joes',
          category_id: 13,
          timestamp: '1625454527434',
          cost: '$54.25'
        },
        {
          id: 9,
          user_id: 1,
          description: 'Whole foods',
          category_id: 13,
          timestamp: '1628827887766',
          cost: '$122.23'
        },
        {
          id: 10,
          user_id: 1,
          description: 'bird seed',
          category_id: 8,
          timestamp:'1630383190117',
          cost: '$8.75'
        },
        {
          id: 11,
          user_id: 1,
          description: 'kitty litter',
          category_id: 5,
          timestamp: '1630383190117',
          cost: '$9.95'
        },
        {
          id: 12,
          user_id: 1,
          description: 'electric bill',
          category_id: 12,
          timestamp: '1626322651283',
          cost: '$33.46'
        },
        {
          id: 13,
          user_id: 1,
          description: 'electric bill',
          category_id: 12,
          timestamp: '1628914726162',
          cost: '$42.55'
        },
        {
          id: 14,
          user_id: 1,
          description: 'Red Baron pizza x 5',
          category_id: 2,
          timestamp: '1627187320151',
          cost: '$25.00'
        },
        {
          id: 15,
          user_id: 1,
          description: 'Corn dogs',
          category_id: 2,
          timestamp:'1629088233872',
          cost: '$12.95'
        },
        {
          id: 16,
          user_id: 1,
          description: 'fish flakes',
          category_id: 7,
          timestamp: '1630211540604',
          cost: '$29.99'
        },
        {
          id: 17,
          user_id: 1,
          description: 'cat food',
          category_id: 5,
          timestamp: '1630038830340',
          cost: '$19.95'
        },
        {
          id: 18,
          user_id: 1,
          description: 'kitty treats',
          category_id: 5,
          timestamp: '1629520486190',
          cost: '$12.98'
        },
        {
          id: 19,
          user_id: 1,
          description: 'family size frozen lasagna x 5',
          category_id: 2,
          timestamp: '1629952582873',
          cost: '$52.23'
        },
        {
          id: 20,
          user_id: 1,
          description: 'Chipotle',
          category_id: 3,
          timestamp: '1630471143093',
          cost: '$12.80'
        },
        {
          id: 21,
          user_id: 1,
          description: 'Panera',
          category_id: 3,
          timestamp: '1626928829853',
          cost: '$14.55'
        },
        {
          id: 22,
          user_id: 1,
          description: 'dog treats',
          category_id: 6,
          timestamp: '1629607328280',
          cost: '$9.95'
        },
        {
          id: 23,
          user_id: 1,
          description: 'Thai food',
          category_id: 3,
          timestamp: '1628743619244',
          cost: '$16.35'
        },
        {
          id: 24,
          user_id: 1,
          description: 'dentist appointment',
          category_id: 14,
          timestamp: '1627966361341',
          cost: '$112.00'
        },
        {
          id: 25,
          user_id: 1,
          description: 'doctor appointment',
          category_id: 14,
          timestamp: '1628916828192',
          cost: '$125.00'
        },
        {
          id: 26,
          user_id: 1,
          description: 'gas',
          category_id: 15,
          timestamp: '1628485170299',
          cost: '$34.31'
        }
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

    const newPurchase = {
      id: 27,
      user_id: 1,
      description: 'Hungry man TV dinner x 4',
      category_id: 2,
      timestamp: '1630297328170',
      cost: '$19.96'
    };

    test('POST /purchases to authorized user list', async() => {


      const data = await fakeRequest(app)
        .post('/api/purchases')
        .send(newPurchase)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(newPurchase);
    });

    const newCategory = {
      parent_id: 4, description: 'dog food', user_id: 1
    };

    test('POST /categories for John', async()=> {
      const data = await fakeRequest(app)
        .post('/api/categories')
        .send(newCategory)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      const { id, ...rest } = data.body;
      expect(rest).toEqual(newCategory);
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
          frequency: '2628000000',
          start_timestamp: '1625454527434',
          stop_timestamp: null
        },
        {
          id: 2,
          user_id: 1,
          description: 'Scientific American',
          cost: '$14.99',
          category_id: 9,
          frequency: '2628000000',
          start_timestamp: '1625454527434',
          stop_timestamp: '1627977529785'
        },
        {
          id: 3,
          user_id: 1,
          description: 'mortgage',
          cost: '$1,800.00',
          category_id: 11,
          frequency: '2628000000',
          start_timestamp: '1625454527434',
          stop_timestamp: null
        },
        {
          id: 4,
          user_id: 1,
          description: 'cell phone bill',
          cost: '$24.99',
          category_id: 12,
          frequency: '2628000000',
          start_timestamp: '1625454527434',
          stop_timestamp: null
        },
        {
          id: 5,
          user_id: 1,
          description: 'The Atlantic',
          cost: '$79.90',
          category_id: 9,
          frequency: '31536000000',
          start_timestamp: '1625454527434',
          stop_timestamp: null
        },
        {
          id: 6,
          user_id: 1,
          description: 'internet bill',
          cost: '$60.00',
          category_id: 12,
          frequency: '2628000000',
          start_timestamp: '1628569298041',
          stop_timestamp: null
        },
        {
          id: 7,
          user_id: 1,
          description: 'dollar shave club',
          cost: '$26.00',
          category_id: 9,
          frequency: '1209600000',
          start_timestamp: '1625459106089',
          stop_timestamp: null
        },
        {
          id: 8,
          user_id: 1,
          description: 'health insurance',
          cost: '$352.00',
          category_id: 14,
          frequency: '2628000000',
          start_timestamp: '1625460694247',
          stop_timestamp: null
        },
        {
          id: 9,
          user_id: 1,
          description: 'car insurance',
          cost: '$24.00',
          category_id: 15,
          frequency: '2628000000',
          start_timestamp: '1625461070049',
          stop_timestamp: null
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
        id: 10,
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

    test('PUT /recurring updates scientific american cost', async() => {
      const updatedRecurringPurchase = {
        id: 2,
        user_id: 1,
        description: 'Scientific American',
        cost: '$14.99',
        category_id: 9,
        frequency: 2628000000,
        start_timestamp: 1625454527434,
        stop_timestamp: 1627977529785
      };
      const expectation = {
        id: 2,
        user_id: 1,
        description: 'Scientific American',
        cost: '$14.99',
        category_id: 9,
        frequency: '2628000000',
        start_timestamp: '1625454527434',
        stop_timestamp: '1627977529785'
      };
      
      const data = await fakeRequest(app)
        .put('/api/recurring/2')
        .send(updatedRecurringPurchase)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(expectation);
    });

    test('DELETE /purchases deletes an object in the purchase array by query id', async() => {
      const data = await fakeRequest(app)

        .delete('/api/purchases/8')
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.id).toEqual(8);
      expect(data.body.id).toBeGreaterThan(0);
    });

    // We don't use this route, but leaving the test for future use if we want to use it later
    // test.skip('DELETE /categories deletes a category from the category array', async() => {
    //   const data = await fakeRequest(app)
    //     .delete('/api/categories/2')
    //     .set('Authorization', token)
    //     .expect(500)
    //     .expect('Content-Type', /json/);
    //   expect(data.body).toEqual({ ...newCategory, id: 2 });
    //   expect(data.body.id).toBeGreaterThan(0);

    // });

    afterAll(done => {
      return client.end(done);
    });
  });
});