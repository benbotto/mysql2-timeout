const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'db',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 2,
  waitForConnections: true,
  queueLimit: 0,
});

pool.on('end', () => console.log('end fired'));
pool.on('close', () => console.log('close fired'));

async function query() {
  try {
    return await pool.query('SELECT CURRENT_TIMESTAMP');
  }
  catch (err) {
    console.error('Error executing query.');
    console.error(err);
  }
}

function sleep(ms) {
  return new Promise(resolve =>
    setTimeout(() => resolve(), ms));
}

(async function main() {
  for (let i = 0; i < 100; ++i) {
    const q1 = query();
    const q2 = query();

    await Promise
      .all([q2, q2])
      .then(([res1, res2]) => {
        console.log('Res 1', res1);
        console.log('Res 2', res2);
      });

    console.log('Sleeping 60 seconds.');
    await sleep(60000);
  }

  await pool.end();
})();

