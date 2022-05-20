const myapp = require('./app/app.js');
const mongoose = require('mongoose');

const port = 8080;
const db_url = 'db_url';

myapp.app.locals.db = mongoose.connect(db_url)
.then ( () => {
        
    myapp.app.listen(port, () => {
        console.log(`Server listening on port: ${port}`);
    });
    
}).catch ( () => {

    console.log("Error connnecting to the database");
    throw new Error('db connection error');

});

myapp.http.listen(3030, () => {
    console.log(`Socket.IO server running at http://localhost:3030/`);
});
