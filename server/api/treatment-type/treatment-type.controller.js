/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/treatment-types              ->  index
 * POST    /api/treatment-types              ->  create
 * GET     /api/treatment-types/:id          ->  show
 * PUT     /api/treatment-types/:id          ->  update
 * DELETE  /api/treatment-types/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import TreatmentType from './treatment-type.model';

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

// Gets a list of TreatmentTypes
export function index(req, res) {
  return TreatmentType.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single TreatmentType from the DB
export function show(req, res) {
  return TreatmentType.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new TreatmentType in the DB
export function create(req, res) {
  return TreatmentType.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing TreatmentType in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return TreatmentType.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a TreatmentType from the DB
export function destroy(req, res) {
  return TreatmentType.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
