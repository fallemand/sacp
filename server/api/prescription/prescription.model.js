'use strict';

import mongoose from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

var PrescriptionSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

/**
 * Plugins
 */

PrescriptionSchema.plugin(mongoosePaginate);

export default mongoose.model('Prescription', PrescriptionSchema);
