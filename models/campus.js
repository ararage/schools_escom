'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CampusSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Insera un nombre por favor',
        index: {
            unique: false,
            dropDups: true
        }
    },
    description: {
        type: String,
        trim: true,
        required: 'Inserta una descripción por favor',
        index: {
            unique: false,
            dropDups: true
        }
    },
    active: {
        type: Boolean,
        default: true,
        index: {
            unique: false,
            dropDups: true
        }
    },
    institution: {
        type: Schema.ObjectId,
        ref: 'Institution'
    },
    schools: [{ type: Schema.ObjectId, ref: 'School' }]
}, {
    timestamps: true
})

var Campus = mongoose.model('Campus', CampusSchema);
module.exports = Campus;