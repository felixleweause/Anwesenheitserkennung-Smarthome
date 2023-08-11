const fs = require('fs');
const path = require('path');
var rawdata = fs.readFileSync(path.join(__dirname, '..', 'config', 'hue.json'));
var config = JSON.parse(rawdata);
const request = require('request');
const https = require('http')
const UpnpSearch = require('./UPnP');
var discoveriphue = function(){
    console.log("searching started")
    const search = new UpnpSearch();
    return new Promise((resolve, reject) => {
        search.search(10000).then(result => {
            console.log(result);
            resolve(result);
        });
    });
}
var getauth = function(ip){
    return new Promise((resolve, reject) => {
        var rawdata = fs.readFileSync(path.join(__dirname, '..', 'config', 'hue.json'));
        var config = JSON.parse(rawdata);
        request.post({
            url: 'http://' + ip + '/api',
            body: "{\"devicetype\":\"betabridgehue\"}"
        }, function(error, response, body){
            console.log(body);
            body = JSON.parse(body);
            if(body[0].success.username){
                config.username = body[0].success.username;
                config.ip = ip;
                config.rules = [];
                fs.writeFile(path.join(__dirname, '..', 'config', 'hue.json'), JSON.stringify(config), err => { 
                    if (err) throw err;  
                    console.log("Done writing"); // Success 
                    var rawdata = fs.readFileSync(path.join(__dirname, '..', 'config', 'hue.json'));
                    var config = JSON.parse(rawdata);
                    resolve(config);
                });
            }
        });
    });
}
var getscene = function(){
    return new Promise((resolve, reject) => {
        var rawdata = fs.readFileSync(path.join(__dirname, '..', 'config', 'hue.json'));
        var config = JSON.parse(rawdata);
        request.get({
            url: 'http://' + config.ip + '/api/' + config.username + '/scenes'
        }, function(error, response, body){
            console.log(body);
            body = JSON.parse(body);
            config.scenes = [];
            Object.entries(body).forEach(([key, value]) => {
                console.log(key);
                console.log(value);
                var temp_elem = {id: key, name: value.name, group: value.group};
                config.scenes.push(temp_elem);
            });
            console.log(config);
            fs.writeFile(path.join(__dirname, '..', 'config', 'hue.json'), JSON.stringify(config), err => { 
                if (err) throw err;  
                console.log("Done writing"); // Success 
                var rawdata = fs.readFileSync(path.join(__dirname, '..', 'config', 'hue.json'));
                var config = JSON.parse(rawdata);
                resolve(config);
            });
        });
    });
}
var getgroups = function(){
    return new Promise((resolve, reject) => {
        var rawdata = fs.readFileSync(path.join(__dirname, '..', 'config', 'hue.json'));
        var config = JSON.parse(rawdata);
        request.get({
            url: 'http://' + config.ip + '/api/' + config.username + '/groups'
        }, function(error, response, body){
            console.log(body);
            body = JSON.parse(body);
            config.groups = [];
            Object.entries(body).forEach(([key, value]) => {
                console.log(key);
                console.log(value);
                if(value.type == 'Room'){
                    var temp_elem = {id: key, name: value.name};
                    config.groups.push(temp_elem);
                }
            });
            console.log(config);
            fs.writeFile(path.join(__dirname, '..', 'config', 'hue.json'), JSON.stringify(config), err => { 
                if (err) throw err;  
                console.log("Done writing"); // Success 
                var rawdata = fs.readFileSync(path.join(__dirname, '..', 'config', 'hue.json'));
                var config = JSON.parse(rawdata);
                resolve(config);
            });
            
        });
    });
}
var addrule = function(raum,person,action,group,scene){
    var rawdata = fs.readFileSync(path.join(__dirname, '..', 'config', 'hue.json'));
    var config = JSON.parse(rawdata);
    var rule = {raum: raum, person: person, action:action, group:group, scene: scene};
    config.rules.push(rule);
    fs.writeFile(path.join(__dirname, '..', 'config', 'hue.json'), JSON.stringify(config), err => { 
        if (err) throw err;  
        console.log("Done writing"); // Success 
        var rawdata = fs.readFileSync(path.join(__dirname, '..', 'config', 'hue.json'));
        var config = JSON.parse(rawdata);
    });
}
var turnon = function(person, raum){
    if(config.username){

        console.log("on" + person + raum);
        config.rules.forEach(rule => {
            if(rule.person == person && rule.raum == raum && rule.scene != "false"){
                const data = JSON.stringify({
                    scene: rule.scene
                })

                const options = {
                hostname: config.ip,
                port: 80,
                path: '/api/' + config.username + '/groups/' + rule.group + '/action',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
                }

                const req = https.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)

                res.on('data', d => {
                    process.stdout.write(d)
                })
                })

                req.on('error', error => {
                console.error(error)
                })

                req.write(data);
                req.end();
            }
        });
    }
}
var turnoff = function(person , raum){
    if(config.username){
        console.log("off" + person + raum);
        config.rules.forEach(rule => {
            if(rule.person == person && rule.raum == raum && rule.scene == "false"){
            const data = JSON.stringify({
                on: false
            })

            const options = {
            hostname: config.ip,
            port: 80,
            path: '/api/' + config.username + '/groups/' + rule.group + '/action',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
            }

            const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
            })

            req.on('error', error => {
            console.error(error)
            })

            req.write(data);
            req.end();
            }    
        });
    }
}
module.exports = {getauth: getauth, getscene: getscene,addrule:addrule,turnon:turnon,turnoff:turnoff,getgroups:getgroups,discoveriphue:discoveriphue, config:config};
//getscene();
discoveriphue();