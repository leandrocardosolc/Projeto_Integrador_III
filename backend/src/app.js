const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middleware para JSON
app.use(express.json());

// Rotas
app.use('/api', routes);

module.exports = app;