/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/cie10-diseases              ->  index
 * POST    /api/cie10-diseases              ->  create
 * GET     /api/cie10-diseases/:id          ->  show
 * PUT     /api/cie10-diseases/:id          ->  update
 * DELETE  /api/cie10-diseases/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Cie10Disease from './cie10-disease.model';

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

// Gets a list of Cie10Diseases
export function index(req, res) {
    return Cie10Disease.find(processQuery(req.query)).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function processQuery(query) {
    var result = {};
    for(var attribute in query){
        var regexp = new RegExp(query[attribute]);
        result[attribute] = regexp;
    }
    return result;
}

// Gets a single Cie10Disease from the DB
export function show(req, res) {
  return Cie10Disease.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Cie10Disease in the DB
export function create(req, res) {
  return Cie10Disease.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Cie10Disease in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Cie10Disease.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Cie10Disease from the DB
export function destroy(req, res) {
  return Cie10Disease.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
