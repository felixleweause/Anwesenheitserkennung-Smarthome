const fs = require('fs');
const { data } = require('../models/db.js');
var data_tmp_ = [];
var connection  = require('../models/db.js');
var data_db = [];
/*fs.readFile('/home/pi/config/neural.json', function(err, data) { 
    //t
    if(data.length != 0){    
        var neural = JSON.parse(data); 
        net.fromJSON(neural);
    }
});*/
connection.connection.query("SELECT * FROM neural WHERE titel='highlow'", function(err, result) {
    //data.config = result ; 
    if(result[0].value != null){  
        data_db = result[0].value; 
    }
});

var train = function(){

    var tmp_data = [];
    connection.data.rooms.forEach(room => {
        connection.data.rooms.forEach(raum => {
            var high = 0;
            var low = 2;
            data_tmp_.forEach(value => {
                if(value.output[room['esp_id']] == 1){
                    if(value.input[raum['esp_id']] > high){
                        high = value.input[raum['esp_id']];
                    }
                    if(value.input[raum['esp_id']] < low){
                        low = value.input[raum['esp_id']];
                    }
                }
            });
            if(room.esp_id == raum.esp_id){
                low = 0; 
            }
            high += 0.03;
            low = low - 0.03;
            tmp_data.push({SearchRoom: room.esp_id, ScannerRoom: raum.esp_id, High: high, Low: low});
        });
    });
    connection.connection.query("Update neural SET value='" + JSON.stringify(tmp_data) + "' WHERE titel='highlow'", function(err, result) {
    });
}
var run = function(data){
   console.log(data);
    if(data.length != 0 && data_db.length != 0){
        var output = {};
        connection.data.rooms.forEach(room => {
            high_value = 0;
            connection.data.rooms.forEach(raum => {
                console.log(data_db);
                JSON.parse(data_db).forEach(value => {
                     console.log(value);
                    if(value.SearchRoom == room.esp_id && value.ScannerRoom == raum.esp_id){
                       
                        if(data[raum.esp_id] > value.Low && data[raum.esp_id] < value.High){
                            high_value += 1;
                        }
                    }
                });
            });
            output[room['esp_id']] = high_value;
        });    
        console.log(output);
        return output;
    }

}
var storedatatmp = function(data){
    data.forEach(element => {
        data_tmp_.push(element);
    });
    console.log("data_tmp_");
    console.log(data_tmp_);
}
var reset = function (){
    connection.connection.query("Update neural SET value='' WHERE titel='highlow'", function(err, result) {
    });
}
module.exports = {train: train, run: run, storedatatmp: storedatatmp, reset: reset};
