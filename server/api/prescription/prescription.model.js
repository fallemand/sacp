'use strict';

import mongoose from 'mongoose';

var PrescriptionSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Prescription', PrescriptionSchema);
