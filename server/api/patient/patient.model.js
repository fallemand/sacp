'use strict';

import mongoose from 'mongoose';

var PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    dni: {
        type: Number,
        required: true
    },
    socialInsuaranceNumber: {
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
        type: String,
        required: false
    }
});

export default mongoose.model('Patient', PatientSchema);
