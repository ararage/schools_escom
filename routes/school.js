'use strict'

var express = require('express');
var api = express.Router();

var SchoolMidd = require('../middlewares/school')
var UtilsMidd = require('../middlewares/utils')

var SchoolController = require('../controllers/school')

//Ruta para dar de alta un registro "School" 
api.post('/schools',
    UtilsMidd.emptyBodyMidd,
    SchoolMidd.findCampusById,
    SchoolMidd.store,
    SchoolController.store
);

//Ruta para obtener todos los registros "School"
api.get('/schools/', 
    SchoolMidd.list,
    SchoolController.list
);

//Ruta para actualizar un registro "School" por id 
/*api.put('/schools/:id?',
    UtilsMidd.emptyBodyMidd,
    SchoolMidd.findSchoolById,
    SchoolMidd.update,
    SchoolController.update
);*/

//Ruta para actualizar el campus de un registro "School" por id 
api.put('/schools/:id?/campus',
    UtilsMidd.emptyBodyMidd,
    SchoolMidd.findSchoolById,
    SchoolMidd.findCampusById
    //,SchoolMidd.updateCampus,
    //SchoolMidd.deleteOldCampus,
    //SchoolController.updateCampus
);

module.exports = api;