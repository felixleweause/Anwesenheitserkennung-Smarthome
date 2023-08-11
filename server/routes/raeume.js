var express = require('express');
var router = express.Router();
var connection  = require('../models/db.js');
const fs = require('fs');
const cloud = require('../models/cloud');
const raum = require('../models/raum');
const homebridge_config_path = "/homebridge/config.json";

router.post("/add", (req,res) => {
    raum.add(req.body.raum_name,req.body.raum_id);
    res.render("reboot");
});

router.post('/change', (req,res) => {
    var esp_id = req.body.raum_id;
    var id = req.body.id;
    connection.connection.query("UPDATE rooms SET esp_id='" + esp_id+  "' WHERE id='" + id + "'", function(err, result) {
    });
    //updatedbvars();
    res.render("redirect", {url: "/reboot"});
})
router.get("/", (req,res) => {
    connection.connection.query("SELECT * from rooms" , function(error, results, fields){
        rooms = results;
        res.render("raeume", {title : "Räume", rooms :rooms , nutzer : connection.data.personen});
    });
});
router.get('/delete', (req, res) => {
    var id = req.query.id;
    raum.delete_room(id);
    res.render("redirect", {url: "/reboot"});
});
module.exports = router;