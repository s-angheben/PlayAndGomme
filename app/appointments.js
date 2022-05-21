const express = require('express');
const router = express.Router();
const Appointment = require('./models/appointment');

function appointmentToLink(app) {
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
	   
module.exports = router
