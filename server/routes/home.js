var express = require('express');
var router = express.Router();
var connection  = require('../models/db.js');
var auth = require('../models/auth');

var config = require('../models/config');

const { exec } = require('child_process');
var updater = require('../models/update');
router.get("/", (req, res) => {
    res.render("index", { title: "Login" });
});
router.post('/login', (req, res) => {
    const { user, password } = req.body;
    const hashedPassword = auth.getHashedPassword(password);
    //console.log(auth.config.password);
    console.log(password);
    if (user == config.read('username') && password ==  config.read('password')) {
        const authToken = auth.generateAuthToken();

        // Store authentication token
        //authTokens[authToken] = user;

        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);

        // Redirect user to the protected page
        res.redirect('/home');
    } else {
        res.redirect('/');
    }
});
router.get("/home", (req, res) => {
    res.render("home", { title: "Home" , rooms: connection.data.rooms, nutzer : connection.data.personen});
});
router.get("/reboot", (req, res)=>{    
    updater.reboot();
    res.render("reboot");
})
module.exports = router;