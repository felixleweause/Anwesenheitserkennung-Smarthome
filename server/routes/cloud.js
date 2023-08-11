var express = require('express');
var router = express.Router();
var connection  = require('../models/db.js');
var cloud = require('../models/cloud');
router.get("/", (req, res) => {
    if(cloud.config.cloudtoken){
        res.render("cloudloggedin", { title: "Cloud" });
    }else {
        res.render("cloudlogin", { title: "Cloud" });
    }
});
router.get("/logout", (req,res) => {
    cloud.logout();
    res.render("cloudlogin", { title: "Cloud" });
})
router.post("/login", (req,res) => {
    var user = req.body.username;
    var password = req.body.password;
    cloud.login(user,password).then(result => {
        res.render('reboot');
    }).catch((error) => {
        res.render('redirect', {url: '/'});
    });
});
router.post("/register", (req,res) => {
    var username = req.body.username;
    var password = req.body.password;
    cloud.register(username, password).then(result => {
        res.render('redirect', {url : '/'});
    });
});
router.post("/codeconfirm", (req,res) => {
    var code = req.body.code;
    cloud.confirm(code).then(result => {
        res.render('redirect', {url : '/'});
    });
});
module.exports = router;