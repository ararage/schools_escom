'use strict'

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

var institutions = require('./routes/institution')
var campuses = require('./routes/campus')
var schools = require('./routes/school')

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.json())
app.use(bodyParser.text({ type: 'application/json' }));
app.use(express.static(path.join(__dirname, 'public')));
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

app.use('/schools/api', institutions),
app.use('/schools/api', campuses),
app.use('/schools/api', schools)

/*Manejador de errores*/
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = err
    res.status(err.status);
    if(err.status == 404){
        res.render('notfound');
    }else{
        res.render('error')
    }
});

module.exports = app;