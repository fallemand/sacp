/**
 * DrugType model events
 */

'use strict';

import {EventEmitter} from 'events';
import DrugType from './drug-type.model';
var DrugTypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DrugTypeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  DrugType.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    DrugTypeEvents.emit(event + ':' + doc._id, doc);
    DrugTypeEvents.emit(event, doc);
  }
}

export default DrugTypeEvents;
