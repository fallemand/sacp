'use strict';

import mongoose from 'mongoose';

var DiseaseStageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

export default mongoose.model('DiseaseStage', DiseaseStageSchema);
