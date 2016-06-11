'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;


var TreatmentSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    },
    diseaseTopographicDiagnosis: {
        type: Schema.Types.ObjectId,
        ref: 'Cie10Disease'
    },
    diseaseHistologicalDiagnosis: {
        type: String,
        required: true
    },
    diseaseStage: {
        type: Number,
        required: false
    },
    treatmentType: {
        type: Schema.Types.ObjectId,
        ref: 'TreatmentType'
    },
    treatmentSchema: {
        type: String,
        required: true
    },
    treatmentExpectedDate: {
        type: Date,
        required: true
    },
    treatmentHeight: {
        type: Number,
        required: true
    },
    treatmentWeight: {
        type: Number,
        required: true
    },
    treatmentBodySurface: {
        type: String,
        required: false
    },
    treatmentActualCicle: {
        type: Number,
        required: false
    },
    treatmentCyclesQuantity: {
        type: String,
        required: false
    },

    drugs: [{
        name: {
            type: String,
            required: true
        },
        tradeName: {
            type: String,
            required: true
        },
        presentation: {
            type: String,
            required: true
        },
        type: {
            type: Schema.Types.ObjectId,
            ref: 'DrugType'
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    observation: String,
    state: {
        type: String,
        ref: 'TreatmentState',
        required: true
    }
});

export default mongoose.model('Treatment', TreatmentSchema);
