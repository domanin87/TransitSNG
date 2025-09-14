
const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();
(async ()=>{
  try{
    const sql = fs.readFileSync(__dirname + '/../../migrations/init.sql', 'utf8');
    const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await client.connect();
    await client.query(sql);
    await client.end();
    console.log('Migrations applied');
  }catch(e){ console.error('Migration failed', e); process.exit(1); }
})();
