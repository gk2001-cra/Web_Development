const db = require('../db');

exports.getUser = async (id) => {
    const [rows] = await db.query(
        'SELECT id, name, email FROM users WHERE id = ?',
        [id]
    );
    return rows.length ? rows[0] : null;
};

exports.getAllUsers = async () => {
    const [rows] = await db.query(
        'SELECT id, name, email FROM users'
    );
    return rows;
};

exports.createUser = async (user) => {
    const [result] = await db.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [user.name, user.email]
    );
    return { id: result.insertId, name: user.name, email: user.email };
};
