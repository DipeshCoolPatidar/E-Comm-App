const express = require('express');
const router = express.Router();
const isLoggedin = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');


router.get('/', (req, res)=>{
    let error = req.flash("error");
    res.render( "index", {error, loggedin: false } );
});

router.get("/shop", isLoggedin, async (req, res)=>{
    let products = await productModel.find();
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("shop", { products, success, error });
});

router.get("/cart", isLoggedin, async (req, res)=>{
    let user = await userModel.findOne({email: req.user.email}).populate("cart");
    console.log("user", user);
    
    //const total = Number(user.cart[0].price)+20- Number(user.cart[0].discount);
    res.render("cart", {user});
});

router.get("/addtocart/:productid", isLoggedin, async (req, res)=>{
    try{
        let user = await userModel.findOne({email: req.user.email}).populate("cart");

        const indextodelete = user.cart.findIndex(item=> item.id === req.params.productid);
            if(indextodelete === -1){
            user.cart.push(req.params.productid);
            await user.save();
            req.flash("success", "Added to Cart");
            res.redirect('/shop');
            }
            else{
                req.flash("error", "Item already Added to cart")
                res.redirect('/shop');
            }
        }
         catch(err){
        console.log(err);
    }
  
   
   
});

router.get("/removetocart/:productid",isLoggedin, async (req, res)=>{
    let user = await userModel.findOne({email: req.user.email}).populate("cart"); 
   const indextodelete = user.cart.findIndex(item=> item.id === req.params.productid);
   user.cart.splice(indextodelete, 1);
    await user.save();
    res.redirect('/cart');
} )

router.get('/increse/:id' , isLoggedin, async (req, res)=>{
    const data = 2
})
module.exports = router;