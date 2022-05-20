const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
        title: 'PlayAndGomme API',
            version: '1.0.0',
        },
    },
    apis: ['./app/appointments.js', './app/models/appointment.js'], 
};

const swaggerDocument = swaggerJsDoc(swaggerOptions);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const appointments = require('./appointments.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static('static'));

// API

app.use('/api/v1/appointments', appointments);

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;

