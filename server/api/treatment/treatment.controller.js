/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/treatments              ->  index
 * POST    /api/treatments              ->  create
 * GET     /api/treatments/:id          ->  show
 * PUT     /api/treatments/:id          ->  update
 * DELETE  /api/treatments/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Treatment from './treatment.model';

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

// Gets a list of Treatments
export function index(req, res) {
  return Treatment.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Treatment from the DB
export function show(req, res) {
  return Treatment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Treatment in the DB
export function create(req, res) {
  return Treatment.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Treatment in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Treatment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Treatment from the DB
export function destroy(req, res) {
  return Treatment.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Get metadata
export function metadata(req, res) {
    res.json({
        name: 'tratamiento',
        pluralName: 'Tratamientos',
        sections: [
            {
                name: 'Paciente',
                fields: { 'patient'}
            },
            {
                name: 'Enfermedad',
                fields: { 'disease'}
            },
            {
                name: 'Tratamiento',
                fields: { 'treatments'}
            },
            {
                name: 'Drogas',
                fields: { 'drugs'}
            },
            {
                name: 'Confirmar',
                fields: { 'observation'}
            },
        ],
        'fields': [

            {
                'title': 'Nombre',
                'field' : 'name',
                'type': 'string',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-user-md',
                'attributes' : {
                    required: true,
                    minlength: '4'
                },
                'validations' : {
                    'required' : '',
                    'minlength' : 4
                }
            },
            {
                'title': 'Tipo Convenio',
                'field' : 'agreementType',
                'controlType' : 'object',
                'descField' : 'name',
                'remoteApi' : 'agreement-types',
                'type': 'select',
                'show': true,
                'iconText': 'TC',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'DNI',
                'field' : 'dni',
                'type': 'number',
                'show': true,
                'iconText': 'DNI',
                'controlType' : 'input',
                'attributes' : {
                    required: true,
                    'mongoose-error' : ''
                },
                'validations' : {
                    'required' : '',
                    'number' : '',
                    'mongoose' : ''
                }
            },
            {
                'title': 'Nº Obra Social',
                'field' : 'socialInsuranceNumber',
                'type': 'number',
                'show': true,
                'icon': 'fa fa-credit-card',
                'controlType' : 'input',
                'attributes' : {
                    required: true,
                    'mongoose-error' : ''
                },
                'validations' : {
                    'required' : '',
                    'number' : '',
                    'mongoose' : ''
                }
            },
            {
                'title': 'Dirección',
                'field' : 'address',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-home'
            },
            {
                'title': 'Teléfono',
                'field' : 'phone',
                'type': 'tel',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-phone'
            },
            {
                'title': 'Email',
                'field' : 'email',
                'type': 'email',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-envelope',
                'validations' : {
                    'email' : ''
                }
            },
            {
                'title': 'Celular',
                'field' : 'cellphone',
                'type': 'tel',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-phone'
            }
        ]

    });
}
