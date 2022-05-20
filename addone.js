var mongoose = require('mongoose');
var Appointment = require('./app/models/appointment');

const db_url = 'db_url';

mongoose.connect(db_url)
.then ( () => {
	console.log("connected to Database");
}).then( () => app.save()).then( () => {
    console.log('appointments added');
    process.exit();
});

const app = new Appointment({
		appointmentPlaced: Date(),
		service : "cambio_gomme",
		userId : "userid1",
		materials : [{
		    "materialId" : "material1",
		    "quantity" : "4" 
		}],
		date : "2022-09-08",
		alreadyPaid : true
	});
