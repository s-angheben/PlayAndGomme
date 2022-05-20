require('dotenv').config()
const app = require('./app/app.js');
const mongoose = require('mongoose');

const port = process.env.PORT || 8080;

app.locals.db = mongoose.connect(process.env.DB_URL)
.then ( () => {
        
    app.listen(port, () => {
        console.log(`Server listening on port: ${port}`);
    });
    
}).catch ( () => {

    console.log("Error connnecting to the database");
    throw new Error('db connection error');

});