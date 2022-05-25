const express = require('express');
const router = express.Router();
const Appointment = require('./models/appointment');

function appointmentToLink(app) {
    return {
		self: '/api/v2/appointments/' + app.id,
		service : app.service,
		userId : '/api/v2/users/' + app.userId,
		materials : app.materials.map( (item) => {
		    return {
			materialId : '/api/v2/materials/' + item.materialId,
			quantity : item.quantity
		    };
		}),
		date : app.date,
		alreadyPaid : app.alreadyPaid
	};
}

// get


/**
 *  @openapi
 *  /api/v1/appointments:
 *      get:
 *          summary: Returns all the appointments
 *          responses:
 *              200:
 *                  description: A list of appointments
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items: 
 *                                  $ref: '#/components/schemas/appointmentSchema'
 *              404:
 *                  description: Not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: Not found
 */

router.get('', async(req, res) => {
    let allAppointments = await Appointment.find();
    if (allAppointments == null) res.status(404).json({ error: 'Not found' });
    else res.status(200).json(allAppointments.map( appointmentToLink ));
})

/**
 *  @openapi
 *  /api/v1/appointments/{id}:
 *      get:
 *          summary: Returns an appointment by ID
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                type: string
 *                description: The ID of the appointment to return.
 *                example: 6287f53594cf2c342a3a9d81
 *          responses:
 *              200:
 *                  description: an appointment
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/appointmentSchema'
 *              404:
 *                  description: Not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: Not found
 */

router.get('/:id', async (req, res) => {
    let app = await Appointment.findById(req.params.id);
    if (app == null) res.status(404).json({ error: 'Not found'});
    else res.status(200).json(appointmentToLink(app));
});
    

//post

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
	if (material == null)                     throw 'material does not exist';
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

async function checkDate (date) {
   //check date
   return date;
}

async function extractAppointmentData(req) {
	if (req == null)               throw 'empty request';
	if (req.service == null)       throw 'service not specified';
	if (req.userId == null)        throw 'user not specified';
	if (req.materials == null)     throw 'materials not specified';
	if (req.date == null)          throw 'date not specified';
	if (req.alreadyPaid == null)   throw 'alreadyPaid not specified';

	let userId = extractValue (req.userId)
//      let user = await User.findById(userId);
	if (user == null)       throw 'user does not exist';

	let material = checkMaterials(req.materials);  
	let date = checkDate(req.date);

	return new Appointment ({
			appointmentPlaced: Date(),
			service : req.service,
			userId : userId,
			materials : material,
			date : date,
			alreadyPaid : req.alreadyPaid
	})
}


router.post('', async (req, res) => {
	try {
			app = extractAppointmentData(req);
	} catch (e) {
			return res.status(400).json({ e });
	}
	return res.location("/api/v2/appointments/" + app.id).status(201).send();
});
	   
module.exports = router
