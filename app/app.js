const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
var mongoose = require('mongoose');

const ApiError = require('./utils/apiError')
const tokenHandler = require('./tokenHandler.js');
const authenticate = require('./authenticate.js');

app.use(cors());

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
        title: 'PlayAndGomme API',
        version: '1.0.0',
        description: 'API for managing a tire shop'
        },
    },
    apis: ['./app/tires.js','./app/models/tire.js', './app/appointments.js', './app/models/appointment.js', './app/users.js', './app/models/user.js'],
};

const swaggerDocument = swaggerJsDoc(swaggerOptions);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const appointments = require('./appointments.js');
const tires = require('./tires.js');
const users = require('./users.js');
const datae = require('./data.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(process.env.FRONTEND || 'static'));


//Middleware
app.use('/api/v2/login', tokenHandler);
app.use('/api/v2/appointments',authenticate);

// API
app.use('/api/v2/appointments', appointments);
app.use('/api/v2/tires', tires);
app.use('/api/v2/users', users);
app.use('/api/v2/data', datae);

app.use((req,res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

app.use(function handleAPIError(error, req, res, next) {
    if (error instanceof ApiError) {
        console.log(error.message);
        console.log(error.statusCode);
		return res.status(error.statusCode).json({ "error": error.message }).send();
    }
    next(error);
});

app.use(function handleMongoError(error, req, res, next) {
    if (error instanceof mongoose.Error) {
        if (error instanceof mongoose.Error.CastError) {
            console.log(error);
            console.log(typeof(error));
	    	return res.status(500).json({ "error": "cast db error" }).send();
        } else { 
	    	console.log(error)
	    	return res.status(500).json({ "error": "db error" }).send();
        }
    }
    next(error);
});

app.use(function defaultError(error, req, res, next) {
    console.log(error)
    return res.status(500).json({ "error": "internal error" }).send();
});

module.exports = app;

