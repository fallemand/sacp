/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/treatmen-history              ->  index
 * POST    /api/treatmen-history              ->  create
 * GET     /api/treatmen-history/:id          ->  show
 * PUT     /api/treatmen-history/:id          ->  update
 * DELETE  /api/treatmen-history/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import TreatmentHistory from './treatment-history.model';
import * as utils from '../../components/utility';

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

// Gets a list of TreatmentHistorys
export function index(req, res) {
    return utils.processQuery(TreatmentHistory,req.query,{populate: ['history.state','history.user']})
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single TreatmentHistory from the DB
export function show(req, res) {
    return TreatmentHistory.findById(req.params.id)
        .populate('history.state')
        .populate('history.user')
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new TreatmentHistory in the DB
export function create(req, res) {
    return TreatmentHistory.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}

// Updates an existing TreatmentHistory in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    var newHistory = req.body;
    newHistory.user = req.user._id;
    newHistory.date = new Date();
    TreatmentHistory.findById(req.params.id).exec()
        .then(treatmentHistory => {
            if (!treatmentHistory) {
                res.status(404).end();
            }
            treatmentHistory.history.push(newHistory);
            treatmentHistory.save(function (err, entity) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.status(200).json(entity);
            });
        });
}

// Deletes a TreatmentHistory from the DB
export function destroy(req, res) {
    return TreatmentHistory.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// Get metadata
export function metadata(req, res) {
    var metadata = {
        name: 'Historial de Estados',
        pluralName: 'Historial de Estados',
        fields: [
            {
                'title': 'Tratamiento',
                'field': 'treatment',
                'type': 'typeahead',
                'descField': '_id',
                'remoteApi': 'treatments',
                'searchField': '_id',
                'show': true,
                'controlType': 'object',
                'icon': 'fa fa-user-md',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'editable': ''
                }
            },
            {
                'title': 'Historial de Estados',
                'field': 'history',
                'hideInList': true,
                'controlType': 'list',
                sections: {
                    form: {
                        title: 'Revisión Auditoría',
                        fields: ['state', 'observation']
                    }
                },
                fields: [
                    {
                        'title': 'Fecha',
                        'field': 'date',
                        'type': 'date',
                        'show': true,
                        'controlType': 'input',
                        'icon': 'fa fa-calendar',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    },
                    {
                        'title': 'Usuario',
                        'field': 'user',
                        'type': 'typeahead',
                        'descField': 'name',
                        'remoteApi': 'users',
                        'searchField': 'name',
                        'show': true,
                        'controlType': 'object',
                        'icon': 'fa fa-user-md',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': '',
                            'editable': ''
                        }
                    },
                    {
                        'title': 'Estado',
                        'field': 'state',
                        'type': 'select',
                        'show': true,
                        'descField': 'name',
                        'remoteApi': 'treatment-states',
                        'icon': 'fa fa-credit-card',
                        'controlType': 'object',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        },
                        'decorator': {
                            type: 'label',
                            class: {
                                'En Auditoria': 'label-primary',
                                'Aprobado': 'label-success',
                                'Pausado': 'label-warning',
                                'Cancelado': 'label-danger',
                                'En Espera': 'label-default'
                            }
                        }
                    },
                    {
                        'title': 'Observaciones',
                        'field': 'observation',
                        'type': 'text',
                        'show': true,
                        'controlType': 'textarea',
                        'icon': 'fa fa-phone',
                        'attributes': {
                            rows: 4
                        }
                    },
                ]
            }
        ]
    };
    if (Object.keys(req.query).length > 0) {
        for (var attribute in req.query) {
            if (attribute == 'field') {
                for (var field in metadata.fields) {
                    if (metadata.fields[field].field == req.query[attribute]) {
                        res.json(metadata.fields[field]);
                    }
                }
            }
        }
    }
    else {
        res.json(metadata);
    }
}
