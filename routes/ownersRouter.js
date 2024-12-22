const express = require('express');
const   router = express.Router();
const ownerModel = require('../models/owner-model');


router.post('/create', async (req, res)=>{
    
    let owner = await ownerModel.find();
    if(owner.length > 0){
        return res
        .status(503)
        .send("You Don't have to permission to create new Owner");
    }
    let {fullname, email, password } = req.body;
    let createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
    });
    res.status(201).send(createdOwner);

    res.send("You can create new Owner")
})
module.exports = router;

router.get('/admin',(req, res)=>{
    let success = req.flash("success");
    res.render("createproducts", {success});
})