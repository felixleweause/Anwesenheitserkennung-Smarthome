const fs = require('fs');

var connection  = require('../models/db.js');
var neural  = require('../models/neural.js');
var highlow  = require('../models/highlow.js');
var config = require('../models/config');
var last_room_person = {};
connection.connected.on('event', () => {
    connection.data.personen.forEach(person => {
        last_room_person[person['name']] = [];
    });
  });
function varianzausgleichon(room , person ){
    var to_return = true;
    var tmp_rooms = {};
    try {for(var i = 0;i < config.read('variant') * connection.data.rooms.length; i++){

        if(last_room_person[person][i] != room){
            to_return = false;
        }

        if(i +1 <= config.read('variant')  * connection.data.rooms.length){
            tmp_rooms[i +1 ] = last_room_person[person][i];
        } 
       
    }}catch{}
    tmp_rooms[0] = room;
    last_room_person[person] = tmp_rooms;
    return to_return;
}
function varianzausgleichoff(room , person ){
    var to_return = false;
    try{for(var i = 0;i < config.read('variant') * connection.data.rooms.length; i++){
        if(last_room_person[person][i] == room){
            to_return = true;
        }
    }} catch{};
    return to_return;
}

var train = function(){
    neural.train();
    highlow.train();

}
var run = function(data, data_tmp, person){
    var neuraldata = neural.run(data);
    var highestneural = highestroom(neuraldata, data_tmp, person);
    /*var highlowdata = highlow.run(data);
    //var highesthighlow = highestroom(highlowdata, data_tmp, person);
    var to_return = [];
    highestneural.forEach(element => {
        highesthighlow.forEach(element_ => {
            if(element.value == true && element_.value == true && element.esp_id == element_.esp_id){
                to_return.push({value: true, esp_id: element.esp_id, room: element.room});
            }else if(element.esp_id == element_.esp_id) {
                to_return.push({value: false, esp_id: element.esp_id, room: element.room});
            }
        });
    });
    return to_return;*/
    console.log(neuraldata);
    console.log(highestneural);
    return highestneural;
}
var storedatatmp = function(data){
    neural.storedatatmp(data);
    highlow.storedatatmp(data);
}
var highestroom = function(data, data_tmp, person){
    var to_return = [];
    if(data){  
        var highest = 0;
            Object.entries(data).forEach(([key, value]) => {
                if(value > highest){
                    highest = value;
                    highest_room = key;
                }
            });
            for (const [key, value] of Object.entries(data_tmp)) {
                    if(value.esp_id == highest_room && typeof value.raum !== 'undefined'){
                        if(varianzausgleichon(value.raum, person)){
                           to_return.push({room: value.raum,esp_id: value.esp_id,  value: true});
                        }
                    }else if(highest_room != value.esp_id  && typeof value.raum !== 'undefined') {
                        if(!varianzausgleichoff(value.raum, person)){
                            to_return.push({room: value.raum, esp_id: value.esp_id,value: false});
                        }
                    }
            };
    }
    return to_return;
}
var reset = function(){
    neural.reset();
    highlow.reset();
}
module.exports = {train: train, run: run, storedatatmp: storedatatmp, reset: reset};