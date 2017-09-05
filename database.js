'use strict';

//Importamos mongoose
var mongoose = require('mongoose'),
//Archivo de configuración
config = require('./config.js')

mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true}).then(
  () => { console.log('Database Connected Papu'); },
  err => {
    console.log('Algo feo paso Paps');
    console.log(err.stack);
  }
);