'use strict';

import mongoose from 'mongoose';

var AgreementTypeSchema = new mongoose.Schema({
  name: String
});

export default mongoose.model('AgreementType', AgreementTypeSchema);
