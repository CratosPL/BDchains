import mysql from 'mysql2/promise';
import 'dotenv/config';

// Konfiguracja połączenia z bazą danych
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export class User {
  // Znajdź użytkownika po adresie bech32
  static async findUserByAddress(bech32address: string) {
    const [rows] = await pool.query('SELECT * FROM users WHERE bech32address = ?', [bech32address]);
    return rows[0] || null;
  }

  // Utwórz nowego użytkownika
  static async createUser(bech32address: string, username: string, avatarUrl: string | null = null) {
    const [result] = await pool.query(
      'INSERT INTO users (bech32address, username, avatarUrl) VALUES (?, ?, ?)',
      [bech32address, username, avatarUrl]
    );
    return result.insertId;
  }

  // Zaktualizuj użytkownika
  static async updateUser(bech32address: string, username: string, avatarUrl: string | null) {
    await pool.query(
      'UPDATE users SET username = ?, avatarUrl = ? WHERE bech32address = ?',
      [username, avatarUrl, bech32address]
    );
  }
}