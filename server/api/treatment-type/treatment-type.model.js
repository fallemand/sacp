'use strict';

import mongoose from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

var TreatmentTypeSchema = new mongoose.Schema({
  name: String
});

/**
 * Plugins
 */

TreatmentTypeSchema.plugin(mongoosePaginate);

export default mongoose.model('TreatmentType', TreatmentTypeSchema);
