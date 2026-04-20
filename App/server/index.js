require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
// @ts-ignore
const profileRoute = require('./src/routes/profileRoutes')
app.use('/api/profile', profileRoute);


module.exports = app;