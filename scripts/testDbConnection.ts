import mysql from 'mysql2/promise';
import 'dotenv/config'; // Load environment variables from .env file

async function testDbConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log('✅ Connected to the database');
    await connection.end();
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
  }
}

testDbConnection();