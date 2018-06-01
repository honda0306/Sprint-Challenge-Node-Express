const express = require('express');
const cors = require('cors');
const app = express();
const action = require('./data/helpers/actionModel');
const mappers = require('./data/helpers/mappers');
const project = require('./data/helpers/projectModel');

const port = 5000;

app.use(express.json());
app.use(cors());

const errorHandler = (status, message, res) => {
    res.status(status).json({ error: message });
};