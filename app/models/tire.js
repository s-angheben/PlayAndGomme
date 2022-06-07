const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 
 *  @openapi
 *  components:
 *      schemas:
 *          Tire:
 *              type: object
 *              required:
 *                  - brand
 *                  - model
 *                  - length
 *                  - height
 *                  - diameter
 *                  - quantity
 *                  - type
 *                  - price
 *              properties:
 *                  brand:
 *                      type: string
 *                      description: 'Brand of the tire'
 *                  model:
 *                      type: string
 *                      description: 'Model of the tire'
 *                  length:
 *                      type: number
 *                      description: 'length of the tire'
 *                  height:
 *                      type: number
 *                      description: 'height of the shoulder of the tire in relation to the length'
 *                  diameter:
 *                      type: number
 *                      description: 'diameter of the tire'
 *                  quantity:
 *                      type: number
 *                      description: 'number of tires in the warehouse'
 *                  price:
 *                      type: number
 *                      description: 'tire price for the customer'
 *                  type:
 *                      type: number
 *                      description: 'type of the tire (all Season, Winter or Summer)'
 * 
 */

const tireSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    diameter: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ['invernali', 'estive', 'quattro_stagioni'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {timestamps: true});

const Tire = mongoose.model('Tire', tireSchema);
module.exports = Tire;



