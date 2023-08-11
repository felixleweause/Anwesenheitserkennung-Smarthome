var connection  = require('../models/db.js');
const fs = require('fs');
const cloud = require('../models/cloud');
var updater = require('../models/update');
var add = function(person_name, mac){
    connection.connection.query("INSERT INTO personen (name , deviceid ,state ) VALUES ('" + person_name + "' , '"  + mac + "', '0')", function(err, result) {
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
    personen.push(person_name);
    cloud.additem(rooms, personen).then(result => {
        updater.reboot();
    });
}
var delete_person = function(id){
    connection.connection.query("SELECT * FROM personen WHERE id='" + id +"'", function(err, result) {
        connection.connection.query("DELETE FROM personen WHERE id='" + id + "'", function(err, result) {
            connection.connection.query("SELECT * FROM personen", function(err, results) {
                var rooms = [];
                connection.data.rooms.forEach(raum => {
                    rooms.push(raum.name);
                });
                var personen = [];
                results.forEach(person => {
                    if(person.id != id){
                        personen.push(person.name);
                    }
                });
                cloud.additem(rooms, personen).then(result => {
                    updater.reboot();
                });
            });
        });
    })
}
module.exports = {add:add, delete_person:delete_person};