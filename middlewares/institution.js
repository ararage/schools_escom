'use strict'

var Institution = require('../models/institution')
var Campus = require('../models/campus')
var mongoose = require('mongoose');
var constants = require('../constants')
var mongoosePaginate = require('mongoose-pagination')
var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Middleware de procesamiento del body de alta de instituciones
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
 * como parámetro, se guarda la búsqueda en el objeto req.institutionFound = {}
 * 
 * **/
function findInstitutionById(req,res,next){
    req.institutionFound = {}
    if (req.params.id) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            Institution.
            findOne({ _id: req.params.id })
            .exec()
            .then(
                data=>{
                    req.institutionFound = data;
                    next()
                }
            ).catch(
                err=>{
                    res.status(500).send({ message: 'Error interno del sistema'})
                    return
                }
            )
        } else {
            res.status(409).send({ message: 'El id proporcionado de institución no es valido.' });
            return
        }
    } else {
        res.status(409).send({ message: "Proporciona un id como parámetro" })
        return
    }
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de listar todas las instituciones
 * req.institutions = {}
 * **/
function list(req,res,next){
    req.institutions = {}
    var query = 
        Institution
        .find({})
        
        if(req.params.page){
            var itemsPP = 5
            var page = Number(req.params.page)
            query.paginate(page,itemsPP,function(err,data,total){
                if(err){
                    res.status(500).send({ message: 'Error interno del sistema'+err})
                    return
                }else{
                    req.institutions = data;
                    next()
                }
            })
        }else{
            query
            .exec()
            .then(
                data=>{
                    req.institutions = data;
                    next()
                }
            ).catch(
                err=>{
                    res.status(500).send({ message: 'Error interno del sistema'})
                    return
                }
            )
        }
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de llenar los atributos del objeto 
 * req.institutionFound = {}
 * **/
function update(req,res,next){

    if(req.body.name){
        req.institutionFound.name = req.body.name.toUpperCase()
    }

    if(req.body.description){
        req.institutionFound.description = req.body.description.toUpperCase()
    }

    next()
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de buscar todos los documentos
 * de tipo Campus por id de institución, los resultados
 * son guardados en el objeto req.campusesFound
 * 
 * **/
function findInstitutionByIdCampuses(req,res,next){
    req.campusesFound = {}
    if (req.params.id) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            Campus.find({ institution: req.params.id })
                        .populate(constants.populateQueryCampusInstitution)
                        .populate(constants.populateQueryCampusSchools)
                        .exec()
                        .then(data =>{
                            req.campusesFound = data
                            next()
                        }).catch(err=>{
                            res.status(500).send({ message: 'Error interno del sistema.'+err })
                            return
                        })
        } else {
            res.status(409).send({ message: 'El id proporcionado de institución no es valido.' });
            return
        }
    } else {
        res.status(409).send({ message: "Proporciona un id como parámetro" })
        return
    }
}

module.exports = {
    store,
    list,
    findInstitutionById,
    findInstitutionByIdCampuses,
    update
}