'use strict'

var express = require('express');
var api = express.Router();

var CampusMidd = require('../middlewares/campus')
var UtilsMidd = require('../middlewares/utils')

var CampusController = require('../controllers/campus')

//Ruta para dar de alta un registro de tipo "Campus" 
api.post('/campuses',
    UtilsMidd.emptyBodyMidd,
    CampusMidd.findInstitutionById,
    CampusMidd.store,
    CampusController.store
);

//Ruta para obtener todos los registros "Campus"
api.get('/campuses/', 
    CampusMidd.list,
    CampusController.list
);

//Ruta para obtener un registro "Campus" por id 
api.get('/campuses/:id?', 
    CampusMidd.findCampusById,
    CampusController.show
);

//Ruta para obtener todas las escuelas por id de tipo "Campus"
api.get('/campuses/:id?/schools', 
    CampusMidd.findSchoolsByCampus,
    CampusController.listSchools
);

//Ruta para dar de baja un documento tipo "Campus"
api.delete('/campuses/:id?',
    CampusController._delete
);

//Ruta para actualizar un registro "Campus" por id 
api.put('/campuses/:id?',
    UtilsMidd.emptyBodyMidd,
    CampusMidd.findCampusById,
    CampusMidd.update,
    CampusController.update
);

module.exports = api;