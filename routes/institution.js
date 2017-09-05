'use strict'

var express = require('express');
var api = express.Router();

var InstitutionMidd = require('../middlewares/institution')
var UtilsMidd = require('../middlewares/utils')

var InstitutionController = require('../controllers/institution')

//Ruta para dar de alta un registro "Institution" 
api.post('/institutions',
    UtilsMidd.emptyBodyMidd,
    InstitutionMidd.store,
    InstitutionController.store
);

//Ruta para actualizar un registro "Institution" por id 
api.put('/institutions/:id?',
    UtilsMidd.emptyBodyMidd,
    InstitutionMidd.findInstitutionById,
    InstitutionMidd.update,
    InstitutionController.update
);

//Ruta para obtener todos los registros institutions
api.get('/institutions/all/:page?',
    InstitutionMidd.list,
    InstitutionController.list
);

//Ruta para obtener un registro "Institution" por id 
api.get('/institutions/:id?',
    InstitutionMidd.findInstitutionById,
    InstitutionController.show
);

//Ruta para eliminar un registro "Institution" por id 
api.delete('/institutions/:id?',
    InstitutionController._delete
);

//Ruta para obtener campus por id de "Institution" 
api.get('/institutions/:id/campuses',
    //InstitutionMidd.findInstitutionById,
    InstitutionMidd.findInstitutionByIdCampuses,
    InstitutionController.showCampuses
);

module.exports = api;