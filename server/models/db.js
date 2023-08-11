var mysql = require('mysql');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'SmartCoast',
    password : '123VORbei!',
    database : 'esp_ble'
});
var data = {"personen": [] , "rooms": [] , "scanner_micro": [] , "config": []};
var connected = new MyEmitter();
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
        connection.query("SELECT * FROM rooms", function(err,result){
            data.rooms = result;
            connection.query("SELECT * FROM personen", function(err,results){
                data.personen = results;
            });
            connection.query("SELECT * FROM scanner_micro", function(err,results){
                data.scanner_micro = results;
            });
            
            connection.query("SELECT * FROM config", function(err, result) {
                data.config = result ; 
            });
        });
		console.log('Connected..!');
        connected.emit(true);

	}
});
module.exports = {connection: connection, data: data, connected: connected};