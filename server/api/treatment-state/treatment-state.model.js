'use strict';

import mongoose from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

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

/**
 * Plugins
 */

TreatmentStateSchema.plugin(mongoosePaginate);

export default mongoose.model('TreatmentState', TreatmentStateSchema);
