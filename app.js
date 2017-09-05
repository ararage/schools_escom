'use strict'

var express = require('express'),
    bodyParser = require('body-parser');

var app = express();


var institutions = require('./routes/institution')
var campuses = require('./routes/campus')
var schools = require('./routes/school')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
    //Puede ser consumida desde cualquier lugar
    res.header('Access-Control-Allow-Origin', '*');
    //Cabeceras permitidas
    res.header( 'Access-Control-Allow-Headers', 
                'X-API-KEY,Origin,X-Requested-With,Content-Type, Accept, Access-Control-Request-Method,Authorization');
    //Metodos Permitidos
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Allow', 'GET,POST,PUT,DELETE');
    next();
});

app.use('/schools/api', institutions),
app.use('/schools/api', campuses),
app.use('/schools/api', schools)

module.exports = app;