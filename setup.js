require('dotenv').config()
var mongoose = require('mongoose');
var Tire = require('./app/models/tire');

mongoose.connect(process.env.DB_URL)
.then ( () => {
	console.log("connected to Database");
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
    process.exit();
});