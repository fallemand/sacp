/**
 * TreatmentState model events
 */

'use strict';

import {EventEmitter} from 'events';
import TreatmentState from './treatment-state.model';
var TreatmentStateEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TreatmentStateEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  TreatmentState.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TreatmentStateEvents.emit(event + ':' + doc._id, doc);
    TreatmentStateEvents.emit(event, doc);
  }
}

export default TreatmentStateEvents;
