var connection  = require('../models/db.js');
var write = function (titel , value ){
    connection.connection.query("UPDATE config SET value='" + value +  "' WHERE titel='" + titel + "'", function(err, result) {
    });
}
var read =  function (titel){
    var to_return;
    connection.data.config.forEach(value => {
        var string = JSON.stringify(value);
        var json = JSON.parse(string);
        if(json.titel == titel){
            console.log(json.value);
            
            to_return =  json.value;
        }
    });
    return to_return;
}

module.exports = {read: read , write: write};