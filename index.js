const app = require('./app/app.js');
const mongoose = require('mongoose');

const port = 8080;
const db_url = 'mongodb+srv://admin:admin@webapp.2wzok.mongodb.net/Node?retryWrites=true&w=majority';


app.locals.db = mongoose.connect(db_url)
.then ( () => {
        
    app.listen(port, () => {
        console.log(`Server listening on port: ${port}`);
    });
    
}).catch ( () => {

    console.log("Error connnecting to the database");
    throw new Error('db connection error');

});