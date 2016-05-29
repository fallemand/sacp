'use strict';

import mongoose from 'mongoose';

var TreatmentTypeSchema = new mongoose.Schema({
  name: String
});

export default mongoose.model('TreatmentType', TreatmentTypeSchema);
