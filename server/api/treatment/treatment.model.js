'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;


var TreatmentSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    },
    disease : {
        topographisDiagnosis: {
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
    treatments: {
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
        ciclesQuantity: {
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
        drugType: {
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
