var express = require('express');
var games = require("../controllers/gameController")
var router = express.Router();

router.get("/games", games.createGame);


module.exports = router;