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
    school.save().then(
        data=>{
            //Creamos la relación de campus con escuela
            req.campusFound.schools.push(data._id)
            req.campusFound
                .save()
                .then(
                    campus=>{
                        res.status(200).send({ data: data })
                        return
                    }
                ).catch(
                    err=>{
                        res.status(500).send({ message: "Error interno del sistema." })
                        return
                    }
                )
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

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 05/09/2017
 * Fecha Última Actualización: 05/09/2017
 * Rev:  0.0.1 - 050917 Creación de la función
 * Función que se encarga de listar todos los registros de tipo 'School
 */
function list(req,res,next){
    res.status(200).send({data:req.schools})
    return
}

module.exports = {
    store,
    list
}
