'use strict';

import mongoose from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

var DrugTypeSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

/**
 * Plugins
 */

DrugTypeSchema.plugin(mongoosePaginate);

export default mongoose.model('DrugType', DrugTypeSchema);
