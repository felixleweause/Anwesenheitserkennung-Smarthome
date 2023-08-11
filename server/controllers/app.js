var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var update =  require('../models/update');
const fs = require('fs');
var session = require('express-session');
var mysql = require('mysql');
var connection  = require('../models/db');
var SocketService = require('../models/socket');
var personenRouter = require('../routes/personen');
var homeRouter = require('../routes/home');
var raeumeRouter = require('../routes/raeume');
var cloudRouter = require('../routes/cloud');
var updateRouter = require('../routes/update');
var settingsRouter = require('../routes/settings');
var config = require('../models/config');

var app = express();

// view engine setup
app.set('../views','../views'); 
app.set("view engine", "pug");
app.use('/public', express.static('public'));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || "3000";
const http = require('http').Server(app);
http.listen(port, () => {
   
    console.log(`Listening to requests on http://localhost:${port}`);
});
const io = require('socket.io')(http);

app.use((req, res, next)=>{ res.locals['socketio'] = io; next(); });
var auth = require('../models/auth');

app.use((req, res, next) => {
    console.log(req.originalUrl);
    
    if(req.originalUrl == '/login' || req.originalUrl =='/api/discoverhomebridge' ||  req.originalUrl =='/api'  || req.originalUrl == '/redirect' ||req.originalUrl == '/cloud/register'||req.originalUrl == '/cloud/login' ||req.originalUrl == '/cloud/codeconfirm'){
        console.log("next");
        next(); 
    }else if(req.originalUrl == '/cloud/login' && config.read('username') != ''){
        next();
    }
   
    else if(config.read('username') == ''){
        /*if(config.read('firstinstall') != 'true'){
            var user = {firstinstall: true};
            config.write('firstinstall', 'true');
            update.update();
            res.render("firstupdate")
        }else {*/
            res.render('cloudlogin')
        //}
    }else {
        if (req.cookies['AuthToken']) {
            next();
        } else {
            console.log("index");
            res.render('index');
        }
    }
});
app.use('/cloud', cloudRouter);
app.use('/personen', personenRouter);
app.use('/' , homeRouter);
app.use('/raeume', raeumeRouter);
app.use('/update' , updateRouter);
app.use('/settings' , settingsRouter);

module.exports = {app:app, io : io};