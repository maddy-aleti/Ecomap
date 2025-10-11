import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const {Pool} = pg;

// Use only DATABASE_URL for connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    } else {
        console.log('Database connected successfully');
    }
});

export default pool;