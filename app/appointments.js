const express = require('express');
const router = express.Router();
const Appointment = require('./models/appointment');

// TODO

function tolinks(app) {
    return {
		self: '/api/v1/appointments/' + app.id,
		service : app.service,
		userId : '/api/v1/users/' + app.userId,
		materials : app.materials.map( (item) => {
		    return {
			materialId : '/api/v1/materials/' + item.materialId,
			quantity : item.quantity
		    };
		}),
		date : app.date,
		alreadyPaid : app.alreadyPaid
	};
}

// get
router.get('', async(req, res) => {
    let allAppointments = await Appointment.find();
    res.status(200).json(allAppointments.map( tolinks ));
})

router.get('/:id', async (req, res) => {
    let app = await Appointment.findById(req.params.id);
    if (app == null) res.status(404).json({ error: 'Not found' });
    else res.status(200).json(tolinks(app));
});
    

//post
	   
module.exports = router
