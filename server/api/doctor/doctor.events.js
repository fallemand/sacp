/**
 * Doctor model events
 */

'use strict';

import {EventEmitter} from 'events';
import Doctor from './doctor.model';
var DoctorEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DoctorEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Doctor.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    DoctorEvents.emit(event + ':' + doc._id, doc);
    DoctorEvents.emit(event, doc);
  }
}

export default DoctorEvents;
