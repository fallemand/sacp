/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/treatment-history', require('./api/treatment-history'));
  app.use('/api/treatment-states', require('./api/treatment-state'));
  app.use('/api/cie10-diseases', require('./api/cie10-disease'));
  app.use('/api/drug-types', require('./api/drug-type'));
  app.use('/api/treatment-types', require('./api/treatment-type'));
  app.use('/api/treatments', require('./api/treatment'));
  app.use('/api/agreement-types', require('./api/agreement-type'));
  app.use('/api/patients', require('./api/patient'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
