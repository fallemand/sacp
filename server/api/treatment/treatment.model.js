'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;


var TreatmentSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    },
    disease : {
        topographicDiagnosis: {
            type: String,
            required: true
        },
        histologicalDiagnosis: {
            type: String,
            required: true
        },
        stage: {
            type: Number,
            required: false
        }
    },
    treatment: {
        type: {
            type: Schema.Types.ObjectId,
            ref: 'TreatmentType'
        },
        schema: {
            type: String,
            required: true
        },
        expectedDate: {
            type: Date,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        bodySurface: {
            type: String,
            required: false
        },
        actualCicle: {
            type: Number,
            required: false
        },
        cyclesQuantity: {
            type: String,
            required: false
        }
    },
    drugs: [{
        name : {
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
    observation : String

});

export default mongoose.model('Treatment', TreatmentSchema);
