'use strict'

var Campus = require('../models/campus')
var Institution = require('../models/institution')
var School = require('../models/school')
var mongoose = require('mongoose');
var constants = require('../constants')
var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Middleware de procesamiento del body de alta de campuses
 */
function store(req,res,next){
    if(req.body.name){
        req.body.name = req.body.name.toUpperCase()
    }

    if(req.body.description){
        req.body.description = req.body.description.toUpperCase()
    }

    next()
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de buscar un documento de tipo Institution por id proporcionado
 * y se guarda en el objeto req.institutionFound = {}
 * **/
function findInstitutionById(req,res,next){
    req.institutionFound = {}
    if (req.body.institution) {
        if (mongoose.Types.ObjectId.isValid(req.body.institution)) {
            Institution
                .findOne({_id:req.body.institution})
                .then(data=>{
                    if(!data){
                        res.status(404).send({ message: "No existe la institutción con el id proporcionado" })
                        return
                    }else{
                        req.institutionFound = data;
                        next()
                    }
                }).catch(err=>{
                    res.status(500).send({ message: 'Error interno del sistema '+err })
                    return
                })
        } else {
            res.status(409).send({ message: 'El id proporcionado de institución no es valido.' });
            return
        }
    }else{
        res.status(409).send({ message: "Proporciona un id de institución" })
        return
    }
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de buscar todos los documentos de campuses populando la institucion y ordenando de forma descendente por 
 * fecha de creación
 * **/
function list(req,res,next){
    req.campuses = {}

    Campus.find({})
    .populate(constants.populateQueryCampusInstitution)
    .populate(constants.populateQueryCampusSchools)
    .sort({createdAt:-1})
    .exec().then(
        data=>{
            req.campuses = data
            next()
        } 
    ).catch(
        err=>{
            res.status(500).send({ message: 'Error interno del sistema '+err })
            return
        }
    )
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de buscar un documento de tipo Campus por id proporcionado
 * y se guarda en el objeto req.campusFound = {}
 * **/
function findCampusById(req,res,next){
    req.campusFound = {}
    if(req.params.id){
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            Campus.findOne({_id:req.params.id})
            .populate(constants.populateQueryCampusInstitution)
            .populate(constants.populateQueryCampusSchools)
            .exec()
            .then(
                data=>{
                    if(!data){
                        res.status(404).send({ message: "No existe el campus con el id proporcionado" })
                        return
                    }else{
                        req.campusFound = data
                        next()
                    }
                }
            ).catch(
                err=>{
                    res.status(500).send({ message: 'Error interno del sistema '+err })
                    return
                }
            )
        }else{
            res.status(409).send({ message: 'El id proporcionado de campus no es valido.' });
            return
        }
    }else{
        res.status(409).send({ message: "Proporciona un id de campus" })
        return
    }
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de asignar los parámetros enviados
 * en el body sobre el objeto encontrado req.campusFound = {}
 * **/
function update(req,res,next){

    if(req.body.name){
        req.campusFound.name = req.body.name.toUpperCase()
    }

    if(req.body.description){
        req.campusFound.description = req.body.description.toUpperCase()
    }

    if (req.body.active != null) {
        req.campusFound.active = req.body.active
    }

    next()
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de obtener todas las escuelas por id de campus proporcionado
 * **/
function findSchoolsByCampus(req,res,next){
    req.schoolsFound = {}
    if(req.params.id){
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            School
            .find({})
            .then(data=>{req.schoolsFound = data;next();})
            .catch(err=>{res.status(500).send({message:"Error interno del sistema"});return;})
        }else{
            res.status(409).send({ message: 'El id proporcionado de campus no es valido' });
            return
        }
    }else{
        res.status(409).send({ message: "Proporciona un id de campus" })
        return
    }
}

module.exports = {
    store,
    list,
    findInstitutionById,
    findCampusById,
    update,
    findSchoolsByCampus
}