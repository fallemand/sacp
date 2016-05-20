/**
 * Treatment model events
 */

'use strict';

import {EventEmitter} from 'events';
import Treatment from './treatment.model';
var TreatmentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TreatmentEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Treatment.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TreatmentEvents.emit(event + ':' + doc._id, doc);
    TreatmentEvents.emit(event, doc);
  }
}

export default TreatmentEvents;
