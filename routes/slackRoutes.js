var express = require('express');
var game = require("../controllers/gameController")
var router = express.Router();

router.get("/games");


module.exports = router;