'use strict';

import mongoose from 'mongoose';

var TreatmentStateSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

export default mongoose.model('TreatmentState', TreatmentStateSchema);
