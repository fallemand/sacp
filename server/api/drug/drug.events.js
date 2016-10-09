/**
 * Drug model events
 */

'use strict';

import {EventEmitter} from 'events';
import Drug from './drug.model';
var DrugEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DrugEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Drug.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    DrugEvents.emit(event + ':' + doc._id, doc);
    DrugEvents.emit(event, doc);
  };
}

export default DrugEvents;
