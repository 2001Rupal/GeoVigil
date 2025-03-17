const express = require("express");
const router=express.Router();
const passport=require("passport");
const User=require("../models/User");

//register route
router.post("/register",async(req,res)=>{
    const{username,id,address,email,passoword}=req.body;
    try{
        const userExits=await User.findOne({email});
        if(userExits) return res.send("user Already exits");
        const newUser=new User({username,id,address,email,passoword});
        await newUser.save();
        res.redirect('/login');
    }catch(err)
    {
        res.send("Error Creating User");
    }
});
//login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}));

// Logout Route
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) return res.send("Error logging out");
        res.redirect("/");
    });
});

//dashboard route
router.get("/dashboard",isAuthenticated,(req,res)=>{
    res.send(`Welcome, ${req.user.username}`);
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

// router.get("/", (req, res) => {
//     res.render("home", { title: "Home Page", content: "Welcome to GeoVigile!" });
// });


module.exports=router;

