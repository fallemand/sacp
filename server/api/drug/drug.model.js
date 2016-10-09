'use strict';

import mongoose from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

var DrugSchema = new mongoose.Schema({
  name: String
});

/**
 * Plugins
 */
DrugSchema.plugin(mongoosePaginate);

export default mongoose.model('Drug', DrugSchema);
