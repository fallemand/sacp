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
    var metadata = {
        name: 'tratamiento',
        pluralName: 'Tratamientos',
        sections: {
            patient : {
                title: 'Paciente',
                fields: ['patient']
            },
            disease : {
                title: 'Enfermedad',
                fields: ['disease.topographicDiagnosis', 'disease.histologicalDiagnosis', 'disease.stage']
            },
            treatment : {
                title: 'Tratamiento',
                fields: ['treatment.type', 'treatment.schema', 'treatment.expectedDate', 'treatment.height', 'treatment.weight', 'treatment.bodySurface', 'treatment.actualCicle', 'treatment.cyclesQuantity']
            },
            drugs : {
                title: 'Drogas',
                fields: ['drugs']
            },
            confirm : {
                title: 'Confirmar',
                fields: ['observation']
            }
        },
        fields: [
            {
                'title': 'Paciente',
                'field' : 'patient',
                'type': 'typeahead',
                'descField' : 'desc',
                'remoteApi' : 'patients',
                'searchField' : 'name',
                'show': true,
                'controlType' : 'object',
                'icon': 'fa fa-user-md',
                'attributes' : {
                    required: true
                },
                'validations' : {
                    'required' : '',
                    'editable' : ''
                }
            },
            {
                'title': 'Diagnóstico Topográfico',
                'field' : 'disease.topographicDiagnosis',
                'type': 'typeahead',
                'descField' : 'desc',
                'searchField' : 'code',
                'remoteApi' : 'cie10-diseases',
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
                    'max' : '5',
                    'min' : 0
                },
                'validations' : {
                    'required' : '',
                    'number' : '',
                    'max' : '5',
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
                'type': 'date',
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
                'title': 'Drogas',
                'field' : 'drugs',
                'controlType' : 'list',
                fields : [
                    {
                        'title': 'Droga',
                        'field' : 'name',
                        'type': 'text',
                        'show': true,
                        'controlType' : 'input',
                        'icon': 'flaticon-chemistry-lab-instrument-1',
                        'attributes' : {
                            required: true
                        },
                        'validations' : {
                            'required' : ''
                        }
                    },
                    {
                        'title': 'Nombre Comercial',
                        'field' : 'tradeName',
                        'type': 'text',
                        'show': true,
                        'controlType' : 'input',
                        'icon': 'flaticon-medicine-bottle',
                        'attributes' : {
                            required: true
                        },
                        'validations' : {
                            'required' : ''
                        }
                    },
                    {
                        'title': 'Tipo',
                        'field' : 'type',
                        'type': 'select',
                        'show': true,
                        'descField' : 'name',
                        'remoteApi' : 'drug-types',
                        'icon': 'flaticon-open-pill',
                        'controlType' : 'object',
                        'attributes' : {
                            required: true
                        },
                        'validations' : {
                            'required' : ''
                        }
                    },
                    {
                        'title': 'Presentación',
                        'field' : 'presentation',
                        'type': 'text',
                        'show': true,
                        'controlType' : 'input',
                        'icon': 'flaticon-bottle-of-chemical-elements',
                        'attributes' : {
                            required: true
                        },
                        'validations' : {
                            'required' : ''
                        }
                    },
                    {
                        'title': 'Cantidad',
                        'field' : 'quantity',
                        'type': 'number',
                        'show': true,
                        'icon': 'fa fa-sort-numeric-asc',
                        'controlType' : 'input',
                        'attributes' : {
                            required: true
                        },
                        'validations' : {
                            'required' : ''
                        }
                    }
                ]
            },
            {
                'title': 'Observaciones',
                'field' : 'observation',
                'type': 'text',
                'show': true,
                'controlType' : 'textarea',
                'icon': 'fa fa-phone',
                'attributes' : {
                    required: true,
                    rows: 4
                },
                'validations' : {
                    'required' : ''
                }
            }
        ]

    };
    if(Object.keys(req.query).length > 0) {
        for(var attribute in req.query){
            if(attribute == 'field') {
                for(var field in metadata.fields){
                    if(metadata.fields[field].field==req.query[attribute]) {
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
