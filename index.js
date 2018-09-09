var express = require('express');

var app = express();

app.get('/', function (req, res) {
    res.sendFile('test.html', { root: './public' });
});

app.listen(8080);