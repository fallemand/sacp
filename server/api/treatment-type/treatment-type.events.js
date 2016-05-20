/**
 * TreatmentType model events
 */

'use strict';

import {EventEmitter} from 'events';
import TreatmentType from './treatment-type.model';
var TreatmentTypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TreatmentTypeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  TreatmentType.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TreatmentTypeEvents.emit(event + ':' + doc._id, doc);
    TreatmentTypeEvents.emit(event, doc);
  }
}

export default TreatmentTypeEvents;
