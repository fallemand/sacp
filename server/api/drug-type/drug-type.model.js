'use strict';

import mongoose from 'mongoose';

var DrugTypeSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('DrugType', DrugTypeSchema);
