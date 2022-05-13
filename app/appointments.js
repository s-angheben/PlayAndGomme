const express = require('express');
const router = express.Router();

// TODO

// get
router.get('', async(req, res) => {
    let jsonExample = '{"appointmentId": "test1", "userId": "testU"}'
    let appointments = JSON.parse(jsonExample);

    res.status(200).json(appointments);
})
    

//post
	   
module.exports = router
