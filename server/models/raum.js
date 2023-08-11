var connection  = require('../models/db.js');
const fs = require('fs');
const cloud = require('../models/cloud');
var updater = require('../models/update');
var add = function(raum_name, esp_id){

    connection.connection.query("INSERT INTO rooms (name , esp_id, version) VALUES ('" + raum_name + "' , '"  + esp_id + "', '0')", function(err, result) {
        if (err) throw err;
    });
    //updatedbvars();
    var rooms = [];
    connection.data.rooms.forEach(raum => {
        rooms.push(raum.name);
    });
    var personen = [];
    connection.data.personen.forEach(person => {
        personen.push(person.name);
    });
    rooms.push(raum_name);
    cloud.additem(rooms, personen).then(result => {
        updater.reboot();
        console.log("succes");
    });
}
var delete_room = function(id){
    connection.connection.query("DELETE FROM rooms WHERE esp_id='" + id + "'", function(err, result) {
        console.log(err);
        connection.connection.query("SELECT * FROM rooms", function(err, results) {
            var rooms = [];
            results.forEach(raum => {
                if(raum.esp_id != id){
                    rooms.push(raum.name);
                }
            });
            var personen = [];
            connection.data.personen.forEach(person => {
                personen.push(person.name);
            });
            cloud.additem(rooms, personen).then(result => {
                updater.reboot();
            });
        })
            
    });
}
module.exports = {add:add, delete_room:delete_room};