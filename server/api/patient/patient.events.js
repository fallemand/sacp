/**
 * Patient model events
 */

'use strict';

import {EventEmitter} from 'events';
import Patient from './patient.model';
var PatientEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PatientEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Patient.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PatientEvents.emit(event + ':' + doc._id, doc);
    PatientEvents.emit(event, doc);
  }
}

export default PatientEvents;
