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
    createdDate: {
        type: Date,
        required: true
    },
    lastUodateDate: {
        type: Date
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
        type: Schema.Types.ObjectId,
        ref: 'DiseaseStage'
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
    TreatmentHistory.remove({_id: this._id}).exec();
    next();
});

TreatmentSchema.pre('save', function(next) {
    if(this.treatmentWeight && this.treatmentHeight) {
        this.treatmentBodySurface = Math.sqrt((this.treatmentWeight * this.treatmentHeight) / 60).toFixed(2);
    }
    next();
});

TreatmentSchema.pre('update', function(next) {
    if(this.treatmentWeight && this.treatmentHeight) {
        this.treatmentBodySurface = Math.sqrt((this.treatmentWeight * this.treatmentHeight) / 60).toFixed(2);
    }
    next();
});


export default mongoose.model('Treatment', TreatmentSchema);
