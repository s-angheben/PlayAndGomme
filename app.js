// Vue
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
        description: 'API for managigng a tire shop'
        },
    },
    apis: ['./app/tires.js','./app/models/tire.js', './app/appointments.js', './app/models/appointment.js'],
};

const swaggerDocument = swaggerJsDoc(swaggerOptions);
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// VUE ROUTER
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var daterouter = require('./routes/daterouter');



// API
const appointments = require('./app/appointments.js');
const tires = require('./app/tires.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static('static'));

//VUE
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/visualdata', daterouter);

// API

app.use('/api/v1/appointments', appointments);
app.use('/api/v1/tires', tires);

app.use((req,res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


// VUE catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
