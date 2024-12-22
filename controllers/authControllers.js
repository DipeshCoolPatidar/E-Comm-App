const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken')


 module.exports.registerUser = async (req, res)=>{
   
    try{
     let {fullname, email, password} = req.body;
     let user = await userModel.findOne({email: email})
     if(user) return res.status(401).send("You already have an account, pls.. Login");
     else{
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(password, salt, async (err, hash)=>{
                if(err) return res.send(err.message)
                else{
                    let user = await userModel.create({
                        fullname,
                        email,
                        password: hash,
                    });
                    let token = generateToken(user);
                    res.cookie("token", token);
                    res.redirect('/shop');
                 }
            })
        })
     }
    
 
     
    }
    catch(err){
     res.send(err.message)
    }
 }

 module.exports.loginUser = async (req, res)=>{
    try{
        let {email, password} = req.body;
    let user = await userModel.findOne({email: email})
   
    if(!user) return res.send("email  wrong");
    bcrypt.compare(password, user.password, (err, result)=>{
        
        if(result){
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect('/shop');
        } else{
            return res.redirect('/')
        }
    })
    } 
    catch(err){
        console.log(err);
    }
    
 }

 module.exports.logout = (req, res)=>{
    res.cookie("token", "");
    res.redirect("/");
 }