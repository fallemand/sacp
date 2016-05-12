/**
 * AgreementType model events
 */

'use strict';

import {EventEmitter} from 'events';
import AgreementType from './agreement-type.model';
var AgreementTypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AgreementTypeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  AgreementType.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AgreementTypeEvents.emit(event + ':' + doc._id, doc);
    AgreementTypeEvents.emit(event, doc);
  }
}

export default AgreementTypeEvents;
