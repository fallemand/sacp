/**
 * TreatmentHistory model events
 */

'use strict';

import {EventEmitter} from 'events';
import TreatmentHistory from './treatment-history.model';
var TreatmentHistoryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TreatmentHistoryEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  TreatmentHistory.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TreatmentHistoryEvents.emit(event + ':' + doc._id, doc);
    TreatmentHistoryEvents.emit(event, doc);
  }
}

export default TreatmentHistoryEvents;
