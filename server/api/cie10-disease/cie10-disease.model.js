'use strict';

import mongoose from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

var Cie10DiseaseSchema = new mongoose.Schema({
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

Cie10DiseaseSchema.virtual('desc').get(function() {
    return this._id + ' - ' + this.name;
});

Cie10DiseaseSchema.set('toJSON', { virtuals: true });
Cie10DiseaseSchema.set('toObject', { virtuals: true });

/**
 * Plugins
 */

Cie10DiseaseSchema.plugin(mongoosePaginate);

export default mongoose.model('Cie10Disease', Cie10DiseaseSchema);
