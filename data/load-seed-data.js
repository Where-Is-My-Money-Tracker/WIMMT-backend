const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
const recurringData = require('./recurringPurchaseItems.js');
const purchasesData = require('./purchaseItems.js');
const categoriesData = require('./categories.js');
run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      usersData.map(user => {
        const hash = bcrypt.hashSync(user.password, 8);
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, hash]);
      })
    );
      
    // const user = users[0].rows[0]; 
    await Promise.all(
      categoriesData.map(cat => {
        return client.query(`
          INSERT INTO categories (description, user_id, parent_id)
          VALUES ($1, $2, $3);
        `,
        [cat.description, cat.user_id, cat.parent_id]);
      })
    );
    // const category = categories.rows[0];
    await Promise.all(
      purchasesData.map(buy => {
        return client.query(`
          INSERT INTO purchases (cost, description, timestamp, category_id, user_id)
          VALUES ($1, $2, $3, $4, $5);
        `,
        [buy.cost, buy.description, buy.timestamp, buy.category_id, buy.user_id]);
      })
    );
    await Promise.all(
      recurringData.map(recurring => {
        return client.query(`
          INSERT INTO recurring (cost, description, start_timestamp, stop_timestamp, frequency, category_id, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        [recurring.cost, recurring.description, recurring.start, recurring.stop, recurring.frequency, recurring.category_id, recurring.user_id]);
      })
    );
    
    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
