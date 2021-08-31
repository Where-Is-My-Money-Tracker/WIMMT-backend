const express = require('express');
const cors = require('cors');
// const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const client = require('./client');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});
app.get('/api/categories', async(req, res)=> {
  try {
    const data = await client.query('SELECT * FROM categories WHERE user_id = $1', [req.userId]);
    res.json(data.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post('/api/categories', async(req, res)=> {
  try {
    const data = await client.query(`
    INSERT INTO categories(parent_id,  description, user_id)
    VALUES($1, $2, $3) RETURNING *;`, 
    [req.body.parent_id, req.body.description, req.userId]);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

});

app.get('/api/purchases', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT * from purchases WHERE user_id = $1
    `, [req.userId]
    );
    res.json(data.rows);

  } catch (event) {
    res.status(500).json({ error: event.message });
  }
});

app.post('/api/purchases', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO purchases(
      cost,
      description,
      timestamp,
      category_id,
      user_id
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`, [
      req.body.cost,
      req.body.description,
      req.body.timestamp,
      req.body.category_id,
      req.userId
    ]);
    res.json(data.rows[0]);
    
  } catch(event) {
    res.status(500).json({ error: event.message });
  }
});

app.get('/api/recurring', async(req, res) => {
  try {
    const data = await client.query('SELECT * FROM recurring WHERE user_id = $1', [req.userId]);
    res.json(data.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/recurring', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO recurring(
      user_id,
      description,
      cost,
      category_id,
      frequency,
      start_timestamp,
      stop_timestamp
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`, [
      req.userId,
      req.body.description,
      req.body.cost,
      req.body.category_id,
      req.body.frequency,
      req.body.start_timestamp,
      req.body.stop_timestamp
    ]);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/recurring/:id', async(req, res) => {
  try {
    const data = await client.query(`
      UPDATE recurring
      SET
        user_id=$2,
        description=$3,
        cost=$4,
        category_id=$5,
        frequency=$6,
        start_timestamp=$7,
        stop_timestamp=$8
      WHERE recurring.id=$1
      RETURNING *;
    `, [
      req.params.id,
      req.userId,
      req.body.description,
      req.body.cost,
      req.body.category_id,
      req.body.frequency,
      req.body.start_timestamp,
      req.body.stop_timestamp
    ]);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/purchases/:id', async(req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM purchases WHERE id=$1
      RETURNING *;
    `, [
      req.params.id
    ]);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/categories/:id', async(req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM categories WHERE id=$1
      RETURNING *;
    `, [
      req.params.id
    ]);
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.use(require('./middleware/error'));

module.exports = app;
