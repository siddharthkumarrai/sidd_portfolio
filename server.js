if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
};

const express = require("express");
const app = express();
const mongoose = require("mongoose")
const {connectMongoose,User,Client} = require("./database.js")
var bodyParser = require('body-parser')
const path = require("path");
const ejs = require("ejs");
engine = require('ejs-mate');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const {initializingPassport,isAuthenticated} = require("./passportconfig.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const { error } = require("console");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {clientSchema} = require("./schema.js");

connectMongoose();
initializingPassport(passport);

app.engine(`ejs`,engine);
app.set("views",path.join(__dirname,"/views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended:true }));


app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_ATLAS_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on(error,(error)=>{
    console.log("ERROR IN MONGOSESSION STORE",error)
});

const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next()
})

app.get("/home",(req,res)=>{
    res.render("index/index.ejs");
});

app.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

app.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
app.post("/signup",async(req,res)=>{

 try {
    // const user = await User.findOne({username: req.body.username});
    // if(user) return res.status(404).send("user already exists");
    let {username,email,password} = req.body;
    if(!req.body){
        throw new ExpressError(404,"send valid data")
    }
    const newUser = new User({username,email})
    let registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(error)=>{
        if (error) {
            return  next(error);
        };
        req.flash("success","welcome");
        res.redirect("/home");
   })
 } catch (error) {
    req.flash("error",error.message);
    res.redirect("/signup");

 }
});

app.post("/login",passport.authenticate("local",{
                        failureRedirect:"/login",
                        failureFlash:true,
                    }),
                    async(req,res)=>{
                        try {
                            req.flash("success","welcome")
                        res.redirect("/home")
                        } catch (error) {
                            req.flash("error",error.message);
                            res.redirect("/home");
                        }
                        
                    }
);

app.get("/logout",(req,res)=>{
    req.logOut((error)=>{
        if(error){
            return next(err);
        }
        req.flash("success","logged out !");
        res.redirect("/home")
    })
});


app.post("/home", async(req,res,next)=>{
    try {
        let {name,email,phoneNr,subject,description} = req.body;
        let result = clientSchema.validate(req.body);
        const newClient = new Client({name,email,phoneNr,subject,description,});
        await newClient.save();
        req.flash("success","form was submit");
        res.redirect("/home");
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/home");
        next(error)
    };
   
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
}) 

app.use((err,req,res,next)=>{
    let {status=500,message="some error occured"} = err;
    res.render("error.ejs",{message});
});


const port = 8080
app.listen(port,()=>{
    console.log(`app.listening on port${port}`)
})