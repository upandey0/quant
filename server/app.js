const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db-config/connection');
const { register, login, getUser } = require('./controllers/user-controller.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET 

if(!JWT_SECRET) {
    process.exit(1)
}

// Middleware
app.use(cors());
app.use(express.json());

// DB- Connection 
dbConnection()


// Register API
app.post('/api/register', register);

// Login API
app.post('/api/login', login);

app.get('/api/user', getUser)
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

