'use strict';

import mongoose from 'mongoose';

var TreatmentStateSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('TreatmentState', TreatmentStateSchema);
