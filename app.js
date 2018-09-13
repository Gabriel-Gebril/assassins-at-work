var express = require('express');
var db = require('./helpers/db'),
    slackRoutes = require('./routes/slackRoutes'),
    bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// db.query(`CREATE TABLE game(
//     assassin VARCHAR(50),
//     target VARCHAR(50)
// )`, (err, res) => {
//         console.log(err, res)
//     });

// db.query(`INSERT INTO game(assassin,target) VALUES("gabe:,"gabe")`)
// .then

// async function q() {
//     const result = await db.query('SELECT * FROM game');
//     console.log(result.rows);
// }


app.get('/', function (req, res) {
    res.sendFile('test.html', { root: './public' });
});

app.use("/slack", slackRoutes)


app.listen(3000, console.log(3000));