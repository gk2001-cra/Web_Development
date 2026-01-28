const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',        // ← change if needed
    database: 'user_db', // ← must exist
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB connection at startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully!');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // stop app if DB fails
    }
})();

module.exports = pool;
