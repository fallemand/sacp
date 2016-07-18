/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/upload-files              ->  index
 * POST    /api/upload-files              ->  create
 * GET     /api/upload-files/:id          ->  show
 * PUT     /api/upload-files/:id          ->  update
 * DELETE  /api/upload-files/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import UploadFile from './upload-file.model';

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

// Gets a list of UploadFiles
export function index(req, res) {
  return UploadFile.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single UploadFile from the DB
export function show(req, res) {
  return UploadFile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new UploadFile in the DB
export function create(req, res) {
    console.log(req.body, req.files);
    var files = req.files;
    for(var file in files) {
        console.log(files[file]);
    }
    res.status(200).send('OK');

  return UploadFile.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing UploadFile in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return UploadFile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a UploadFile from the DB
export function destroy(req, res) {
  return UploadFile.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
