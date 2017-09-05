'use strict'

var Institution = require('../models/institution');


/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Función que se encarga del alta de instituciones
 */
function store(req, res) {

    var institution = new Institution(req.body)

    institution
            .save()
            .then(
                institutionSaved=>{
                    if(institutionSaved){
                        res.status(200).send({ data: institutionSaved })
                        return
                    }else{
                        res.status(500).send({ message: "Ocurrio un error interno" })
                        return
                    }
                },
                reject => {
                    if(reject.code && reject.code == 11000){
                        res.status(409).send({message:"Ya existe una institución con el mismo nombre"})
                        return 
                    }else{
                        res.status(409).send({message:reject})
                        return 
                    }
                }
            ).catch(err=>{
                res.status(500).send({message:"Error interno del sistema"})
                return
            });
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Función que se encarga de la actualización de instituciones
 */
function update(req,res){
    req.institutionFound
        .save()
        .then(
            institutionSaved => {
                if(institutionSaved){
                    res.status(200).send({data:institutionSaved})
                    return
                }else{
                    res.status(500).send({message:"Error interno del sistema"})
                    return
                }
            },
            reject=>{
                if(reject.code && reject.code == 11000){
                    res.status(409).send({message:"Ya existe una institución con el mismo nombre"})
                    return 
                }else{
                    res.status(409).send({message:reject})
                    return 
                }
            }
        )
        .catch(
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
 * Función que se encarga de mostrar una institución por id
 */
function show(req,res){
    res.status(200).send({data:req.institutionFound}) 
    return
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Función que se encarga de mostrar las instituciones encontradas
 */
function list(req,res){
    res.status(200).send({data:req.institutions})
    return
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Función que se encarga de mostrar los campus de una institución
 */
function showCampuses(req,res){
    res.status(200).send({data:req.campusesFound}) 
    return
}


/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Función que se encarga de eliminar una instictución por id
 */
function _delete(req,res){
    Institution.findByIdAndRemove(req.params.id).then(
        data =>{
            if(!data){
                res.status(404).send({ message: "No existe la institución con el id proporcionado" })
                return
            }else{
                res.status(200).send({message:"Institución eliminada con éxito"})
                return
            }
        },
        reject=> {res.status(500).send({message:"Error interno del sistema"});return;}
    )
}

module.exports = {
    store,
    update,
    show,
    list,
    showCampuses,
    _delete
}