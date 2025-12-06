import mysql from 'mysql2/promise';
import { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } from './config/config.js';
export const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    port: DB_PORT,
    password: DB_PASSWORD,
    database: DB_NAME
});
// Try to connect to the database
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
        return true;
    } catch (error) {
        console.error('Error connecting to database:', error);
        return false;
    }
}
