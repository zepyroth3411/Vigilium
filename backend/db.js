const mysql = require('mysql2')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'vigilium',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err)
  } else {
    console.log('✅ Pool de MySQL conectado exitosamente')
    connection.release()
  }
})

module.exports = pool
