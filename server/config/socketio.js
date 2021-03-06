/**
 * Socket.io configuration
 */
'use strict';

import config from './environment';

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/drug-presentation/drug-presentation.socket').register(socket);
  require('../api/drug/drug.socket').register(socket);
  require('../api/report/report.socket').register(socket);
  require('../api/upload-file/upload-file.socket').register(socket);
  require('../api/prescription/prescription.socket').register(socket);
  require('../api/disease-stage/disease-stage.socket').register(socket);
  require('../api/treatment-history/treatment-history.socket').register(socket);
  require('../api/treatment-state/treatment-state.socket').register(socket);
  require('../api/cie10-disease/cie10-disease.socket').register(socket);
  require('../api/drug-type/drug-type.socket').register(socket);
  require('../api/treatment-type/treatment-type.socket').register(socket);
  require('../api/treatment/treatment.socket').register(socket);
  require('../api/agreement-type/agreement-type.socket').register(socket);
  require('../api/patient/patient.socket').register(socket);

}

export default function(socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function(socket) {
    socket.address = socket.request.connection.remoteAddress +
      ':' + socket.request.connection.remotePort;

    socket.connectedAt = new Date();

    socket.log = function(...data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
    };

    // Call onDisconnect.
    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });

    // Call onConnect.
    onConnect(socket);
    socket.log('CONNECTED');
  });
}
