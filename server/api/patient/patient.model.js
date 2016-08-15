'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import Treatment from '../treatment/treatment.model';
var mongoosePaginate = require('mongoose-paginate');

var PatientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    registeredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: false
    },
    dni: {
        type: Number,
        required: true
    },
    socialInsuranceNumber: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    cellphone: {
        type: String,
        required: false
    },
    agreementType: {
        type: Schema.Types.ObjectId,
        ref: 'AgreementType',
        required: false
    },
    registerDate: {
        type: Date,
        required: true
    }
});

PatientSchema.virtual('desc').get(function() {
    return this.name + ' - ' + this.dni;
});

PatientSchema.set('toJSON', { virtuals: true });
PatientSchema.set('toObject', { virtuals: true });

PatientSchema.pre('remove', function(next){
    Treatment.count({patient: this._id}, function (err, count){
        if(err) {
            next(err);
        }
        if(count>0){
            next(new Error("No se puede eliminar el paciente porque contiene tratamientos asociados"));
        }
        else {
            next();
        }
    });
});

PatientSchema
    .path('dni')
    .validate(function (value, respond) {
        var self = this;
        return this.constructor.findOne({dni: value}).exec()
            .then(function (patient) {
                if (patient) {
                    if (self.id === patient.id) {
                        return respond(true);
                    }
                    return respond(false);
                }
                return respond(true);
            })
            .catch(function (err) {
                throw err;
            });
    }, 'Ya existe un paciente con ese DNI.');

/**
 * Plugins
 */

PatientSchema.plugin(mongoosePaginate);

export default mongoose.model('Patient', PatientSchema);
