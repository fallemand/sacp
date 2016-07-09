/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/agreement-types              ->  index
 * POST    /api/agreement-types              ->  create
 * GET     /api/agreement-types/:id          ->  show
 * PUT     /api/agreement-types/:id          ->  update
 * DELETE  /api/agreement-types/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import AgreementType from './agreement-type.model';
import * as utils from '../../components/utility';

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

// Gets a list of AgreementTypes
export function index(req, res) {
    return utils.processQuery(AgreementType,req.query,{})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single AgreementType from the DB
export function show(req, res) {
  return AgreementType.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new AgreementType in the DB
export function create(req, res) {
  return AgreementType.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing AgreementType in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return AgreementType.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a AgreementType from the DB
export function destroy(req, res) {
  return AgreementType.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
