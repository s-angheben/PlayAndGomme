const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        info: {
        title: 'PlayAndGomme API Information',
            version: '1.0.0',
        },
    },
    apis: ['./app/app.js'], // files containing annotations as above
};

const swaggerDocument = swaggerJsDoc(swaggerOptions);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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

