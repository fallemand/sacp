/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import Cie10DiseaseEvents from './cie10-disease.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('cie10Disease:' + event, socket);

    Cie10DiseaseEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}


function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    Cie10DiseaseEvents.removeListener(event, listener);
  };
}
