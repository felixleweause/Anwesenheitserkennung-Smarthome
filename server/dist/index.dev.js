#!/usr/bin/env node
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var request = require('request');

var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://localhost');

var moment = require('moment');

var mysql = require('mysql');

var session = require('express-session');

var fs = require("fs");

var Promise = require('promise');

var path = require("path");

var pug = require('pug');

var _require = require('path'),
    resolve = _require.resolve;

var sha256 = require('sha256');

var util = require('util');

var _require2 = require('dns'),
    NONAME = _require2.NONAME;

var aedes = require('aedes')();

var options = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt')
};
var mac_addr_scanner = [];

var server = require('net').createServer(options, aedes.handle);

var port_mqtt = 1883;

var querystring = require('querystring');

var https = require('https');

var cloud = require('./models/cloud');

var neural = require('./models/neural');

var auth = require('./models/auth'); //database


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'SmartCoast',
  password: '123VORbei!',
  database: 'esp_ble'
});
var data_store = {};
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  updatedbvars().then(function (result) {
    personen.forEach(function (person) {
      rooms.forEach(function (raum) {
        data_store[person['name'] + raum['name']] = {
          raum: raum['name'],
          rssi: 0,
          last_change: 0,
          person: person['name'],
          esp_id: raum['esp_id'],
          aktiv: 1
        };
        console.log(data_store);
      });
    });
  });
  console.log('connected as id ' + connection.threadId);
});
server.listen(port_mqtt, function () {
  console.log('server started and listening on port ', port_mqtt);
});

aedes.authenticate = function (client, username, password, callback) {
  var raum_founded = false;

  try {
    rooms.forEach(function (raum) {
      if (raum['esp_id'] == username && password == sha256(raum['esp_id'])) {
        raum_founded = true;
      }
    });
  } catch (_unused) {
    raum_founded = true;
  }

  if (username == auth.config.username && password == auth.config.password) {
    raum_founded = true;
  }

  if (raum_founded) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

aedes.on('publish', function (packet, client) {
  if (client) {
    setTimeout(function () {
      rooms.forEach(function (element) {
        var topic_esp = element['esp_id'];
        console.log(topic_esp);

        if (packet.topic == "SmartCoast/Daten/" + topic_esp) {
          dataauswertung(packet.topic, packet.payload);
        } else if (packet.topic == "SmartCoast/Scan/" + topic_esp) {
          JSON.parse(packet.payload).forEach(function (devices) {
            console.log(devices);
            user_search.push({
              "mac": devices[0],
              "name": devices[1]
            });
          });
        } else {
          rooms.forEach(function (raum) {
            if (packet.topic == "mac_bt" + raum.esp_id) {
              new_mac(packet.payload.toString());
            }

            if (packet.topic == "status" + raum.esp_id) {
              setstatus(packet.payload.toString(), raum.esp_id);
            }

            if (packet.topic == "version" + raum.esp_id) {
              setversion(packet.payload.toString(), raum.name);
            }
          });
        }
      });
    }, 1500);
  }
});
aedes.on('subscribe', function (subscriptions, client) {
  updatedbvars().then(function (result) {
    subscriptions.forEach(function (element) {
      rooms.forEach(function (element_room) {
        console.log(element.topic);
        console.log("search" + element_room['esp_id']);

        if (element.topic == "search" + element_room['esp_id']) {
          send_mac_addr();
        }
      });
    });
  });
});
var homebridge_config_path = "/homebridge/config.json";
var personen;
var rooms;
var learningmode = false;
var learninguser;
var learningroom;
var learndata = {};
var learndatatmp = [];
var last_room_person = {};
var last_room_person_count_room = 0;
var last_room_person_count = {};
var user_search = [];

function getfingerprintdata(user, room) {
  learningmode = true;
  learninguser = user;
  learningroom = room;
  rooms.forEach(function (raum) {
    learndata[raum['esp_id']];
  });
}

function fingerprintingdatastore(topic, message) {
  var raum = topic.split("/")[2];
  var json_msg = JSON.parse(message.toString());
  console.log(json_msg);
  Object.entries(json_msg).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    if (key == learninguser) {
      var learndata___tmp = {};
      learndata[raum] = value;
      Object.entries(learndata).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            keyy = _ref4[0],
            valuee = _ref4[1];

        learndata___tmp[keyy] = valuee;
      });
      var room_for_learning = {};
      rooms.forEach(function (raum_) {
        if (raum_['esp_id'] == learningroom) {
          room_for_learning[raum_['esp_id']] = 1;
        } else {
          room_for_learning[raum_['esp_id']] = 0;
        }
      });
      var tmp = {};
      tmp = {
        input: learndata___tmp,
        output: room_for_learning
      };
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
  });
}

function stopfingerprinting() {
  console.log(learndatatmp); //neural.train(learndatatmp);

  neural.storedatatmp(learndatatmp);
  /*fingerprints.insert({ _id:  learningroom, room: learndata }).then((body) => {
      console.log(body)
  });*/

  learningmode = false;
  learndata = {};
  learndatatmp = [];
}

function new_mac(addr) {
  console.log(addr);
  var found = true;
  mac_addr_scanner.forEach(function (mac) {
    if (mac == addr) {
      found = false;
    }
  });

  if (found) {
    mac_addr_scanner.push(addr);
  }

  send_mac();
}

function send_mac() {
  mac_addr_scanner.forEach(function (mac) {
    client.publish("mac_addr", mac);
  });
}

function setstatus(status, raum) {
  connection.query("UPDATE rooms SET status='" + status + "' WHERE esp_id='" + raum + "'", function (err, result) {});
}

function setversion(version, raum) {
  connection.query("UPDATE rooms SET version='" + version + "' WHERE name='" + raum + "'", function (err, result) {});
}

function turnoff(raum, person) {
  client.publish('home/' + raum + '/' + person, 'false');
  console.log("false" + raum + person);

  if (cloud.config.cloudtoken) {
    cloud.cloud_change_value(person, raum, false);
  }

  app.io.emit('test', {
    "nutzer": person,
    "raum": raum
  }); //setvalues();
}

function turnon(raum, person) {
  client.publish('home/' + raum + '/' + person, 'true');
  console.log("true" + raum + person);

  if (cloud.config.cloudtoken) {
    cloud.cloud_change_value(person, raum, true);
  }

  connection.query("UPDATE personen SET state='" + raum + "' WHERE name='" + person + "'", function (err, result) {});
  app.io.emit('update', {
    "nutzer": person,
    "raum": raum
  });
}

function send_mac_addr() {
  console.log("test");
  rooms.forEach(function (raum) {
    var to_push = [];
    personen.forEach(function (person) {
      console.log(person['id']);
      to_push.push({
        id: person['id'],
        deviceid: person['deviceid']
      });
    });
    client.publish("search" + raum['esp_id'], JSON.stringify(to_push));
  });
}

var updatedbvars = function updatedbvars() {
  return new Promise(function (resolve, reject) {
    console.log("testest");
    connection.query("SELECT * from personen", function (error, results, fields) {
      personen = results;
      personen.forEach(function (person) {
        last_room_person_count[person['name']] = 0;
      });
    });
    connection.query("SELECT * from rooms", function (error, results, fields) {
      rooms = results;
      last_room_person_count_room = 0;
      rooms.forEach(function (raum) {
        last_room_person_count_room++;
      });
      resolve("works");
    });
  });
};

client.on('connect', function () {
  console.log("connected");
  updatedbvars().then(function (result) {
    send_mac_addr();
    send_mac();
  });
});
var person = "e";
var raum = "e";
var true_esp = false;

function dataauswertung(topic, message) {
  if (!learningmode) {
    console.log(topic);
    var json_msg = JSON.parse(message.toString());
    console.log(json_msg);
    Object.entries(json_msg).forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          key = _ref6[0],
          value = _ref6[1];

      var person = "";
      var raum = "";
      true_person = false;
      true_room = false;
      personen.forEach(function (element) {
        var result = key.search(element['id']);
        console.log(result);

        if (result > -1) {
          person = element['name'];
          true_person = true;
        }
      });
      rooms.forEach(function (element) {
        var result = topic.search(element['esp_id']);

        if (result > -1) {
          raum = element['name'];
          true_room = true;
        }
      });
      console.log(person + raum);

      if (true_person && true_room) {
        data_store[person + raum].rssi = value;
        data_store[person + raum].last_change = Date.now();
        var highest_room = ""; //connection.query("SELECT * FROM beacon_data WHERE person='"+ person +"'", function (error, results, fields) {

        var tmp = {};
        var data_tmp = {};

        for (var _i2 = 0, _Object$entries = Object.entries(data_store); _i2 < _Object$entries.length; _i2++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
              _key2 = _Object$entries$_i[0],
              _value2 = _Object$entries$_i[1];

          if (_value2.person == person) {
            data_tmp[_key2] = _value2;
          }
        }

        for (var _i3 = 0, _Object$entries2 = Object.entries(data_tmp); _i3 < _Object$entries2.length; _i3++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
              _key3 = _Object$entries2$_i[0],
              _value3 = _Object$entries2$_i[1];

          var time_db = _value3.last_change;
          var unsame = Date.now() - time_db;

          if (unsame < 7500) {
            tmp[_value3.esp_id] = parseFloat(_value3.rssi);
          }
        }

        console.log(tmp);
        var result = neural.run(tmp);

        if (result) {
          console.log(result);
          highest = 0;
          Object.entries(result).forEach(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2),
                key = _ref8[0],
                value = _ref8[1];

            if (value > highest) {
              highest = value;
              highest_room = key;
            }
          });

          if (last_room_person_count[person] == last_room_person_count_room) {
            last_room_person_count[person] = 0;

            for (var _i4 = 0, _Object$entries3 = Object.entries(data_tmp); _i4 < _Object$entries3.length; _i4++) {
              var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i4], 2),
                  _key = _Object$entries3$_i[0],
                  _value = _Object$entries3$_i[1];

              if (_value.esp_id == highest_room && highest_room == last_room_person[person]) {
                //&& highest_room == highest_room_normal&& (highest / last_room_person_count_room) > 0.5
                turnon(_value.raum, person); //io.emit('update', {"nutzer": person, "raum": element['raum']});
              } else if (highest_room != _value.esp_id && _value.esp_id != last_room_person[person]) {
                //|| highest_room_normal != element['raum']
                turnoff(_value.raum, person);
              }
            }

            ;
            last_room_person[person] = highest_room;
          }

          last_room_person_count[person] += 1;
        } //});

      }
    });
  } else {
    fingerprintingdatastore(topic, message);
  }
} // damit nach 10 sekunden kein neuer status vom raum kommt er ausgeschaltet werden kann  VEBERSERUNG 


setInterval(function () {
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
  personen.forEach(function (person) {
    var data_tmp_intervall = {};

    for (var _i5 = 0, _Object$entries4 = Object.entries(data_store); _i5 < _Object$entries4.length; _i5++) {
      var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i5], 2),
          key = _Object$entries4$_i[0],
          value = _Object$entries4$_i[1];

      if (value.person == person['name']) {
        data_tmp_intervall[key] = value;
      }
    }

    var person_home = false;

    for (var _i6 = 0, _Object$entries5 = Object.entries(data_tmp_intervall); _i6 < _Object$entries5.length; _i6++) {
      var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i6], 2),
          _key4 = _Object$entries5$_i[0],
          _value4 = _Object$entries5$_i[1];

      var time_db = _value4.last_change;
      var unsame = Date.now() - time_db;

      if (unsame > 30000) {
        turnoff(_value4.raum, person['name']);
      } else {
        person_home = true;
      }
    }

    if (!person_home) {
      last_room_person[person] = "0";
      connection.query("UPDATE personen SET state='" + 0 + "' WHERE name='" + person['name'] + "'", function (err, result) {});
    }
  });
}, 30000);

var app = require('./controllers/app.js');

var _require3 = require('request'),
    post = _require3.post;

var _require4 = require('./models/db'),
    data = _require4.data;

var _require5 = require('brain.js'),
    LeakyRelu = _require5.LeakyRelu;

var raum_model = require('./models/raum');

var person_model = require('./models/person');

var update = require('./models/update');

var _require6 = require('body-parser'),
    json = _require6.json;

var _require7 = require('./models/person'),
    add = _require7.add;

app.app.get("/train", function (req, res) {
  neural.train();
});
app.app.post("/updatescanner", function (req, res) {
  client.publish("update" + req.body.id, "http://betascanner.s3.amazonaws.com/update.sh");
  setstatus("update", req.body.id);
  res.render("redirect", {
    url: "/raeume"
  });
});
app.app.get("/updateallscanner", function (req, res) {
  rooms.forEach(function (raum) {
    client.publish("update" + raum.esp_id, "http://betascanner.s3.amazonaws.com/update.sh");
    setstatus("update", raum.esp_id);
  });
  res.render("redirect", {
    url: "/raeume"
  });
});
app.io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('learning', function (msg) {
    getfingerprintdata(msg.mac, msg.id);
  });
  socket.on('stoplearning', function (msg) {
    stopfingerprinting();
  });
  socket.on('user_scan', function (msg) {
    user_search = [];
    client.publish("scan_user", "scan");
    setTimeout(function () {
      app.io.emit("user_scan_result", JSON.stringify(user_search));
    }, 15000);
  });
});
app.app.post("/api/discoverhomebridge", function (req, res) {
  var devices = [];

  if (req.body.username == auth.config.username && req.body.password == auth.config.password) {
    personen.forEach(function (person) {
      rooms.forEach(function (raum) {
        devices.push(_defineProperty({}, raum['name'], person['name']));
      });
    });
  }

  res.json(devices);
});
app.app.post("/api/", function (req, res) {
  var token = req.body.token;
  console.log(token);

  if (req.body.query == "is_beta_device") {
    res.end(JSON.stringify({
      succes: true
    }));
  }

  cloud.ValidateToken(token).then(function (result) {
    if (result.email == auth.config.username) {
      switch (req.body.query) {
        case "app":
          res.end(JSON.stringify({
            succes: true
          }));
          break;

        case "basedata":
          res.end(JSON.stringify({
            personen: personen,
            rooms: rooms
          }));
          break;

        case "personsdata":
          connection.query("SELECT name,state,id FROM personen", function (err, results) {
            res.end(JSON.stringify({
              results: results
            }));
          });
          break;

        case "get_scanner":
          connection.query("SELECT * from rooms", function (err, results) {
            res.end(JSON.stringify({
              results: results
            }));
          });
          break;

        case "add_scanner":
          raum_model.add(req.body.name, req.body.id);
          res.end(JSON.stringify({
            succes: true
          }));
          break;

        case "add_person":
          person_model.add(req.body.name, req.body.deviceid);
          res.end(JSON.stringify({
            succes: true
          }));
          break;

        case "update_bridge":
          update.update();
          res.end(JSON.stringify({
            succes: true
          }));
          break;

        case "update_scanner":
          client.publish("update" + req.body.id, "http://betascanner.s3.amazonaws.com/update.sh");
          setstatus("update", req.body.id);
          res.end(JSON.stringify({
            succes: true
          }));
          break;

        case "update_all":
          client.publish("update" + req.body.id, "http://betascanner.s3.amazonaws.com/update.sh");
          setstatus("update", req.body.id);
          update.update();
          res.end(JSON.stringify({
            succes: true
          }));
          break;

        case "partymodeon":
          cloud.partymode = true;
          res.end(JSON.stringify({
            succes: true
          }));
          break;

        case "partymodeoff":
          cloud.partymode = false;
          res.end(JSON.stringify({
            succes: true
          }));
          break;

        default:
          res.end("No query argument was given");
      }
    }
  });
});