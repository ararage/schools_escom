'use strict'

var mongoose = require('mongoose')

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Versión : 0.0.1
 * Función que se encarga de verificar que el body del request venga lleno
 * **/
function emptyBodyMidd(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        res.status(409).send({message: 'Enviar un Body en el request' })
		return
    } else {
        next()
    }
}

/**
 * Autor: José Ricardo Pérez Pérez
 * Fecha Creación : 04/09/2017
 * Fecha Última Actualización: 04/09/2017
 * Rev:  0.0.1 - 040917 Creación de la función
 * Versión : 0.0.1
 * Función que se encarga de verificar que el id proporcionado sea un ObjectId de Mongo valido
 * **/
function verifyMongooseIdMidd(req, res, next) {
	if(!req.params.id){
		res.status(409).send({ message: 'Proporciona un id como parametro' });
        return
	}else if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(409).send({ message: 'El id proporcionado no es valido' });
        return
    } else {
        next()
    }
}

module.exports = {
	emptyBodyMidd,
	verifyMongooseIdMidd
}