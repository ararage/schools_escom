'use strict'

var School = require('../models/school')
var Campus = require('../models/campus')
var mongoose = require('mongoose');
var constants = require('../constants')
var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Middleware que busca el campus proporcionado en el body, si existe continua
 */
function findCampusById(req,res,next){
    req.campusFound = {}
    if (req.body.campus) {
        if (mongoose.Types.ObjectId.isValid(req.body.campus)) {
            Campus
                .findOne({_id:req.body.campus})
                .exec()
                .then(
                    data => {
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
                        res.status(500).send({ message: 'Error interno del sistema'+err })
                        return
                    }
                )
        }else{
            res.status(409).send({ message: 'El id proporcionado de campus no es valido.' });
            return
        }
    }else{
        res.status(409).send({ message: 'El id de campus es requerido.' })
        return
    }
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Middleware de procesamiento del body de alta de escuelas
 */
function store(req,res,next){
    
    if(req.body.name){
        req.body.name = req.body.name.toUpperCase()
    }

    next()
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Middleware que busca una escuela por id proporcionado como parametro
 * la escuela encontrada se guarda en el objeto req.schoolFound
 */
function findSchoolById(req,res,next){
    req.schoolFound = {}
    req.oldCampus = {}
    if (req.params.id) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            School.findOne({_id:req.params.id})
                .deepPopulate(constants.populateQuerySchool)
                .select('+campus')
                .then(
                    data=>{
                        if(!data){
                            res.status(404).send({ message: "No existe la escuela con el id proporcionado" })
                            return
                        }else{
                            req.schoolFound = data
                            next()
                        }
                    }
                ).catch(
                    err=>{
                        res.status(500).send({ message: 'Error interno del sistema' })
                        return
                    }
                )
        }else{
            res.status(409).send({ message: 'El id proporcionado de escuela no es valido.'});
            return
        }
    }else{
        res.status(409).send({ message: 'El id de escuela es requerido.'})
        return
    }
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Middleware que busca todas las escuelas registradas
 */
function list(req,res,next){
    req.schools = {}
    School.find({})
    .populate(constants.populateQuerySchoolCampus)
    //Con deepPopulate poblamos de manera mas profunda los documentos 
    //con un Object id, esto se debe definir en el modelo
    .deepPopulate(constants.populateQuerySchool)
    .sort({createdAt:-1})
    //si se comenta la línea de abajo NO permitimos mostrar el atributo campus
    .select('+campus')
    .exec().then(
        data=>{
            req.schools = data
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
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Middleware que actualiza todos los atributos de la escuela proporcionada
 */
function update(req,res,next){
    if(req.body.name){
        req.schoolFound.name = req.body.name.toUpperCase()
    }

    if(req.body.description){
        req.schoolFound.description = req.body.description
    }

    next()
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de asignar el viejo campus
 * para retirar la escuela y asignar el nuevo campus
 * **/
function updateCampus(req,res,next){
    if(!req.body.campus){
        res.status(409).send({message:"El id de campus es requerido"})
        return
    }else{
        req.oldCampus = {}
        //Mantenemos en una bandera el campus anterior
        req.oldCampus = req.schoolFound.campus._id
        req.schoolFound.campus = req.body.campus
        next()
    }
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Versión : 0.0.1
 * Middleware que se encarga de eliminar el viejo campus
 * **/
function deleteOldCampus(req, res,next) {
    //Si viene el cambio de campus 
    //Eliminamos el campus donde se encuentre dada de alta la escuela
    if(req.body.campus){
        //Eliminamos la escuela del campus viejo
        Campus
            .findByIdAndUpdate({_id:req.oldCampus},{ $pull: {schools: req.params.id}})
            .exec()
            .then(data=>{
                //Ahora guardamos en el nuevo campus la relación
                req.campusFound.schools.push(req.params.id)
                next()
            })
            .catch(err=>{res.status(500).send({ message: 'Error interno del sistema.'+err });return;})
    }else{
        res.status(409).send({message:"El id de campus es necesario para consumir este recurso."})
        return
    }
}

module.exports = {
    findCampusById,
    store,
    findSchoolById,
    list,
    update,
    updateCampus,
    deleteOldCampus
}