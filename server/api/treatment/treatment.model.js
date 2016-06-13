'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import TreatmentHistory from '../treatment-history/treatment-history.model';


var TreatmentSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    state: {
        type: String,
        ref: 'TreatmentState',
        required: true
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
    observation: String
});

TreatmentSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    TreatmentHistory.remove({_id: this._id}).exec();
    next();
});


export default mongoose.model('Treatment', TreatmentSchema);
