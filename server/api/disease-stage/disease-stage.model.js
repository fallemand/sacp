'use strict';

import mongoose from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

var DiseaseStageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

/**
 * Plugins
 */

DiseaseStageSchema.plugin(mongoosePaginate);

export default mongoose.model('DiseaseStage', DiseaseStageSchema);
