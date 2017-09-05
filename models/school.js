'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var SchoolSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Inserta un nombre por favor.',
        index: {
            unique: false,
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
    },
    campus: {
        type: Schema.ObjectId,
        select:false,
        ref: 'Campus',
        required: 'Inserta un campus.'
    }
}, {
    timestamps: true
})

SchoolSchema.methods={
    deepPopulate:function(){
    deepPopulate()
    }
}

SchoolSchema.plugin(deepPopulate,{
    populate:{
        'campus':{select:'name description institution active'},
        'campus.institution':{select:'name description'}
    }
});

var School = mongoose.model('School', SchoolSchema);
module.exports = School;