'use strict';

import mongoose from 'mongoose';

var Cie10DiseaseSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

Cie10DiseaseSchema.virtual('desc').get(function() {
    return this.code + ' - ' + this.name;
});

Cie10DiseaseSchema.set('toJSON', { virtuals: true });
Cie10DiseaseSchema.set('toObject', { virtuals: true });

export default mongoose.model('Cie10Disease', Cie10DiseaseSchema);
