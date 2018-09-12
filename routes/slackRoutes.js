var express = require('express');
var games = require("../controllers/gameController")
var router = express.Router();

router.post("/games", games.createGame);
router.post('games', function (req, res) {
    res.send("hit");
});


module.exports = router;