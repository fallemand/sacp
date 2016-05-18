/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/patients              ->  index
 * POST    /api/patients              ->  create
 * GET     /api/patients/:id          ->  show
 * PUT     /api/patients/:id          ->  update
 * DELETE  /api/patients/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Patient from './patient.model';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function saveUpdates(updates) {
    return function (entity) {
        var updated = _.merge(entity, updates);
        return updated.save()
            .then(updated => {
                return updated;
            });
    };
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Patients
export function index(req, res) {
    return Patient.find()
        .populate('agreementType')
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Patient from the DB
export function show(req, res) {
    return Patient.findById(req.params.id)
        .populate('agreementType')
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Patient in the DB
export function create(req, res) {
    return Patient.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing Patient in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return Patient.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Patient from the DB
export function destroy(req, res) {
    return Patient.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

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
                'icon': 'fa fa-user-md',
                'attributes' : {
                    required: true,
                    minlength: '4'
                },
                'validations' : ['required','minlength']
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
                'validations' : ['required']
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
                'validations' : ['required', 'number', 'mongoose']
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
                'validations' : ['required', 'number', 'mongoose']
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
                'validations' : ['email']
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
