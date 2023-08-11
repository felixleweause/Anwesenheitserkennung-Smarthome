var express = require('express');
var router = express.Router();
var connection  = require('../models/db.js');
var auth = require('../models/auth');
var update =  require('../models/update');
router.get("/", (req, res) => {
    update.update();
    res.render("updating");
});
module.exports = router;