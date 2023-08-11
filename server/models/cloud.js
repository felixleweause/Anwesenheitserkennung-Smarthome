const https = require('https');
const fs = require('fs');
const path = require('path');
const { token } = require('morgan');
//var rawdata = fs.readFileSync(path.join('/home/pi/config/cloud.json'));
var connection = require('./db');
//var config = JSON.parse(rawdata);
var config = require('./config');

var Promise = require('promise');
var request = require('request');
var ip = require("ip");
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const { post } = require('request');
global.fetch = require('node-fetch');
var update = require('./update');
var username_confirm; 
const pool_region = 'eu-west-1';

var partymode = false; // Partymodus True or False 

var last_send = {}; // Um dafür zu sorgen das nur bei einer änderung gesendet wird
var last_state_room = {};
const  ValidateToken = (token) => {
    return new Promise((resolve, reject) => {
        console.log('Validating the token...')
        request({
            url: `https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_gnXtqNuve/.well-known/jwks.json`,
            json: true
        }, (error, response, body) => {
            console.log('validation token..')
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body['keys'];
                for(var i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                //validate the token
                var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    return;
                }

                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    return;
                }

                jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        console.log("Invalid Token.");
                    } else {
                        console.log("Valid Token.");
                        resolve(payload);
                    }
                });
            } else {
                console.log(error)
                console.log("Error! Unable to download JWKs");
            }
        });
    });
}
var cloud_change_value = function(person,raum, state,partymodus){
    if(!partymodus){
        if(last_send[person + raum] != state && !partymodus){
            postData = {"token" : config.read('cloudtoken') , "raum" : raum ,"person" : person ,"state" : String(state) , "user" :config.read('username')};
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
            request.post({
                url: "https://efkf4544y5.execute-api.eu-west-1.amazonaws.com/beta/new_state",
                json: postData
            }, function(error, response, body) {
                console.log(body);
            });
        }

        var room_there = false;
        connection.data.personen.forEach(person => {
            if(last_send[person['name'] + raum] == true){
                room_there = true;
            }
        });
        if(last_state_room[raum] != room_there && last_state_room[raum] != undefined){
            postData = {"token" : config.read('cloudtoken') , "raum" : raum ,"state" :  String(room_there) , "user" : config.read('username')};
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
            request.post({
                url: "https://efkf4544y5.execute-api.eu-west-1.amazonaws.com/beta/new_state_room",
                json: postData
            }, function(error, response, body) {
                console.log(body);
            });
        }
        last_state_room[raum] = room_there;
        last_send[person + raum] = state;
    }
}
var additem = function(rooms , personen){
    return new Promise((resolve,reject) => {
        postData = {token : config.read('cloudtoken'),rooms:rooms,personen: personen ,user:  config.read('username')};
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        request.post({
            url: "https://efkf4544y5.execute-api.eu-west-1.amazonaws.com/beta/add-item",
             json: postData
        }, function(error, response, body) {
            resolve("done");
        });
    });
}
var deleteitem = function(rooms , personen){
    return new Promise((resolve,reject) => {
        postData = {token : config.read('cloudtoken'),rooms:rooms,personen: personen ,user:config.read('username')};
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        request.post({
            url: "https://efkf4544y5.execute-api.eu-west-1.amazonaws.com/beta/delete-item",
             json: postData
        }, function(error, response, body) {
            resolve("done");
        });
    });
}
var login = function(username, password){
    return new Promise((resolve, reject) => {
        var personen = [];
        connection.data.personen.forEach(element => {
            personen.push(element.name);
        });
        var rooms = [];
        connection.data.rooms.forEach(element => {
            rooms.push(element.name);
        });
                var postData = {username: username, password: password , ip:ip.address()};
                console.log(postData);
                request.post({
                    url: "https://efkf4544y5.execute-api.eu-west-1.amazonaws.com/beta/gatewaytoken",
                     json: postData
                }, function(error, response, body) {
                    var body = JSON.parse(body.body);
                    if(body.succes){
                        console.log(body);
                        var cloud = {cloudtoken: body.token, username: username};
                        /*fs.writeFile(path.join('/home/pi/config/cloud.json'), JSON.stringify(cloud), err => { 
                            if (err) throw err;  
                            console.log("Done writing"); // Success 
                            var rawdata = fs.readFileSync(path.join('/home/pi/config/cloud.json'));
                            config = JSON.parse(rawdata);
                        }); */
                        config.write('cloudtoken', body.token);
                        config.write('username', username);
                        resolve("done");
                        update.reboot();
                    }else {
                        reject();
                    }
                });
                /*fs.writeFile(path.join('/home/pi/config/user.json'), JSON.stringify({username: username , password: password}), err => { 
                    if (err) throw err;  
                    console.log("Done writing"); // Success 
                    //resolve("done");
                });*/
                config.write('password', password);
    })
}
var logout = function(){
    var postData = "username=" + config.username +"&token=" + config.cloudtoken;
    var options = {
        hostname: 'bauer.myhome-server.de',
        href : "https://bauer.myhome-server.de:8083/logout",
        port : 8083,
        path : '/logout',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
            }
    };

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        /*fs.writeFile((path.join('/home/pi/config/cloud.json')), "{}", err => { 
            if (err) throw err;  
            console.log("Done writing"); // Success 
            var rawdata = fs.readFileSync(path.join('/home/pi/config/cloud.json'));
            console.log(rawdata);
            var config = JSON.parse(rawdata);
        }); */
    config.write('cloudtoken', '');
    config.write('username', '');
    config.write('password', '');

    var req = https.request(options, (res) => {
    });
    req.on('error', (e) => {
        
    });

    req.write(postData);
    req.end();
}
var register = function(username, password){
    return new Promise((resolve, reject) => {
        postData = {username: username, password: password};
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        request.post({
            url: "https://efkf4544y5.execute-api.eu-west-1.amazonaws.com/beta/register",
             json: postData
        }, function(error, response, body) {
            resolve();
            username_confirm = username;
        });
    });
}
var confirm = function(code){
    return new Promise((resolve, reject) => {
        postData = {username: username_confirm, code: code};
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        request.post({
            url: "https://efkf4544y5.execute-api.eu-west-1.amazonaws.com/beta/confirm-code",
             json: postData
        }, function(error, response, body) {
            resolve("done");
        });
    });
}
module.exports = {cloud_change_value: cloud_change_value, login : login,additem: additem , config: config, logout: logout, register: register, confirm: confirm, ValidateToken: ValidateToken,deleteitem:deleteitem, partymode : partymode};