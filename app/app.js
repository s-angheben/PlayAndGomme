const express = require('express');
const app = express();

//socketIO
const app2 = express();
const http = require('http').Server(app2);
const io = require('socket.io')(http, {
    cors: {
      origin: '*',
    }
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    next();
});

//dont' works
//const cors = require('cors')
//app.use(cors())

const AppointmentDB = require('./models/appointment.js');
const appointments = require('./appointments.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static('static'));

// API

app.use('/api/v1/appointments', appointments);

//mongodb watch
AppointmentDB.watch().
    on('change', data => {
        io.emit('data updated');
        console.log("CHANGE!!");
//        console.log(data);
    });

io.on('connection', (socket) => {
    console.log('a user connected');
});


app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = {
    app,
    http
};

