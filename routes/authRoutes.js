const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Ensure you have a User model
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Show Register Page
router.get("/register", (req, res) => {
    res.render("register.ejs");
});

// Handle User Registration
router.post("/register", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render("register.ejs", { error: "Passwords do not match" });

    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.render("register", { error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword });

        await user.save();
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.render("register", { error: "Something went wrong" });
    }
});

// Show Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

// Handle Login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
}));

// Logout User
router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/login");
    });
});

// Show Dashboard (Protected Route)
router.get("/dashboard", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.render("dashboard", { user: req.user });
});

module.exports = router;
