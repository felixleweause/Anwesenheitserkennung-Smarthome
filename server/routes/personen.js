var express = require('express');
var router = express.Router();
var connection  = require('../models/db.js');
const fs = require('fs');
const cloud = require('../models/cloud');
const personen_model  = require('../models/person');

const homebridge_config_path = "/homebridge/config.json";

router.post("/add", (req,res) => {
    var person_name = req.body.person_name;
    var mac_ble = req.body.deviceid;
    personen_model.add(person_name, mac_ble);
    res.render("reboot");
});
router.get("/", (req,res) => {
    res.render("nutzer", {title : "Nutzer", nutzer : connection.data.personen});
});
router.post('/change', (req,res) => {
    var deviceid = req.body.deviceid;
    var id = req.body.id;
    connection.connection.query("UPDATE personen SET deviceid='" + deviceid +  "' WHERE id='" + id + "'", function(err, result) {
    });
    //updatedbvars();
    res.render("redirect", {url: "/reboot"});
});
router.get('/delete', (req, res) => {
    var id = req.query.id;
    personen_model.delete_person(id);
    res.render("reboot");
});
module.exports = router;