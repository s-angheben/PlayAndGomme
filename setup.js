require('dotenv').config()
var mongoose = require('mongoose');
var Appointment = require('./app/models/appointment');
var User = require('./app/models/user');
var Tire = require('./app/models/tire');

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
});

Tire.remove().then( () => {
    const tire1 = new Tire({
        brand: 'Michelin',
        model: 'Climate',
        length: '275',
        height: '40',
        diameter: '18',
        quantity: '40',
        type: 'quattro_stagioni',
        price: '199.99'
    });

    const tire2 = new Tire({
        brand: 'Nokian',
        model: 'Snow 2',
        length: '235',
        height: '45',
        diameter: '17',
        quantity: '20',
        type: 'invernali',
        price: '149.99'
    });

    const tire3 = new Tire({
        brand: 'Pirelli',
        model: 'Sport 2',
        length: '255',
        height: '45',
        diameter: '19',
        quantity: '12',
        type: 'estive',
        price: '189.99'
    });

    const tire4 = new Tire({
        brand: 'Bridgestone',
        model: 'Snow',
        length: '245',
        height: '50',
        diameter: '18',
        quantity: '20',
        type: 'invernali',
        price: '169.99'
    });
    tire1.save();
    tire2.save();
    tire3.save();
    return tire4.save();
}).then( () => {
    console.log('tires added');
});

User.remove().then( () => {
    const user1 = new User({
        username: "user1",
        password: "pass1"
    });

    const user2 = new User({
        name: "John",
        surname: "Jee",
        phone: 15646,
        email: "john@io.com",
        username: "user2",
        password: "pass2"
    });

    user1.save();
    return user2.save();
}).then( () => {
    console.log('users added');
});