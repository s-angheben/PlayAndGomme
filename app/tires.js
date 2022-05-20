const express = require('express');
const router = express.Router();
const Tire = require('./models/tire');

function tolinks(totire){
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

router.get('/',async(req, res) =>{
    let allTires = await Tire.find();
    res.status(200).json(allTires.map(tolinks));
})

router.get('/:id',async (req,res) =>{
    let singleTire = await Tire.findById(req.params.id);
    res.status(200).json(tolinks(singleTire));
})

module.exports = router