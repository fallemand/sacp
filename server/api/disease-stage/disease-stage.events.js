/**
 * DiseaseStage model events
 */

'use strict';

import {EventEmitter} from 'events';
import DiseaseStage from './disease-stage.model';
var DiseaseStageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DiseaseStageEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  DiseaseStage.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    DiseaseStageEvents.emit(event + ':' + doc._id, doc);
    DiseaseStageEvents.emit(event, doc);
  }
}

export default DiseaseStageEvents;
