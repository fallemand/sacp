'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var TreatmentHistorySchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'Treatment'
    },
    history: [{
        date: {
            type: Date,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        state: {
            type: String,
            ref: 'TreatmentState',
            required: true
        },
        observation: {
            type: String,
            required: true
        }
    }]
});

export default mongoose.model('TreatmentHistory', TreatmentHistorySchema);
