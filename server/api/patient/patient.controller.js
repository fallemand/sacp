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
var utils = require('../../components/utility');

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
        if (err instanceof Error && err.name !== 'ValidationError') {
            res.status(statusCode).send({message: err.message});
        }
        else {
            res.status(statusCode).send(err);
        }
    };
}

// Gets a list of Patients
export function index(req, res) {
    var options = {
        populate: ['agreementType', 'registeredBy']
    };
    return utils.processQuery(Patient,req.query,options)
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a list of Patients of that user
export function indexUser(req, res) {
    var options = {
        populate: ['agreementType', 'registeredBy']
    };
    req.query.registeredBy = req.user._id;
    return utils.processQuery(Patient,req.query,options)
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Patient from the DB
export function show(req, res) {
    return Patient.findById(req.params.id)
        .populate('agreementType')
        .populate('registeredBy')
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Patient in the DB
export function create(req, res) {
    req.body.registerDate = new Date();
    req.body.registeredBy = req.user._id;
    return Patient.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing Patient in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    if (req.body.registerDate) {
        delete req.body.registerDate;
    }
    if (req.user.role !== 'admin' && req.user._id != req.body.registeredBy) {
        return res.status(403).json({message: "No puedes modificar este paciente porque fue registrado por otro médico. Solicita el cambio al administrador"});
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
        .then(patient => {
            if (req.user.role !== 'admin' && req.user._id.toString() !== patient.registeredBy.toString()) {
                throw new Error("No puedes eliminar este paciente porque fue registrado por otro médico.");
            }
            return patient;
        })
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
                'columnClass': 'col-md-1 mw-100',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-user-md',
                'link' : '/profile/patient',
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
                'shortTitle' : 'TC',
                'field' : 'agreementType',
                'controlType' : 'object',
                'columnClass': 'col-md-1',
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
                'columnClass': 'col-md-1',
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
                'shortTitle' : 'Nº O.S.',
                'field' : 'socialInsuranceNumber',
                'columnClass': 'col-md-1',
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
                'columnClass': 'col-md-1',
                'show': true,
                'hideInList' : true,
                'controlType' : 'input',
                'icon': 'fa fa-home'
            },
            {
                'title': 'Teléfono',
                'field' : 'phone',
                'columnClass': 'col-md-1',
                'type': 'tel',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-phone'
            },
            {
                'title': 'Email',
                'field' : 'email',
                'type': 'email',
                'columnClass': 'col-md-2',
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
                'columnClass': 'col-md-1',
                'type': 'tel',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-phone'
            },
            {
                'title': 'Fecha Registro',
                'field' : 'registerDate',
                'type': 'date',
                'columnClass': 'col-md-1 mw-100',
                'show': false,
                'controlType' : 'input',
                'icon': 'fa fa-calendar',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            }
        ]

    });
}
