require('dotenv').config();                           //ta kryfa key, secret kai name tou cloud mas apo to .env


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');                    //gia epilogi stratigikhs passport
const User = require('./models/user');                              //require tou user schema
const mongoSanitize = require('express-mongo-sanitize');
//const helmet = require('helmet');
const dbUrl = '//mongodb://localhost:27017/yelp-camp' || process.env.DB_URL;
const MongoDBStore = require("connect-mongo")(session);     //prosoxi! douleuvei me to version 3 connect-mongo mono

const userRoutes = require('./routes/users');                       //require ta routes apo router
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


mongoose.connect(dbUrl, {           //syndesi stin vash->
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});                                                                //->mexri edw o kwdikas gia syndesi sti vash


const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(mongoSanitize());    //gia asfaleia sto req.query wste o xristis na min mporei na valei keys kai xarakthres ($gt:) pou tha tou dwsoun prosvash stin vash

//Ola ta app.use() mas apo katw ->

const secret = process.env.SECRET || 'manilla'; //to session secret 

const store = new MongoDBStore({  //auto apotelei to storage twn session mas, doulevei me to connect-mongo version 3 mono!!
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {                               //edw dimiourgoume to session mas kai stelnoume pisw ena cookie
    store,
    name: 'manilla',       //allazw to onoma tou session gia prostasia, vgazontas to default
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {                                     //vazoume aftes tis rithmiseis opws tis vlepoume kai vazoume kai expiration date
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));                  //leme sto express oti mporoume na xrisimopoihsoume ton fakelo public

app.use(passport.initialize());                    //xrisi tou passport **prepei to app.use() edw na graftei meta ta app.use() tou session!!
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  //to grafoume opws einai, to User to exoume kanei require panw panw, einai to user schema

passport.serializeUser(User.serializeUser());       //store tou User sto session
passport.deserializeUser(User.deserializeUser());   //unstore tou User apo to session


app.use(flash());                              //xrisi flash

app.use((req, res, next) => {                  //xrisi flash middleware
    res.locals.currentUser = req.user;         //xrisi req.user apo Passport kai anathesi sto res.locals, kathe fora pou exoume session 
    //enos xristh, to res.locals.currentUser exei mesa tou times. Episis einai global oste na to xrisimopoisoume pantou.
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.get('/', (req, res) => {
    res.render('home')
});

app.get('/about', (req, res) => {
    res.render('about')
});

app.use('/campgrounds', campgroundRoutes);               //eisagwgi campgrounds routes me Router
app.use('/campgrounds/:id/reviews', reviewRoutes);       //eisagwgi reviews routes me Router
app.use('/', userRoutes);                                //eisagwgi user routes me Router

app.get('/about', (req, res) => {
    res.render('campgrounds/about');
});



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
});