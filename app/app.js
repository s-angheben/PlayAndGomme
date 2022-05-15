const express = require('express');
const app = express();

const tires = require('./tires.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static('static'));

//API

app.use('/api/v1/tires', tires);

app.use((req,res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


module.exports = app;

