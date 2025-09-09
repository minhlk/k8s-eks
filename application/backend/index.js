import express from 'express';
import { createPool } from 'mysql2/promise';
import cors from 'cors';
import { connect } from 'nats';
import { networkInterfaces as _networkInterfaces } from 'os';
import client from 'prom-client';
const networkInterfaces = _networkInterfaces();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const app = express();
app.use(cors({ origin: '*' }));
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.get('/api', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS time');
    console.log('Test tailing:' + networkInterfaces['eth0'][0]['address']);
    res.json({
      ...{
        pod: 'backend',
        ip: networkInterfaces['eth0'][0]['address']
      },
      ...rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/message', async (req, res) => {
  try {
    let message = req.query.message;
    console.log('Query:' + message);
    const nc = await connect({ servers: `nats://${process.env.NATS_HOST}:4222` });
    nc.publish('messages.created', new TextEncoder().encode(JSON.stringify({ id: Math.floor(Math.random() * 10), message: message })));
    await nc.drain();
    res.json({
      'status': 'success'
    });
  } catch (err) {
    console.log({ error: err.message })
    res.status(500).json({ error: err.message });
  }
})

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(9000, () => console.log('Server running on port 9000'));

