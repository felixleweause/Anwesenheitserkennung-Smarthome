var express = require('express');
var router = express.Router();
var connection  = require('../models/db.js');
var auth = require('../models/auth');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
var update =  require('../models/update');
var neural =  require('../models/neural');
const { fstat } = require('fs');
router.get("/", (req, res) => {
    res.render("settings", {version: process.env.VERSION});
});
router.get("/resetki", (req, res) => {
    neural.reset();
    res.render("redirect", {url: "/reboot"});
});
router.get("/resetuser", (req, res) => {
    update.userreset();
    res.render("redirect", {url: "/reboot"});
});
module.exports = router;