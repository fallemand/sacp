/**
 * Cie10Disease model events
 */

'use strict';

import {EventEmitter} from 'events';
import Cie10Disease from './cie10-disease.model';
var Cie10DiseaseEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
Cie10DiseaseEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Cie10Disease.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    Cie10DiseaseEvents.emit(event + ':' + doc._id, doc);
    Cie10DiseaseEvents.emit(event, doc);
  }
}

export default Cie10DiseaseEvents;
