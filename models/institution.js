'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InstitutionSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Inserta un nombre por favor.',
        index: {
            unique: true,
            dropDups: true
        }
    },
    description: {
        type: String,
        trim: true,
        required: 'Inserta una descripción por favor.',
        index: {
            unique: false,
            dropDups: true
        }
    }
}, {
    timestamps: true
})

var Institution = mongoose.model('Institution', InstitutionSchema);
module.exports = Institution;