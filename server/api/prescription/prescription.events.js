/**
 * Prescription model events
 */

'use strict';

import {EventEmitter} from 'events';
import Prescription from './prescription.model';
var PrescriptionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PrescriptionEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Prescription.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PrescriptionEvents.emit(event + ':' + doc._id, doc);
    PrescriptionEvents.emit(event, doc);
  }
}

export default PrescriptionEvents;
