console.log("index.js file started");

const express = require('express');
const userService = require('./services/userService');

const app = express();
app.use(express.json());

// GET all users
app.get('/user', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET user by id
app.get('/user/:id', async (req, res) => {
    try {
        const user = await userService.getUser(Number(req.params.id));
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create user
app.post('/user', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email required" });
        }

        const user = await userService.createUser({ name, email });
        res.status(201).json({ message: "User created", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ REST server running on port ${PORT}`);
});
