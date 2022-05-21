const express = require('express');
const router = express.Router();
const Tire = require('./models/tire');

function TireToLink(totire){
    return {
            self: '/api/v1/tires/' + totire.id,
            brand: totire.brand,
            model: totire.model,
            length: totire.length,
            height: totire.height,
            diameter: totire.diameter,
            quantity: totire.quantity,
            type: totire.type,
            price: totire.price
    };
}

//GET

/**
 * @openapi
 * 
 *  /api/v1/tires:
 *      get:
 *          description: Gets the list of all tires that the tire dealer have.
 *          summary: View all the tires
 *          responses:
 *              200:
 *                  description: 'Collection of tires'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Tire'
 *              404:
 *                  description: Not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              example: Not found
 */

router.get('/',async(req, res) =>{
    let allTires = await Tire.find();
    if(allTires == null) res.status(404).json({ error: 'Not found'});
    else res.status(200).json(allTires.map(TireToLink));
})

/**
 *  @openapi
 *  /api/v1/tires/{id}:
 *  get:
 *      description: Get a json containing the tire with that specific id.
 *      summary: View the tire with that specific id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: string
 *            description: The ID of the tires to return.
 *            example: 6287f53594cf2c342a3a9d81
 *      responses:
 *          200:
 *              description: 'Tire'
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tire'
 *          404:
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Not found
 */

router.get('/:id',async (req,res) =>{
    let singleTire = await Tire.findById(req.params.id);
    if(singleTire == null) res.status(404).json({ error: 'Not found'});
    else res.status(200).json(TireToLink(singleTire));
})



module.exports = router