const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/userRoutes");
const passport=require("./config/passport");
const authRoutes = require("./routes/authRoutes"); 
const flash = require("connect-flash");
const passport1 = require("passport");

const engine = require('ejs-mate');




dotenv.config();
connectDB();



const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:true,
        store:MongoStore.create({mongoUrl:process.env.MONGO_URI}),

    })
);


// middleware
app.use(passport1.initialize());
app.use(passport1.session());


// Flash Messages
app.use(flash());



//set view engine
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});



app.use("/", userRoutes);
app.use("/", authRoutes);


app.get('/', (req, res) => {
    res.render('home', { title: 'Home Page' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});