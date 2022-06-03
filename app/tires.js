const express = require('express');
const router = express.Router();
const Tire = require('./models/tire');

function TireToLink(totire){
    return {
            self: '/api/v2/tires/' + totire.id,
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

function isNumeric(num){
    return !isNaN(num)
  }

//GET

/**
 * @openapi
 * 
 *  /api/v2/tires:
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
 *  /api/v2/tires/{id}:
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


/**
 *  @openapi
 *  /api/v2/tires/{id}:
 *  delete:
 *      description: Delete the tire with that specific id.
 *      summary: Delete the tire with id={id}
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: string
 *            description: The ID of the tires to delete.
 *            example: 6287f53594cf2c342a3a9d81
 *      responses:
 *          204:
 *              description: Tire removed correctly
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Tire removed
 *          404:
 *              description: Tire not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Not found
 */

router.delete('/:id', async (req, res) => {
    let tire = await Tire.findById(req.params.id);
    if (tire == null) {
        res.status(404).json({error: 'tire not found'})
        console.log('tire not found')
        return;
    }
    await tire.deleteOne()
    console.log('tire removed')
    res.status(204).json({error: 'tire removed correctly'});
});



/**
 *  @openapi
 *  /api/v2/tires/{id}:
 *  put:
 *      description: Update the tire with that specific id. In the body of the method you can insert all the data you want to update; the data that will not be inserted in the body will remain the same as before the call.
 *      summary: used to update the tire with id={id}
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: string
 *            description: The ID of the tires to delete.
 *            example: 6287f53594cf2c342a3a9d81
 *      requestBody:
 *          required: false
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Tire'
 *      responses:
 *          201:
 *              description: Tire update correctly
 *          404:
 *              description: Tire id incorrect
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Not found
 *          400:
 *              description: A field of the body is empty or A field of the body has not a valid value
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: the variable {field} has not a (valid) value
 */

router.put('/:id',async (req,res) =>{
    let singleTire = await Tire.findById(req.params.id).exec();
    if(singleTire == null) res.status(404).json({ error: 'Not found'});

    let keys = Object.keys(req.body);

    for(let i=0; i<keys.length; i++){
        if(req.body[keys[i]] == ''){
            console.log('error');
            return res.status(400).json({ error: 'the variable ' + keys[i] + ' has not a value'});
        }
        switch(keys[i]){
            case 'type':
                if(req.body[keys[i]] != 'invernali' && req.body[keys[i]] != 'estive' && req.body[keys[i]] != 'quattro_stagioni'){
                    return res.status(400).json({ error: 'type not valid. Valid option: invernali, estive, quattro_stagioni'});
                }
                break;
            case 'length': 
            case 'height':
            case 'diameter':
            case 'quantity':
                if(isNumeric(req.body[keys[i]]) == false || Number.isInteger(Number(req.body[keys[i]])) == false || Number(req.body[keys[i]]) < 0){
                    return res.status(400).json({ error: 'the variable ' + keys[i] + ' has not a valid value'});
                }
                break; 
            case 'price':
                if(isNumeric(req.body[keys[i]]) == false || Number(req.body[keys[i]]) < 0){
                    return res.status(400).json({ error: 'the variable ' + keys[i] + ' has not a valid value'});
                }
                break;
        }
        singleTire[keys[i]] = req.body[keys[i]];
    }

    singleTire = await singleTire.save();

    let tireId = singleTire.id;
    console.log('Tire saved sucesfully');
    res.location("/api/v2/tires/" + tireId).status(201).send(); 
})

/**
 *  @openapi
 *  /api/v2/tires:
 *  post:
 *      description: Create a new Tire
 *      summary: used to create a new tire
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Tire'
 *      responses:
 *          201:
 *              description: Tire Saved correctly
 *          400:
 *              description: A field of the body is empty or A field of the body has not a valid value
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          example: Type error or Fill in all filds
 */

router.post('', async (req, res) => {

    console.log(req.body);
    const isError = new Boolean(req.body.brand == '' || req.body.model == '' || req.body.length == '' || req.body.height == '' ||
                                req.body.diameter == '' || req.body.quantity == '' || req.body.type == '' || req.body.price == '');

    const isNumber = new Boolean(isNumeric(req.body.length) == false || isNumeric(req.body.height) == false || isNumeric(req.body.diameter) == false ||
                                isNumeric(req.body.quantity) == false || isNumeric(req.body.price) == false);

    const isNumberValid = new Boolean(  Number.isInteger(Number(req.body.length)) == false || Number(req.body.length) <= 0 || 
                                        Number.isInteger(Number(req.body.height)) == false || Number(req.body.height) <= 0 ||
                                        Number.isInteger(Number(req.body.diameter)) == false || Number(req.body.diameter) <= 0 ||
                                        Number.isInteger(Number(req.body.quantity)) == false || Number(req.body.quantity) < 0 ||
                                        Number(req.body.price) < 0);
    if(isError == true){
        console.log('Campo Vuoto');
        return res.status(400).json({ error: 'fill in all filds'});
    }
    if(isNumber == true){
        console.log('Errore di tipo del/dei campo/i');
        return res.status(400).json({ error: 'type error'});
    }
    if(isNumberValid == true){
        console.log('Numero/i non valido');
        return res.status(400).json({ error: 'number not valid'});
    }
    if(req.body.type != 'invernali' && req.body.type != 'estive' && req.body.type != 'quattro_stagioni'){
        console.log('Campo Tipo Errato');
        return res.status(400).json({ error: 'type not valid. Valid option: invernali, estive, quattro_stagioni'});
    }
    let tire = new Tire({
        brand: req.body.brand,
        model: req.body.model,
        length: req.body.length,
        height: req.body.height,
        diameter: req.body.diameter,
        quantity: req.body.quantity,
        type: req.body.type,
        price: req.body.price
    });
    
    tire = await tire.save();

    let tireId = tire.id;
    console.log('Tire saved sucesfully');
    res.location("/api/v2/tires/" + tireId).status(201).send();
})


module.exports = router