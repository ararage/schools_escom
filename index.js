'use strict'

var app = require('./app');
var database = require('./database');
var port = process.env.PORT || 3978

app.listen(port, function() {
    console.log('Puerto del servidor ' + port)
});