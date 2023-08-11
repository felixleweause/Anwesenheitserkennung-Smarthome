#!/usr/bin/env node
const request = require('request');
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost')
var moment = require('moment');
var mysql      = require('mysql');
var session = require('express-session');
const fs = require("fs"); 
var Promise = require('promise');
var KalmanFilter = require('kalmanjs');
const path = require("path");
var pug = require('pug');
const { resolve } = require('path');
var sha256 = require('sha256');
const util = require('util');
const { NONAME } = require('dns');
const raum_model = require('./models/raum');
const person_model = require('./models/person');
const aedes = require('aedes')()
const options = {
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.crt')
  }
var mac_addr_scanner = [];
const server = require('net').createServer(options, aedes.handle)
const port_mqtt = 1883;
var client  = mqtt.connect('mqtt://localhost');
client.on('connect', function () {
    client.subscribe("$SYS/"+ aedes.id + "/new/unsubscribes", function (err) {})
})
  
client.on('message', function (topic, message) {
    if(topic == "$SYS/"+ aedes.id + "/new/unsubscribes"){
        console.log(topic);
        var json_msg = JSON.parse(message.toString());
        console.log(json_msg);
        rooms.forEach(element => {
            if(element['esp_id'] == json_msg.clientId){
                setstatus("offline" , element['esp_id']);
            }
        });
    }
})
const querystring = require('querystring');
const https = require('https');
const cloud = require('./models/cloud');
var update =  require('./models/update');
var config = require('./models/config');

let neural;
//try {
neural = require('./models/positioning.js');
/*}catch {
    update.rebuild();
    update.update();
}*/
var auth = require('./models/auth');
//database
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'SmartCoast',
    password : '123VORbei!',
    database : 'esp_ble'
});
var data_store = {};
var scanner_state = [];
var person_found_device = [];
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    updatedbvars()
        .then(function(result){
            personen.forEach(person => {
                data_personen_getet[person['name']] = 0;
                person_found_device[person['id']] = {mac: "", deviceid: person['deviceid'], id: person['id']};
                rooms.forEach(raum => {
                    data_store[person['name'] + raum['name']] = {raum: raum['name'], rssi: 0, last_change: 0, person: person['name'], esp_id: raum['esp_id'], aktiv: 1, filter: new KalmanFilter() };
                    console.log(data_store);
                });
                scanner_micro.forEach(scanner => {
                    data_store[person['name'] + scanner['esp_id']] = {rssi: 0, last_change: 0, person: person['name'], esp_id: scanner['esp_id'], aktiv: 1};
                });
            });
        });
    console.log('connected as id ' + connection.threadId);
});
server.listen(port_mqtt, function () {
    console.log('server started and listening on port ', port_mqtt)
})
aedes.authenticate = function(client, username, password, callback) {
      var raum_founded = false;
      try {rooms.forEach(raum => {
          if(raum['esp_id'] == username && password == sha256(raum['esp_id'])){
            raum_founded = true;
            if(raum['version'] == 0){
                setTimeout( function(){
                    updatescanner(raum['esp_id']);
                }, 2500);
                
            }else{
                setstatus("ready", raum['esp_id']);
            }
          }
      })}catch {
          raum_founded = true;
      }
      if(username == config.read('username') && password == config.read('password')){
          raum_founded = true;
      }
      if(raum_founded){
        callback(null, true);
      }else {
        callback(null, false);
      }
};
aedes.on('publish', function (packet, client) {
      if (client) {
          setTimeout(() => {
            scanner_micro.forEach(scanner => {
                if(packet.topic == "Scanner/Daten/" + scanner['esp_id']){
                    microdataauswertung(packet.topic, packet.payload);
                }
            });
            rooms.forEach(element => {
                var topic_esp = element['esp_id'];
                if(packet.topic == "espresense/rooms/"  + topic_esp){
                    dataauswertung(packet.topic, packet.payload);

                }else if (packet.topic == "Scanner/Scan/" + topic_esp){
                  JSON.parse(packet.payload).forEach(devices => {
                      console.log(devices);
                      user_search.push({"mac": devices[0], "name": devices[1]});
                  });
                }
                else {
                    rooms.forEach(raum => {
                      if(packet.topic == "mac_bt" + raum.esp_id){
                          new_mac(packet.payload.toString());
                      }
                      if(packet.topic == "version" + raum.esp_id){
                          setversion(packet.payload.toString(), raum.name);
                      }
                    });
                }
              });
            if(packet.topic == "found_device"){
                var found_device = JSON.parse(packet.payload);
                person_found_device[found_device.id].mac = found_device.mac;
            }
          }, 1500);
      }
});
aedes.on('subscribe', function (subscriptions, client) {
    updatedbvars()
    .then(function(result){
          /*subscriptions.forEach(element => {
                  rooms.forEach(element_room => {
                      console.log(element.topic);
                      console.log( "search" + element_room['esp_id']);
                      if(element.topic == "search" + element_room['esp_id']){*/
                          send_mac_addr();
                      /*}

                  });
              })
            */})
});

var personen;
var rooms;
var scanner_micro;
var learningmode = false;
var learninguser;
var learningroom;
var learndata = {};
var learndata_filter = {};

var learndatatmp = [];
var last_room_person_count_room = 0;
var last_room_person_count = {};
var user_search = [];
var tmp_scanner = [];
var data_personen_getet = {};
function getfingerprintdata(user, room){
    learningmode = true;
    learninguser = user;
    learningroom = room;
    rooms.forEach(raum => {
        learndata[raum['esp_id']];
    });
}
function fingerprintingdatastore(topic, message){
    var raum = topic.split("/")[2];
    //var json_msg = JSON.parse(message.toString());
    var json_msg = message;
    console.log(json_msg);
    Object.entries(json_msg).forEach(([key, value]) => {
        if(key == learninguser){
            console.log("lernt start")
            var learndata___tmp = {};
            learndata[raum] = value;
            Object.entries(learndata).forEach(([keyy, valuee]) => {
                learndata___tmp[keyy] = valuee;
            });
            var room_for_learning = {};
            rooms.forEach(raum_ => {
                if(raum_['esp_id'] == learningroom){
                    room_for_learning[raum_['esp_id']] = 1;
                }else {
                    room_for_learning[raum_['esp_id']] = 0;
                }
            });
            var tmp = {};
            tmp = {input: learndata___tmp, output: room_for_learning};
            learndatatmp.push(tmp);


            // For sliced data
            var learndata___tmp_filter = {};
            learndata_filter[raum] = value;
            Object.entries(learndata_filter).forEach(([keyy, valuee]) => {
                learndata___tmp_filter[keyy] = valuee;
            });
            var tmp = {};
            tmp = {input: learndata___tmp_filter, output: room_for_learning};
            learndatatmp.push(tmp);

            /*rooms.forEach(raum => {
                var tmp = {};
                var learndata___tmp = {};
                Object.entries(learndata).forEach(([keyy, valuee]) => {
                    if(keyy != raum.esp_id){
                        learndata___tmp[keyy] = valuee;
                    }
                });
                tmp = {input: learndata___tmp, output: room_for_learning};
                learndatatmp.push(tmp);
            });*/
            console.log(learndatatmp);
        }
    })
}
function stopfingerprinting(){
    console.log(learndatatmp);

    //neural.train(learndatatmp);
    neural.storedatatmp(learndatatmp);
    /*fingerprints.insert({ _id:  learningroom, room: learndata }).then((body) => {
        console.log(body)
    });*/
    learningmode = false;
    learndata = {};
    learndatatmp = [];
}

function new_mac(addr){
    console.log(addr);
    var found = true;
    mac_addr_scanner.forEach(mac => {
        if(mac == addr){
            found = false;
        }
    });
    if(found){
        mac_addr_scanner.push(addr);
    }
    send_mac();
}
function send_mac(){
    mac_addr_scanner.forEach(mac => {
        client.publish("mac_addr", mac)
    });
}
function setstatus(status , raum){
    connection.query("UPDATE rooms SET status='" + status+  "' WHERE esp_id='" + raum + "'", function(err, result) {
    });
}
function setversion(version , raum){
    connection.query("UPDATE rooms SET version='" + version+  "' WHERE name='" + raum + "'", function(err, result) {
    });
}
function turnoff(raum, person){
    client.publish('home/' + raum + '/' + person, 'false');
    console.log("false" + raum + person);
    if(config.read('cloudtoken')){
        cloud.cloud_change_value(person,raum, false, cloud.partymode);
    }
    app.io.emit('test', {"nutzer": person, "raum": raum});
    //setvalues();
}
function turnon(raum, person){
    client.publish('home/' + raum + '/' + person, 'true');
    console.log("true" + raum + person);
    if(config.read('cloudtoken')){
        cloud.cloud_change_value(person,raum, true, cloud.partymode);
    }
    connection.query("UPDATE personen SET state='" + raum +  "' WHERE name='" + person + "'", function(err, result) {
    });
    app.io.emit('update', {"nutzer": person, "raum": raum});
}
function send_mac_addr(){
    /*console.log("test");
    rooms.forEach(raum => {
        var to_push = [];
        personen.forEach(person => {
            console.log(person['id']);
            to_push.push({id: person['id'], deviceid: person['deviceid']});
        })
       // client.publish("search" + raum['esp_id'] , JSON.stringify(to_push));
    });
    personen.forEach(person => {
        if(person_found_device[person['id']].mac != ""){
            client.publish("found_device", JSON.stringify(person_found_device[person['id']]));
        }
    });*/
    personen.forEach(person => {
        client.publish("espresense/settings/irk:" + person['deviceid'] + "/config", JSON.stringify({id: person['name']}));
    });
}

const updatedbvars = () => {
    return  new Promise(function(resolve, reject) {
        console.log("testest");
        connection.query("SELECT * FROM scanner_micro", function(err,results){
            scanner_micro = results;
        });
        connection.query("SELECT * from personen" , function(error, results, fields){
            personen = results;
            personen.forEach(person => {

                last_room_person_count[person['name']] = 0;
            });


        });
        connection.query("SELECT * from rooms" , function(error, results, fields){
            rooms = results;
            last_room_person_count_room = 0;
            rooms.forEach(raum => {
                last_room_person_count_room++;
            })
            resolve("works");
        });
    });
}
client.on('connect', () => {
    console.log("connected");
    updatedbvars()
        .then(function(result){
            send_mac_addr();
            send_mac();
    });
})


var person = "e";
var raum = "e";
var true_esp = false;
function microdataauswertung(topic,message){

    if(!learningmode){

        var json_msg = JSON.parse(message.toString());
        Object.entries(json_msg).forEach(([key, value]) => {
            var person = "";
            var scanner = "";
            true_person = false;
            true_room = false;
            personen.forEach(element => {
                let result = key.search(element['id']);
                console.log(result);
                if(result > -1){
                    person = element['name'];
                    true_person = true;
                }
            });
            scanner_micro.forEach(element => {
                let result = topic.search(element['esp_id']);
                if(result > -1){
                    raum = element['esp_id'];
                    true_room = true;
                }
            });
            if(true_person && true_room){
                data_store[person + raum].rssi = value;
                data_store[person + raum].last_change = Date.now();
            }
        });
    }else {
        fingerprintingdatastore(topic, message);
    }
}
function dataauswertung(topic, message) {
    message = JSON.parse(message.toString());
    var json_msg = {};
    console.log(message.rssi);
    json_msg[message.id] = message.rssi / 100;
    console.log(json_msg);
    if(!learningmode){

        Object.entries(json_msg).forEach(([key, value]) => {
            var person = "";
            var raum = "";
            true_person = false;
            true_room = false;
            personen.forEach(element => {
                let result = key.search(element['name']);
                console.log(result);
                if(result > -1){
                    person = element['name'];
                    true_person = true;
                }
            });
            rooms.forEach(element => {
                let result = topic.search(element['esp_id']);
                if(result > -1){
                    raum = element['name'];
                    true_room = true;
                }
            });
            console.log(person + raum);
            if(true_person && true_room){
                data_store[person + raum].rssi = data_store[person + raum].filter.filter(parseFloat(value)).toFixed(2);
                data_store[person + raum].last_change = Date.now();
                data_personen_getet[person] = Date.now();
                var highest_room = "";
                    //connection.query("SELECT * FROM beacon_data WHERE person='"+ person +"'", function (error, results, fields) {
                        var tmp = {};
                        var data_tmp = {};
                        for (const [key, value] of Object.entries(data_store)) {
                            if(value.person == person){
                                data_tmp[key] = value;
                            }
                        }
                        for (const [key, value] of Object.entries(data_tmp)) {
                            var time_db = value.last_change;
                            var unsame = Date.now() - time_db;
                            if(unsame < 7500){
                                tmp[value.esp_id] = parseFloat(value.rssi);
                            }
                        }
                        console.log(tmp);
                        var result = neural.run(tmp, data_tmp, person);
                        result.forEach(element => {
                            if(element.value == true){
                                turnon(element.room, person);
                            }else {
                                turnoff(element.room, person);

                            }
                        });
                    //});
            }
        })
    }else {
        fingerprintingdatastore(topic, json_msg);
    }
}

    // damit nach 10 sekunden kein neuer status vom raum kommt er ausgeschaltet werden kann  VEBERSERUNG 
setInterval(() => {
    /*rooms.forEach(element => {
        room = false;
        personen.forEach(elem => {
            console.log(elem['name']+ element['name'])
            var data_tmp_intervall = {};
            for (const [key, value] of Object.entries(data_store)) {
                if(value.person == elem['name'] && value.raum == element['name']){
                    data_tmp_intervall[key] = value;
                }
            }
            for (const [key, value] of Object.entries(data_tmp_intervall)) {
                var time_db = value.last_change;
                var unsame = Date.now() - time_db;
                if(unsame > 30000){
                    last_room_person[person] = "0";
                    connection.query("UPDATE personen SET state='" + 0 +  "' WHERE name='" + elem['name'] + "'", function(err, result) {
                    });
                    turnoff(element['name'], elem['name']);
                }
            }
        })
    })*/
    personen.forEach(person => {
        var data_tmp_intervall = {};
        for (const [key, value] of Object.entries(data_store)) {
            if(value.person == person['name'] && typeof value.raum !== 'undefined'){
                data_tmp_intervall[key] = value;
            }
        }
        var person_home = false;
        for (const [key, value] of Object.entries(data_tmp_intervall)) {
            var time_db = value.last_change;
            var unsame = Date.now() - time_db;
            if(unsame > 60000){
                turnoff(value.raum, person['name']);
            }else {
                person_home = true;
            }
        }
        if(!person_home){
            //last_room_person[person] = "0";
            connection.query("UPDATE personen SET state='" + 0 +  "' WHERE name='" + person['name'] + "'", function(err, result) {
            });
        }
        if(person_found_device[person['id']].mac != ""){
            client.publish("found_device", JSON.stringify(person_found_device[person['id']]));
        }
    });
}, 30000);
function updatescanner(id){
    client.publish("update" + id, "http://betascanner.s3.amazonaws.com/update.sh");
    setstatus("update", id);
}
var app = require('./controllers/app.js');
const { post } = require('request');
const { data } = require('./models/db');
const { json } = require('body-parser');
const { add } = require('./models/person');
const { count } = require('console');
//const { cloud } = require('./models/cloud');

app.app.get("/train" , (req, res) => {
    neural.train();
})
app.app.post("/updatescanner", (req, res) => {
    updatescanner(req.body.id);
    res.render("redirect", {url: "/raeume"});
});
app.app.get("/updateallscanner", (req, res) => {
    rooms.forEach(raum => {
        client.publish("update" + raum.esp_id, "http://betascanner.s3.amazonaws.com/update.sh");
        setstatus("update", raum.esp_id);
    })
    res.render("redirect", {url: "/raeume"});
});
app.io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('learning', (msg) => {
        getfingerprintdata(msg.mac, msg.id);
    })
    socket.on('stoplearning' ,(msg) => {
        stopfingerprinting();
    });
    socket.on('user_scan', (msg) => {
        user_search = [];
        client.publish("scan_user", "scan");
        setTimeout(function(){app.io.emit("user_scan_result", JSON.stringify(user_search))}, 15000);

    });
});
app.app.post("/api/discoverhomebridge", (req, res) => {
    var devices = [];
    if(req.body.username == config.read('username') && req.body.password == config.read('password')){
        personen.forEach(person => {
            rooms.forEach(raum => {
                devices.push({[raum['name']]: person['name']});
            });
        });
    }
    res.json(devices);
});
app.app.post("/api/", (req, res) => {
    var token = req.body.token;
    if(req.body.query == "is_beta_device"){
        res.end(JSON.stringify({succes: true}));
    }
    cloud.ValidateToken(token).then(result => {
        if(result.email == config.read('username' )){
            switch(req.body.query){
                case "app":
                    res.end(JSON.stringify({succes: true}));
                    break;
                case "basedata":
                    res.end(JSON.stringify({personen: personen, rooms: rooms}));
                    break;
                case "personsdata":
                    connection.query("SELECT name,state,id,deviceid FROM personen", function(err,results){
                        res.end(JSON.stringify({results})); 
                    });
                    break;
                case "get_scanner":
                    connection.query("SELECT * from rooms", function(err,results) {
                        res.end(JSON.stringify({results})); 
                    });
                    break;
                case "add_scanner":
                    raum_model.add(req.body.name , req.body.id);
                    res.end(JSON.stringify({succes: true}));
                    break;
                case "add_person":
                    person_model.add(req.body.name , req.body.deviceid);
                    res.end(JSON.stringify({succes: true}));
                    break;
                case "person_delete":
                    connection.query("DELETE FROM personen WHERE deviceid='"  + req.body.deviceid + "'", function(err,results){
                    });
                    update.reboot();
                    break;
                case "update_bridge":
                    update.update();
                    res.end(JSON.stringify({succes: true}));
                    break;
                case "update_scanner": 
                    updatescanner(req.body.id);
                    res.end(JSON.stringify({succes: true}));
                    break;
                case "update_all":
                    rooms.forEach(raum => {
                        updatescanner(raum['esp_id']);
                    })
                    update.update();
                    res.end(JSON.stringify({succes: true}));
                    break;
                case "partymodeon":
                    cloud.partymode = true;
                    res.end(JSON.stringify({succes: true}));
                    break;
                case "partymodeoff":
                    cloud.partymode = false;
                    res.end(JSON.stringify({succes: true}));
                    break;
                case "partymodestate":
                    res.end(JSON.stringify({status: cloud.partymode}));
                    break;
                case "learning":
                    connection.query("SELECT * from personen WHERE name='" + req.body.person + "'", function(error, results, fields){
                        getfingerprintdata(results[0]['id'],req.body.room);
                    });
                    res.end();
                    break;
                case "stoplearning":
                    stopfingerprinting();
                    break;
                case "train":
                    neural.train();
                    break;
                case "tmp_scanner":
                    var id = req.body.id;
                    var name = req.body.name;
                    raum_model.add(req.body.name , req.body.id);
                    break;
                case "reset_train":
                    neural.reset();
                    update.reboot();
                    break;
                case "train_check_person":
                    res.end(JSON.stringify({data: data_personen_getet}));
                    break;
                case "variantget":
                    res.end(JSON.stringify({data: config.read('variant')}));
                    break;
                case "variantset":
                    var variant = req.body.variant;
                    config.write("variant", variant);
                    res.end(JSON.stringify({succes: true}));
                    update.reboot();
                    break;
                default:
                    res.end("No query argument was given");
            }
        }
    });
});
