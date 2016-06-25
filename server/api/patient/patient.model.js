'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

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
    }
});

PatientSchema.virtual('desc').get(function() {
    return this.name + ' - ' + this.dni;
});

PatientSchema.set('toJSON', { virtuals: true });
PatientSchema.set('toObject', { virtuals: true });

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

export default mongoose.model('Patient', PatientSchema);
