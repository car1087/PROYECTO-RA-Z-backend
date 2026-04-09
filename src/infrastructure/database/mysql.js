const mysql = require('mysql2/promise');

require('dotenv').config();

function buildPoolConfig() {
  if (process.env.DATABASE_URL) {
    const databaseUrl = new URL(process.env.DATABASE_URL);
    return {
      host: databaseUrl.hostname,
      port: databaseUrl.port ? Number(databaseUrl.port) : 3306,
      user: decodeURIComponent(databaseUrl.username),
      password: decodeURIComponent(databaseUrl.password),
      database: databaseUrl.pathname.replace(/^\//, ''),
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
      queueLimit: 0,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    };
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  };
}

const poolConfig = buildPoolConfig();
const pool = mysql.createPool(poolConfig);

async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    return {
      host: poolConfig.host,
      port: poolConfig.port,
      database: poolConfig.database
    };
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  testConnection
};