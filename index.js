const express = require('express');
const passport = require('passport');
const session = require('express-session');

const router = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded());

// using express-session for google authentication
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// database
const db = require('./config/mongoose');

// main routing
app.use('/',router);

// listening the server
app.listen(3000, function(err){
    if(err){
        console.log('Error in running express server on port 3000.');
    }
    console.log('Express server is running on port 3000.');
});