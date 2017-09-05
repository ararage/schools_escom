'use strict'

var School = require('../models/school');
var Campus = require('../models/campus');
var mongoose = require('mongoose');
var constants = require('../constants')
var deepPopulate = require('mongoose-deep-populate')(mongoose);

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Función que se encarga del alta de escuelas
 */
function store(req, res) {
    var school = new School(req.body)
    //Promesa que guarda el documento Escuela
    var promesaSchool = school.save().then(
        data=>{
           return data
        },
        reject=>{
            res.status(409).send({message:reject})
            return
        }
    ).catch(
        err=>{
            res.status(500).send({ message: "Error interno del sistema." })
            return
        }
    )

    //Finalizamos la promesa creando la relacion y guardando el campus
    promesaSchool.then(data=>{
         //Creamos la relación de campus con escuela
        req.campusFound.schools.push(data._id)
        req.campusFound
             .save()
             .then(
                 campus=>{
                     res.status(200).send({ data: data })
                     return
                 },
                 reject=>{
                    res.status(409).send({message:reject})
                    return
                 }
             ).catch(
                 err=>{
                     res.status(500).send({ message: "Error interno del sistema." })
                     return
                 }
             )
        }
    )
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Función que se encarga de listar todos los registros de tipo 'School
 */
function list(req,res){
    res.status(200).send({data:req.schools})
    return
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Función que se encarga de mostrar un registro de tipo 'School
 */
function show(req,res){
    res.status(200).send({data:req.schoolFound})
    return
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Función que se encarga de actualizar un registro de tipo 'School'
 */
function update(req,res){
    req.schoolFound
    .save()
    .then(  data=>{res.status(200).send({data:data});return;},
            reject=>{res.status(409).send({message:reject});return;})
    .catch(err=>{res.status(500).send({message:"Error interno del servidor"});return;})
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Función que se encarga de la modificación del campus al que pertenece una escuela
 */
function updateCampus(req,res){
    //Promesa que guarda la escuela
    var escuelaProm = req.schoolFound
        .save()
        .then(
            data=>{
                return data
            }
        ).catch(err=>{
            res.status(500).send({ message: "Error interno del sistema."+err })
            return
        });
    //Ahora guardamos el campus
    escuelaProm = escuelaProm.then(
        data=>{
            req.campusFound
            .save()
            .then(
                campus=>{
                    return campus
                }
            ).catch(err=>{
                res.status(500).send({ message: "Error interno del sistema."+err })
                return
            })
        }
    )
    //Finalmente mostramos como se poblaria
    escuelaProm.then(
        campus=>{
            School
            .findOne({_id:req.params.id})
            .deepPopulate(constants.populateQuerySchool)
            .select("+campus")
            .then(school=>{
                res.status(200).send({data:school});return;
            }
            ).catch(err=>{
                res.status(500).send({ message: "Error interno del sistema."+err })
                return
            })
        }
    ).catch(err=>{res.status(500).send({ message: "Error interno del sistema "+err});return;})
}

module.exports = {
    store,
    list,
    show,
    update,
    updateCampus
}
