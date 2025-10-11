import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const {Pool} = pg;

// Debug logging
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'Not set');

// Use only DATABASE_URL for connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
        console.error('Full error:', JSON.stringify(err, null, 2));
    } else {
        console.log('Database connected successfully');
        console.log('Connected at:', res.rows[0].now);
    }
});

export default pool;