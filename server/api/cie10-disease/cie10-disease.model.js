'use strict';

import mongoose from 'mongoose';

var Cie10DiseaseSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    name: String
});

export default mongoose.model('Cie10Disease', Cie10DiseaseSchema);
