var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 *  @openapi
 *  components:
 *      schemas:
 *          materialOrderedSchema:             
 *              type: object
 *              properties:
 *                  materialId:
 *                      type: string
 *                      required: true
 *                      example: /api/v1/materials/6287f53594cf2c342a3a9d81
 *                  quantity:
 *                      type: integer
 *                      minimum: 1
 *                      required: true
 *                      example: 2
 */


const materialOrderedSchema = new Schema({
    "materialId" : {
        type: String,
        required: true
    },
    "quantity" : {
	    type: Number,
	    min: 1,
        required: true
    }
})

/**
 *  @openapi
 *  components:
 *      schemas:
 *          appointmentSchema:
 *              type: object
 *              properties:
 *                  self:
 *                      type: string
 *                      example: /api/v1/appointments/6287cd29675d72225161ca1c
 *                  service:
 *                      type: string
 *                      nullable: false
 *                      enum:
 *                          - 'riparazione'
 *                          - 'controllo'
 *                          - 'cambio_gomme'     
 *                      required: true     
 *                  appointmentPlaced:
 *                      type: string
 *                      format: date-time     
 *                      required: true     
 *                  userId:
 *                      type: string     
 *                      required: true 
 *                      example: /api/v1/users/6287cd29675d72225161ca1a
 *                  materials:
 *                      type: array
 *                      items: 
 *                          oneOf:
 *                              - $ref: '#/components/schemas/materialOrderedSchema' 
 *                  date:
 *                      type: string
 *                      format: date-time     
 *                      required: true     
 *                  alreadyPaid:
 *                      type: boolean     
 *                      required: true     
 * 
 */

const appointmentSchema = new Schema({
    appointmentPlaced : {
        type: Date,
        required: true
    },
    service : {
	    type: String,
	    enum: ['riparazione', 'controllo', 'cambio_gomme'],
        required: true
    },
    userId : {
        type: String,
        required: true
    },
    materials : {
        type: [materialOrderedSchema],
        required: true
    },
    date : {
        type: Date,
        required: true
    },
    alreadyPaid : {
        type: Boolean,
        required: true
    },
})


module.exports = mongoose.model('Appointment', appointmentSchema);

    
