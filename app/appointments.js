import express from 'express';
const router = express.Router();
import Appointment from './models/appointment.js';

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
    if (app == null) return res.status(404).json({ error: 'Not found' });
    
	res.status(200).json(tolinks(app));
});
    

//post
/*
function extractValue (linkValue) {
	if(!linkValue instanceof String) throw 'expected a link to the resource';
	return linkValue.substring(linkValue.lastIndexOf('/') + 1);
}

async function checkMaterial (materialObject) {
	if(materialObject.materialId == null) throw 'missing material id';
	if(materialObject.quantity == null)   throw 'missing material quantity';
	if(isNaN(materialObject.quantity))    throw 'material quantity is not a number';

	let materialId = extractValue(materialObject.materialId);
	// check existance
	let material = await Material.findById(materialId);
	if (material == null)       		  throw 'material does not exist';
	// check available quantity
	let availableQuantity = await Material.getquantity(materiaId);
	if (availableQuantity < quantity)     throw 'quantity not sufficient';

	return {
		"materialId" : materialId,
		"quantity" : materialObject.quantity
	}
}

async function checkMaterials (materials) {
	if (!Array.isArray(materials))   throw 'materials is not an array';
	return materials.map(checkMaterial);
}

async function extractAppointmentData(req) {
	if (req == null) 		throw 'empty request';
	if (!req.service) 		throw 'service not specified';
	if (!req.userId) 		throw 'user not specified';
	if (!req.materials) 	throw 'materials not specified';
	if (!req.date) 			throw 'date not specified';
	if (!req.alreadyPaid)	throw 'alreadyPaid not specified';

	let userId = extractValue (req.userId)
//	let user = await User.findById(userId);
	if (user == null)       throw 'user does not exist';

	let material = checkMaterials();  
	
	return new Appointment ({
		appointmentPlaced: Date(),
		service : req.service,
		userId : userId,
		materials : material,
		date : req.date,
		alreadyPaid : req.alreadyPaid
	})
}


router.post('', async (req, res) => {
	try {
		app = extractAppointmentData(req);
	} catch (e) {
		return res.status(400).json({ e });
	}
	return res.location("/api/v1/appointments/" + app.id).status(201).send();	
});
*/	   

//module.exports = router
export default router;
