'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var TreatmentHistorySchema = new mongoose.Schema({
    treatment: {
        type: Schema.Types.ObjectId,
        ref: 'Treatment'
    },
    history: [{
        date: {
            type: Date,
            required: true
        },
        state: {
            type: Schema.Types.ObjectId,
            ref: 'TreatmentState'
        },
        observation: {
            type: String,
            required: true
        }
    }]
});

export default mongoose.model('TreatmentHistory', TreatmentHistorySchema);
