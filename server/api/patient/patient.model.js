'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var PatientSchema = new Schema({
    name: {
        type: String,
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

export default mongoose.model('Patient', PatientSchema);
