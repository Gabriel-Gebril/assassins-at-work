var express = require('express');
var fs = require('fs');
var https = require('https');

var app = express();

app.get('/', function (req, res) {
    res.sendFile('test.html', { root: './public' });
});

https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/gabrielg.me/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/gabrielg.me/fullchain.pem')
}, app).listen(80, function () {
    console.log(80);
})