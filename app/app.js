import { handler } from '../build/handler.js';
import express from 'express';

const app = express();

import appointments from './appointments.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use('/', express.static('static'));

// API

app.use('/api/v1/appointments', appointments);

app.use(handler);

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

//module.exports = app;
export default app;
