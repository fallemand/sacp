'use strict';

import mongoose from 'mongoose';
var extend = require('mongoose-schema-extend');
var UserSchema = require('mongoose').model('User').schema;

var DoctorSchema = UserSchema.extend({
  info: String,
  active: Boolean
});

export default mongoose.model('Doctor', DoctorSchema);
