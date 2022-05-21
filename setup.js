require('dotenv').config()
var mongoose = require('mongoose');
var Appointment = require('./app/models/appointment');

mongoose.connect(process.env.DB_URL)
.then ( () => {
	console.log("connected to Database");
});

Appointment.remove().then( () => {
    const app1 = new Appointment({
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

    const app2 = new Appointment({
		appointmentPlaced: "2022-06-18",
		service : "riparazione",
		userId : "userid3",
		materials : [],
		date : "2022-07-08",
		alreadyPaid : false
    });

    app1.save();
    return app2.save();
}).then( () => {
    console.log('appointments added');
    process.exit();
});
