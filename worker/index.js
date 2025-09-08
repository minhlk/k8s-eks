import { connect, StringCodec } from 'nats';
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

(async () => {
  const nc = await connect({ servers: `nats://${process.env.NATS_HOST}:4222` });
  const sc = StringCodec();
  console.log('Connected to queue');
  const sub = nc.subscribe("messages.created", { queue: 'order-workers'});
  
  for await (const m of sub) {
    await initDB();
    let { id, message } = JSON.parse(sc.decode(m.data));
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    await pool.execute('INSERT INTO messages (message) VALUES (?)', [id + ' - ' + message]);
  }
  
  console.log("subscription closed");

})();

async function initDB() {
  await pool.query('USE ' + process.env.MYSQL_DATABASE);
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
}