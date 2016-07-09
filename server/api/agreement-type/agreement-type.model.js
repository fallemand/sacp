'use strict';

import mongoose from 'mongoose';
var mongoosePaginate = require('mongoose-paginate');

var AgreementTypeSchema = new mongoose.Schema({
  name: String
});

/**
 * Plugins
 */

AgreementTypeSchema.plugin(mongoosePaginate);

export default mongoose.model('AgreementType', AgreementTypeSchema);
