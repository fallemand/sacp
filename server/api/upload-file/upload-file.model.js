'use strict';

import mongoose from 'mongoose';

var UploadFileSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('UploadFile', UploadFileSchema);
