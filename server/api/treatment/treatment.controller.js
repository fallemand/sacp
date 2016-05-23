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
            }
        ],
        'fields': [

            {
                'title': 'Diagnóstico Topográfico',
                'field' : 'disease.topographicDiagnosis',
                'type': 'typeAhead',
                'descField' : 'name',
                'remoteApi' : 'agreement-types',
                'show': true,
                'controlType' : 'object',
                'icon': 'fa fa-user-md',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Diagnóstico Histológico',
                'field' : 'disease.histologicalDiagnosis',
                'controlType' : 'input',
                'type': 'text',
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
                'title': 'Estadío',
                'field' : 'disease.stage',
                'type': 'number',
                'show': true,
                'iconText': 'DNI',
                'controlType' : 'input',
                'attributes' : {
                    required: true,
                    'max' : '6',
                    'min' : 0
                },
                'validations' : {
                    'required' : '',
                    'number' : '',
                    'max' : '6',
                    'min' : 0
                }
            },
            {
                'title': 'Tipo de Tratamiento',
                'field' : 'treatment.type',
                'type': 'select',
                'show': true,
                'descField' : 'name',
                'remoteApi' : 'treatment-types',
                'icon': 'fa fa-credit-card',
                'controlType' : 'object',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : '',
                    'number' : ''
                }
            },
            {
                'title': 'Esquema',
                'field' : 'treatment.schema',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-home',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Fecha probable de tratamiento',
                'field' : 'treatment.expectedDate',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-home',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Altura',
                'field' : 'treatment.height',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-home',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Peso',
                'field' : 'treatment.weight',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-home',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Superficie Corporal',
                'field' : 'treatment.bodySurface',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-home',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Ciclo Actual',
                'field' : 'treatment.actualCicle',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-home',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Cantidad de Ciclos',
                'field' : 'treatment.cyclesQuantity',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-home',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Droga',
                'field' : 'drugs.name',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-envelope',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Nombre Comercial',
                'field' : 'drugs.tradeName',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-envelope',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Presentación',
                'field' : 'drugs.presentation',
                'type': 'text',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-envelope',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Tipo',
                'field' : 'drugs.type',
                'type': 'select',
                'show': true,
                'descField' : 'name',
                'remoteApi' : 'drug-types',
                'icon': 'fa fa-credit-card',
                'controlType' : 'object',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Cantidad',
                'field' : 'drugs.quantity',
                'type': 'text',
                'show': true,
                'icon': 'fa fa-credit-card',
                'controlType' : 'input',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : ''
                }
            },
            {
                'title': 'Observaciones',
                'field' : 'observation',
                'type': 'tel',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-phone',
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
