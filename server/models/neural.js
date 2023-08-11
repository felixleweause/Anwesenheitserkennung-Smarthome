var brain = require('brain.js');
const fs = require('fs');
var net = new brain.NeuralNetwork();
var data_tmp_ = [];
var connection  = require('../models/db.js');

/*fs.readFile('/home/pi/config/neural.json', function(err, data) { 
    //t
    if(data.length != 0){    
        var neural = JSON.parse(data); 
        net.fromJSON(neural);
    }
});*/
connection.connection.query("SELECT * FROM neural WHERE titel='net'", function(err, result) {
    //data.config = result ; 
    if(result[0].value != null){    
        var string = JSON.stringify(result[0].value);
        var neural = JSON.parse(string); 
        //net.fromJSON(JSON.parse(neural));
        var rawdata = JSON.stringify(fs.readFileSync('model.json'));
        //var model_data = JSON.parse(rawdata); 
        net.fromJSON(rawdata);
        console.log("fromJSON");
    }
});



var train = function(){
    console.log(data_tmp_);
    net.train(data_tmp_, {iterations: 40000, log: true});
    var json = net.toJSON();
    /*fs.writeFile('/home/pi/config/neural.json',JSON.stringify(json),function(err){
        if(err) throw err;
    })*/
    connection.connection.query("Update neural SET value='" + JSON.stringify(json) + "' WHERE titel='net'", function(err, result) {
    });
}
var run = function(data){
    var output = net.run(data);
    return output;
}
var create_tmp_element = function(element, change ){
    var tmp_element = {input: {} , output: element.output};
    Object.entries(element.input).forEach(([keyy, valuee]) => {
        tmp_element[keyy] = valuee - change;
    });
    data_tmp_.push(tmp_element);

}
var storedatatmp = function(data){
    data.forEach(element => {
        data_tmp_.push(element);

        create_tmp_element(element, 0.01);
        create_tmp_element(element, -0.01);
        create_tmp_element(element, 0.02);
        create_tmp_element(element, -0.02);
        create_tmp_element(element, 0.03);
        create_tmp_element(element, -0.03);
        create_tmp_element(element, 0.04);
        create_tmp_element(element, -0.04);
        create_tmp_element(element, 0.05);
        create_tmp_element(element, -0.05);
        create_tmp_element(element, 0.06);
        create_tmp_element(element, -0.06);


    });
    console.log(data_tmp_);
}
var reset = function(){
    connection.connection.query("Update neural SET value='' WHERE titel='net'", function(err, result) {
    });
}
module.exports = {train: train, run: run, storedatatmp: storedatatmp, reset : reset};
