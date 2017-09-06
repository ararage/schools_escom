'use strict'

var express = require('express'),
    bodyParser = require('body-parser');

var app = express();

var institutions = require('./routes/institution')
var campuses = require('./routes/campus')
var schools = require('./routes/school')

app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
app.use(bodyParser.text({ type: 'application/json' }));

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

app.all('/', function (req, res) {
    res.format({'text/html': function(){
        res.send('<p>Aqui podría ir una redirección al index de tu sitio</p>');
      }});
});
app.all('/schools', function (req, res) {
    res.format({'text/html': function(){
        res.send('<p>Aqui podría ir una redirección a esa parte de tu sitio</p>');
      }});
});
app.all('/schools/api', function (req, res) {
    res.format({'text/html': function(){
        res.send("<p>Aqui podría ir el manual de tu API</p> <ul><li><a href='/schools/api/institutions'>Instituciones</a></li><li></li><li></li></ul>");
      }});
});

/*
Tarea :D 
Implementar expresión regular que solo permita consumir los recursos
/schools/api/institutions
/schools/api/campuses
/schools/api/schools
...
y las rutas anteriores, / , /schools , /schools/api
app.all('', function (req, res) {
    res.redirect('http://localhost:3978/');   
});*/

app.use('/schools/api', institutions),
app.use('/schools/api', campuses),
app.use('/schools/api', schools)

module.exports = app;