const { exec } = require('child_process');
var wget = require('node-wget');
var config = require('./config');

var update = function(){
    exec('sudo rm /home/pi/update.sh',(error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
        wget({
            url:  'http://betabridge.s3.amazonaws.com/update.sh',
            dest: '/home/pi/update.sh',      // destination path or path with filenname, default is ./
            timeout: 2000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
        },
        function (error, response, body) {   // data: { headers:{...}, filepath:'...' }
                console.log(error); // '/tmp/package.json'
                exec('sudo chmod 777 /home/pi/update.sh && sudo service updater start',(error, stdout, stderr) => {
                    console.log(stdout);
                    console.log(stderr);
                    if (error !== null) {
                        console.log(`exec error: ${error}`);
                    }
                });
            }
        );
    });
}
var reboot = function(){
    setTimeout(function () {
    	exec('sudo service beta restart',(error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    }, 1000);
}
var rebuild = function(){
    exec('touch /home/pi/rebuild',(error, stdout, stderr) => {
    });
}
var userreset = function (){
    config.write('username', '');
    config.write('password', '');
}
module.exports = {update:update, reboot: reboot, rebuild: rebuild, userreset: userreset};