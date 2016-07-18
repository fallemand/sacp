/**
 * UploadFile model events
 */

'use strict';

import {EventEmitter} from 'events';
import UploadFile from './upload-file.model';
var UploadFileEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UploadFileEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  UploadFile.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    UploadFileEvents.emit(event + ':' + doc._id, doc);
    UploadFileEvents.emit(event, doc);
  }
}

export default UploadFileEvents;
