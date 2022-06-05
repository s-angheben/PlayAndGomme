const express = require('express');
const req = require('express/lib/request');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const Appointment = require('./models/appointment');
const Tire = require('./models/tire');
const User = require('./models/user');
const ApiError = require('./utils/apiError');

const datae = require('./data.js');

function appointmentToLink(app) {
    return {
		self: '/api/v2/appointments/' + app.id,
		appointmentPlaced : app.appointmentPlaced,
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
 *  /api/v2/appointments:
 *      get:
 *          summary: Returns all the appointments
 *          responses:
 *              200:
 *                  description: return the list of appointments
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
 *              500:
 *                  description: database or internal error
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: internal error
 */

router.get('', async(req, res) => {
    let allAppointments = await Appointment.find();
	if (allAppointments == null) throw new ApiError(404, "Appointments not found");
    
	res.status(200).json(allAppointments.map( appointmentToLink ));
})

/**
 *  @openapi
 *  /api/v2/appointments/{id}:
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
 *                  description: return the requested appointment
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
 *              500:
 *                  description: database or internal error
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: internal error
 */

router.get('/:id', async (req, res) => {
    let app = await Appointment.findById(req.params.id);
	if (app == null) throw new ApiError(404, "Appointment not found");
	
	res.status(200).json(appointmentToLink(app));
});
    

/**
 *  @openapi
 *  /api/v2/appointments:
 *      post:
 *          summary: Create a new appointment
 *          description: Used to create a new appointment
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/appointmentSchema'
 *          responses:
 *              201:
 *                  description: appointment sucessfully created
 *              400:
 *                  description: invalid data
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: date not specified
 *              404:
 *                  description: resource not found
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: user does not exist
 *              500:
 *                  description: database or internal error
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: internal error
 */

function extractValue (linkValue) {
	if(!linkValue instanceof String) throw 'expected a link to the resource';
	return linkValue.substring(linkValue.lastIndexOf('/') + 1);
}

// TODO check mongoose valid id

async function checkMaterial (materialRequested) {
	if(materialRequested.materialId == null)                 throw new ApiError(400, 'missing material id');

	let materialId = extractValue(materialRequested.materialId);
	if(materialRequested.quantity == null)                   throw new ApiError(400, `missing material quantity of ${materialId}`);
	if(isNaN(materialRequested.quantity))                    throw new ApiError(400, `material quantity of ${materialId} is not a number`);
	if(materialRequested.quantity < 0) 						 throw new ApiError(400, `material quantity is not valid`); 				

    let tire = await Tire.findById(materialId);
	if (tire == null) 										 throw new ApiError(404, "material not found");

	let materialDb = await Tire.findOneAndUpdate(
		{ _id : materialId, quantity : { $gte: materialRequested.quantity } },
		{ $inc : {'quantity': -(materialRequested.quantity) } }
		);
	if (materialDb == null)                                   throw new ApiError(404, `material ${materialId} insufficient`);

	return {
			"materialId" : materialId,
			"quantity" : materialRequested.quantity
	}
}

async function checkMaterials (materials) {
	if (materials == null)         throw new ApiError(400, 'materials not specified');
	if (!Array.isArray(materials)) throw new ApiError(400, 'materials is not a list');

	if (materials.length)          return await Promise.all(materials.map(checkMaterial));
	else                           return [];
}

async function checkDate (date, service, username) {
	if (date == null)              throw new ApiError(400, 'date not specified');
   //add date to calendar
	let startDate = new Date(date);
    let endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + (15*1));

    let event = {
             'summary': `${username}: ${service}`,
             'description': `Appuntamento prenotato tramite sito web`,
             'start': {
                 'dateTime': startDate,
                 'timeZone': 'Europe/Rome'
             },
             'end': {
                 'dateTime': endDate,
                 'timeZone': 'Europe/Rome'
             }
    };
	datae.insertEvent(event);

	return startDate;
}

function checkService (service) {
	if (service == null)                                                 throw new ApiError(400, 'service not specified');
	if (!['riparazione', 'controllo', 'cambio_gomme'].includes(service)) throw new ApiError(400, 'service not valid');

	return service;
}

async function checkUser(user) {
	if (user == null)                           throw new ApiError(400, 'user not specified');
	let userId = extractValue (user)
    let userDb = await User.findById(userId);
	if (userDb == null)                         throw new ApiError(404, 'user does not exist');

	return userId
	// TODO check i'm the user
}

function checkAlreadyPaid(alreadyPaid) {
	if (alreadyPaid == null)             throw new ApiError(400, 'alreadyPaid not specified');
	if (typeof alreadyPaid != "boolean") throw new ApiError(400, 'alreadyPaid is not a boolean');

	return alreadyPaid
}

async function extractAppointmentData(req) {
	if (req.body == null)                          throw new ApiError(400, 'empty request');

	let alreadyPaid = checkAlreadyPaid(req.body.alreadyPaid);
	let service = checkService(req.body.service);
	let userId = await checkUser(req.body.userId);
	let materials = await checkMaterials(req.body.materials);  
	let date = await checkDate(req.body.date, service, req.loggedUser.username);

	return new Appointment ({
			appointmentPlaced: Date(),
			service : service,
			userId : userId,
			materials : materials,
			date : date,
			alreadyPaid : alreadyPaid
	})
}

router.post('', async (req, res) => {
	app = await extractAppointmentData(req);
	appSaved = await app.save();
	res.location("/api/v2/appointments/" + appSaved.id).status(201).send();
});

/**
 *  @openapi
 *  /api/v2/appointments:
 *      put:
 *          summary: update field of a specific appointment
 *          description: modify the value of the fields specified in the json request, the other data remains the same. 
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                type: string
 *                description: The ID of the appointment to return.
 *                example: 6287f53594cf2c342a3a9d81
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/appointmentSchema'
 *          responses:
 *              200:
 *                  description: the appointment has been modified
 *              400:
 *                  description: invalid data
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: date not specified
 *              404:
 *                  description: resource not found
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: user does not exist
 *              500:
 *                  description: database or internal error
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: internal error
 */

router.put('/:id', async (req, res) => {
	if (req.body == null)                          throw new ApiError(400, 'empty request');

    let app = await Appointment.findById(req.params.id);
	if (app == null) throw new ApiError(404, "Appointment not found");

	let PartialApp = {};

	if (!!req.body.service) {
		PartialApp['service'] = checkService(req.body.service);
	}
	if (!!req.body.userId) {
		PartialApp.userId = await checkUser(req.body.userId);
	}
	if (!!req.body.materials) {
		await app.materials.map(restoreMaterial)
		PartialApp.materials = await checkMaterials(req.body.materials);  
	}
	if (!!req.body.date) {
		PartialApp.date = await checkDate(req.body.date);  
	}
	if (!!req.body.alreadyPaid) {
		PartialApp.alreadyPaid = checkAlreadyPaid(req.body.alreadyPaid);
	}

	let updatedApp = await Appointment.findOneAndUpdate({ _id: req.params.id }, PartialApp, {
		new: true
	  });
	
	return res.location("/api/v2/appointments/" + updatedApp._id).status(200).send();
});

/**
 *  @openapi
 *  /api/v2/appointments/{id}:
 *      delete:
 *          summary: delete an appointment by ID
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                type: string
 *                description: The ID of the appointment to return.
 *                example: 6287f53594cf2c342a3a9d81
 *          responses:
 *              200:
 *                  description: appointment specified sucessfully deleted
 *              404:
 *                  description: Not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: Not found
 *              500:
 *                  description: database or internal error
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: internal error
 */

router.delete('/:id', async (req, res) => {
    const appRemoved = await Appointment.findByIdAndRemove(req.params.id);
	
	// restore the materials
	if (appRemoved.materials != null) {
		await appRemoved.materials.map(restoreMaterial);
	}

    return res.status(200).json({});
});
	   

async function restoreMaterial (material) {
	await Tire.findOneAndUpdate(
		{ _id : extractValue(material.materialId) },
		{ $inc : { 'quantity': material.quantity } }
		);
}


module.exports = router
