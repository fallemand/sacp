'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var DrugPresentationSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    drug: {
        type: Schema.Types.ObjectId,
        ref: 'Drug',
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
DrugPresentationSchema.plugin(mongoosePaginate);

export default mongoose.model('DrugPresentation', DrugPresentationSchema);
