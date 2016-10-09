/**
 * DrugPresentation model events
 */

'use strict';

import {EventEmitter} from 'events';
import DrugPresentation from './drug-presentation.model';
var DrugPresentationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DrugPresentationEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  DrugPresentation.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    DrugPresentationEvents.emit(event + ':' + doc._id, doc);
    DrugPresentationEvents.emit(event, doc);
  };
}

export default DrugPresentationEvents;
