'use strict'

var Campus = require('../models/campus');
var constants = require('../constants');
var mongoose = require('mongoose');

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Función que se encarga del alta un campus
 */
function store(req,res){
    var campus = new Campus(req.body)

    //Ejecutamos una promesa de la función save() 
    //para guardar el nuevo documento
    var promesa = campus.save().then(
        data=>{
            //si es guardado retornamos el dato en la promesa
            return data
        },
        reject => {
            res.status(409).send({message:reject})
            return 
        }
    ).catch(
        err=>{
            res.status(500).send({message:"Error interno del sistema"})
            return
        }
    )

    //Tenemos una promesa pendiente, al guardarse el campus
    //Se nos ocurre mostrar la información de la institución a la que
    //Pertenece
     //Buscamos el registro ya creado y comenzamos a 
     //poblar los la relacion con Institución
    promesa.then(
        data=>{
            Campus
            .findOne({_id:data._id})
            .populate(constants.populateQueryCampusInstitution)
            .then(
            campus=>{
                res.status(200).send({data:campus});
                return;
            });
        }
    ).catch(
        err=>{
            res.status(500).send({message:"Error interno del sistema"})
            return
        }
    )
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Función que se encarga de mostrar todos los campuses
 */
function list(req,res){
    res.status(200).send({data:req.campuses})
    return
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Función que se encarga de eliminar un campus por id
 */
function _delete(req,res){
    if(req.params.id){
        if (mongoose.Types.ObjectId.isValid(req.params.id)){ 
            Campus.findByIdAndRemove(req.params.id)
                .then(
                    data=>{
                        if(!data){
                            res.status(404).send({ message: "No existe el campus con el id proporcionado" })
                            return
                        }else{
                            res.status(200).send({message:"Se ha borrado el campus con éxito"})
                            return
                        }
                    }
                ).catch(
                    err=>{
                        res.status(500).send({ message: 'Error interno del sistema. ' })
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
 * Función que se encarga de obtener un campus por id
 */
function show(req,res){
    res.status(200).send({data:req.campusFound})
    return
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Función que se encarga de la modificación de campuses
 */
function update(req,res){
    req.campusFound.save().then(
        data=>{
            Campus
                .findOne({_id:req.params.id})
                .populate(constants.populateQueryCampusInstitution)
                .populate(constants.populateQueryCampusSchools)
                .then( campus=>{res.status(200).send({data:campus});return;})
                .catch( err=>{res.status(500).send({ message: 'Error interno del sistema '+err });return;} )
        },
        reject=>{res.status(409).send({ message: reject });return;}
    ).catch(
        err=>{res.status(500).send({ message: 'Error interno del sistema '+err }); return}
    )
}

function listSchools(req,res){
    res.status(200).send({data:req.schoolsFound})
    return
}

module.exports = {
    store,
    _delete,
    show,
    update,
    list,
    listSchools
}