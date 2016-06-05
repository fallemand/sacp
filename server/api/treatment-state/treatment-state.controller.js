/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/treatment-states              ->  index
 * POST    /api/treatment-states              ->  create
 * GET     /api/treatment-states/:id          ->  show
 * PUT     /api/treatment-states/:id          ->  update
 * DELETE  /api/treatment-states/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import TreatmentState from './treatment-state.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of TreatmentStates
export function index(req, res) {
  return TreatmentState.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single TreatmentState from the DB
export function show(req, res) {
  return TreatmentState.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new TreatmentState in the DB
export function create(req, res) {
  return TreatmentState.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing TreatmentState in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return TreatmentState.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a TreatmentState from the DB
export function destroy(req, res) {
  return TreatmentState.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


// Get metadata
// Get metadata
export function metadata(req, res) {
    res.json({
        name: 'paciente',
        pluralName: 'pacientes',
        'fields': [

            {
                'title': 'Nombre',
                'field' : 'name',
                'type': 'string',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-user-md'
            }]
    });
}
