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
import TreatmentHistory from '../treatment-history/treatment-history.model';
import AgreementType from '../agreement-type/agreement-type.model';
import * as utils from '../../components/utility';
import * as mailUtils from '../../components/mails/mail-utils';

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

// Gets a list of Treatments
export function index(req, res) {
    var options = {
        populate: [{
            path: 'doctor',
            select: '-salt -recoverToken -recoverExpire -provider -password'
        }, 'patient', 'diseaseStage', 'diseaseTopographicDiagnosis', 'treatmentType', 'drugs.type', 'state'],
        sort: {'lastUpdateDate' : 'desc'}
    };
    return utils.processQuery(Treatment,req.query,options)
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a list of Treatments of that user
export function indexUser(req, res) {
    var options = {
        populate: ['patient', {
            path: 'doctor',
            select: '-salt -recoverToken -recoverExpire -provider -password'
        }, 'diseaseStage', 'diseaseTopographicDiagnosis', 'treatmentType', 'drugs.type', 'state'],
        sort: {'lastUpdateDate' : 'desc'}
    };
    req.query.doctor = req.user._id;
    return utils.processQuery(Treatment,req.query,options)
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Treatment from the DB
export function show(req, res) {
    return Treatment.findById(req.params.id)
        .populate('patient')
        .populate({
            path: 'doctor',
            select: '-salt -recoverToken -recoverExpire -provider -password'
        })
        .populate('diseaseStage')
        .populate('diseaseTopographicDiagnosis')
        .populate('treatmentType')
        .populate('drugs.type')
        .populate('drugsStandardized.presentation')
        .populate('drugsStandardized.drug')
        .populate('state')
        .exec(function (err, treatment) {
            AgreementType.populate(treatment, {
                path: 'patient.agreementType',
                select: 'name'
            }, function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
                else {
                    return res.status(200).send(treatment);
                }
            });
        });
}

// Creates a new Treatment in the DB
export function create(req, res) {
    req.body.state = 'EA';
    req.body.doctor = req.user._id;
    req.body.createdDate = new Date();
    req.body.lastUpdateDate = new Date();
    var comment = 'Carga Inicial';
    Treatment.create(req.body, function (err, treatment) {
        if (err) {
            return res.status(500).send(err);
        }
        var treatmentHistory = {
            _id: treatment._id,
            history: [
                {
                    date: new Date(),
                    state: 'EA',
                    user: req.user._id,
                    observation: comment
                }
            ]
        };
        TreatmentHistory.create(treatmentHistory, function (err) {
            if (err) {
                Treatment.remove({_id: treatment._id});
                return res.status(500).send(err);
            }
            return res.status(200).json(treatment);
        });
    });
}

// Updates an existing Treatment in the DB
export function update(req, res) {
    var comment = req.body.comment;
    delete req.body.comment;
    var treatment = req.body;
    if (!treatment.state) {
        treatment.state = 'EA';
    }
    if (treatment._id) {
        delete treatment._id;
    }
    if (treatment.doctor._id) {
        delete treatment.doctor._id;
    }
    treatment.lastUpdateDate = new Date();
    Treatment.findById(req.params.id).exec()
        .then(entity => {
            if (!entity) {
                res.status(404).end();
            }
            if (entity.state == 'AP') {
                return res.status(500).send('No se puede modificar un tratamiento aprobado');
            }
            if (entity.state == 'CA') {
                return res.status(500).send('No se puede modificar un tratamiento cancelado');
            }
            if (!entity.doctor.equals(req.user._id)) {
                return res.status(500).send('El tratamiento que quieres modificar no te pertenece');
            }
            var updated = _.merge(entity, treatment);
            updated.save(function (err, treatment) {
                if (err) {
                    return res.status(500).send(err);
                }
                TreatmentHistory.findById(treatment._id, function (err, history) {
                    if (err) {
                        entity.save();
                        return res.status(500).send(err);
                    }
                    var newHistory = {
                        date: new Date(),
                        user: req.user._id,
                        state: 'EA',
                        observation: comment
                    };
                    history.history.push(newHistory);
                    history.save(function (err) {
                        if (err) {
                            entity.save();
                            return res.status(500).send(err);
                        }
                        return res.status(200).json(treatment);
                    });
                });
            })
        });
}

/**
 * Change a users password
 */
export function changeStatus(req, res, next) {
    var newStatus = req.body;

    return Treatment.findById(req.params.id)
        .populate('doctor', 'email name')
        .populate('patient', 'name')
        .exec()
        .then(treatment => {
            if (treatment.state == 'AP' && newStatus._id !== 'CA') {
                return res.status(500).send('No se puede modificar un tratamiento aprobado');
            }
            if (treatment.state == 'CA') {
                return res.status(500).send('No se puede modificar un tratamiento cancelado');
            }
            treatment.state = newStatus._id;
                treatment.save(function(err) {
                    if(err) {
                        return res.status(500).send(err)
                    }
                    if(req.user.role === 'admin') {
                        mailUtils.sendMail('treatment-change', treatment, treatment.doctor.email);
                    }
                    return res.status(204).end();
                });
        });
}

// Deletes a Treatment from the DB
export function destroy(req, res) {
    return Treatment.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
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

// Get metadata
export function metadata(req, res) {
    var metadata = {
        name: 'tratamiento',
        pluralName: 'Tratamientos',
        sections: {
            patient: {
                title: 'Paciente',
                fields: ['patient']
            },
            disease: {
                title: 'Enfermedad',
                fields: ['diseaseTopographicDiagnosis', 'diseaseHistologicalDiagnosis', 'diseaseStage']
            },
            treatment: {
                title: 'Tratamiento',
                fields: ['treatmentType', 'treatmentSchema', 'treatmentExpectedDate', 'treatmentHeight',  'treatmentActualCicle', 'treatmentWeight', 'treatmentCyclesQuantity', 'treatmentBodySurface']
            },
            drugs: {
                title: 'Drogas',
                fields: ['drugs']
            },
            drugsStandardized: {
                title: 'Drogas',
                fields: ['drugsStandardized']
            },
            confirm: {
                title: 'Confirmar',
                fields: ['observation']
            }
        },
        fields: [
            {
                'title': 'Id',
                'field': '_id',
                'type': 'input',
                'show': false,
                'hideInList' : false,
                'controlType': 'input',
                'icon': 'fa fa-calendar',
                'columnClass' : 'col-md-1 mw-80'
            },
            {
                'title': 'Creado',
                'field': 'createdDate',
                'type': 'date',
                'show': true,
                'controlType': 'input',
                'icon': 'fa fa-calendar',
                'columnClass' : 'col-md-1'
            },
            {
                'title': 'Última Modificación',
                'shortTitle' : 'Última Mod.',
                'field': 'lastUpdateDate',
                'type': 'date',
                'show': true,
                'controlType': 'input',
                'icon': 'fa fa-calendar',
                'columnClass' : 'col-md-1 mw-110'
            },
            {
                'title': 'Paciente',
                'field': 'patient',
                'type': 'typeahead',
                'descField': 'desc',
                'filterDescField': 'name',
                'remoteApi': 'patients',
                'link' : '/profile/patient',
                'searchField': 'name',
                'searchFieldExtra' : 'dni',
                'show': true,
                'controlType': 'object',
                'icon': 'fa fa-user-md',
                'columnClass' : 'col-md-1',
                'placeholder' : 'Ingrese el Nombre o el DNI del paciente',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'editable': ''
                }
            },
            {
                'title': 'Médico',
                'field': 'doctor',
                'type': 'typeahead',
                'descField': 'name',
                'remoteApi': 'users',
                'searchField': 'name',
                'link' : '/profile/doctor',
                'show': true,
                'controlType': 'object',
                'icon': 'fa fa-user-md',
                'columnClass' : 'col-md-1',
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
                'controlType': 'object',
                'columnClass' : 'col-md-1',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'number': ''
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
                'title': 'Diagnóstico Topográfico',
                'shortTitle' : 'Diag. Topográfico',
                'field': 'diseaseTopographicDiagnosis',
                'type': 'typeahead',
                'descField': 'desc',
                'filterDescField': 'name',
                'searchField': 'name',
                'searchFieldExtra' : '_id',
                'remoteApi': 'cie10-diseases',
                'show': true,
                'hideInList': true,
                'placeholder': 'Comience a escribir el código CIE10 o la descripción',
                'controlType': 'object',
                'icon': 'fa fa-user-md',
                'columnClass' : 'col-md-3',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'editable': ''
                }
            },
            {
                'title': 'Diagnóstico Histológico',
                'field': 'diseaseHistologicalDiagnosis',
                'controlType': 'input',
                'type': 'text',
                'show': true,
                'iconText': 'TC',
                'hideInList': true,
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Estadío',
                'field': 'diseaseStage',
                'type': 'select',
                'show': true,
                'descField': 'name',
                'remoteApi': 'disease-stages',
                'icon': 'flaticon-open-pill',
                'controlType': 'object',
                'columnClass' : 'col-md-1',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Tipo de Tratamiento',
                'field': 'treatmentType',
                'type': 'select',
                'show': true,
                'tabIndex' : 1,
                'descField': 'name',
                'hideInList': true,
                'remoteApi': 'treatment-types',
                'icon': 'fa fa-credit-card',
                'controlType': 'object',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'number': ''
                }
            },
            {
                'title': 'Esquema',
                'field': 'treatmentSchema',
                'hideInList': true,
                'type': 'text',
                'tabIndex' : 5,
                'show': true,
                'controlType': 'input',
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Fecha probable de tratamiento',
                'shortTitle' : 'Fecha PT',
                'field': 'treatmentExpectedDate',
                'type': 'date',
                'tabIndex' : 2,
                'show': true,
                'controlType': 'input',
                'icon': 'fa fa-home',
                'columnClass' : 'col-md-1 mw-80',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'date' : ''
                }
            },
            {
                'title': 'Altura',
                'field': 'treatmentHeight',
                'placeholder' : 'En cm. EJ: 180',
                'type': 'number',
                'tabIndex' : 6,
                'show': true,
                'controlType': 'input',
                'hideInList': true,
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Ciclo Actual',
                'field': 'treatmentActualCicle',
                'type': 'text',
                'show': true,
                'tabIndex' : 3,
                'hideInList': true,
                'controlType': 'input',
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Peso',
                'field': 'treatmentWeight',
                'placeholder' : 'En kg. EJ: 80',
                'type': 'number',
                'show': true,
                'controlType': 'input',
                'tabIndex' : 7,
                'hideInList': true,
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Cantidad de Ciclos',
                'field': 'treatmentCyclesQuantity',
                'type': 'text',
                'hideInList': true,
                'show': true,
                'tabIndex' : 4,
                'controlType': 'input',
                'icon': 'fa fa-home',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': ''
                }
            },
            {
                'title': 'Superficie Corporal',
                'field': 'treatmentBodySurface',
                'placeholder': 'Este valor se calculará automáticamente',
                'type': 'text',
                'show': true,
                'disabled' : true,
                'controlType': 'input',
                'hideInList': true,
                'icon': 'fa fa-home'
            },
            {
                'title': 'Drogas',
                'field': 'drugs',
                name: 'item',
                'hideInList': true,
                'controlType': 'list',
                fields: [
                    {
                        'title': 'Droga',
                        'field': 'name',
                        'type': 'text',
                        'show': true,
                        'controlType': 'input',
                        'icon': 'flaticon-chemistry-lab-instrument-1',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    },
                    {
                        'title': 'Nombre Comercial',
                        'field': 'tradeName',
                        'type': 'text',
                        'show': true,
                        'controlType': 'input',
                        'icon': 'flaticon-medicine-bottle'
                    },
                    {
                        'title': 'Tipo',
                        'field': 'type',
                        'type': 'select',
                        'show': true,
                        'descField': 'name',
                        'remoteApi': 'drug-types',
                        'icon': 'flaticon-open-pill',
                        'controlType': 'object',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    },
                    {
                        'title': 'Presentación',
                        'field': 'presentation',
                        'type': 'text',
                        'show': true,
                        'controlType': 'input',
                        'icon': 'flaticon-bottle-of-chemical-elements',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    },
                    {
                        'title': 'Cantidad',
                        'field': 'quantity',
                        'type': 'number',
                        'show': true,
                        'icon': 'fa fa-sort-numeric-asc',
                        'controlType': 'input',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    }
                ]
            },
            {
                'title': 'Drogas',
                'field': 'drugsStandardized',
                name: 'item',
                'hideInList': true,
                'controlType': 'list',
                fields: [
                    {
                        'title': 'Droga',
                        'field': 'drug',
                        'type': 'typeahead',
                        'searchField': 'name',
                        'show': true,
                        'descField': 'name',
                        'remoteApi': 'drugs',
                        'icon': 'flaticon-open-pill',
                        'controlType': 'object',
                        'attributes': {
                            'typeahead-on-select' : 'vm.loadNext($item, \'presentation\', \'drug-presentations\', \'drug\')', //Load next component
                            required: true
                        },
                        'validations': {
                            'required': '',
                            'editable': ''
                        }
                    },
                    {
                        'title': 'Presentación',
                        'field': 'presentation',
                        'type': 'select',
                        'show': true,
                        'loadData' : false, //Do not load data at first.
                        'descField': 'name',
                        'remoteApi': 'drug-presentations',
                        'icon': 'flaticon-open-pill',
                        'controlType': 'object',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    },
                    {
                        'title': 'Cantidad',
                        'field': 'quantity',
                        'type': 'number',
                        'show': true,
                        'icon': 'fa fa-sort-numeric-asc',
                        'controlType': 'input',
                        'attributes': {
                            required: true
                        },
                        'validations': {
                            'required': ''
                        }
                    }
                ]
            },
            {
                'title': 'Observaciones',
                'field': 'observation',
                'placeholder' : 'Resumen de historial clínica, o cualquier comentario que considere conveniente',
                'hideInList': true,
                'type': 'text',
                'show': true,
                'controlType': 'textarea',
                'icon': 'fa fa-phone',
                'attributes': {
                    required: true,
                    rows: 2
                },
                'validations': {
                    'required': ''
                }
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
