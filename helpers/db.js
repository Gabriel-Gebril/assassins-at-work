const { Pool } = require('pg');
const keys = require('../config/keys')

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'aaw',
    password: keys.db.password
});

module.exports = pool;
