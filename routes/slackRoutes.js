var express = require('express');
var games = require("../controllers/gameController")
var router = express.Router();

var authorizer = require("../controllers/authorizer");

router.post("/api/games", games.createGame);
router.get('/games', function (req, res) {
    res.send("hit");
});

router.get('/', function (req, res) {
    res.sendFile('slackIndex.html', { root: './public' });
});

router.get('/auth', function (req, res) {
    let code = req.query.code;
    console.log(code);
    authorizer.auth(code);
    res.send("authed");
});

router.post('/api/games/update', games.updateGameState);




module.exports = router;