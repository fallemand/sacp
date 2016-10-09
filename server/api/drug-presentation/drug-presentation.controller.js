/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/drug-presentations              ->  index
 * POST    /api/drug-presentations              ->  create
 * GET     /api/drug-presentations/:id          ->  show
 * PUT     /api/drug-presentations/:id          ->  upsert
 * PATCH   /api/drug-presentations/:id          ->  patch
 * DELETE  /api/drug-presentations/:id          ->  destroy
 */

'use strict';

'use strict';
var utils = require('../../components/utility');
import DrugPresentation from './drug-presentation.model';

// Gets a list of DrugPresentations
export function index(req, res) {
    var options = {
        populate: 'drug'
    };
    return utils.processQuery(DrugPresentation,req.query, options)
        .then(utils.respondWithResult(res))
        .catch(utils.handleError(res));
}

// Gets a single DrugPresentation from the DB
export function show(req, res) {
    return DrugPresentation.findById(req.params.id).exec()
        .then(utils.handleEntityNotFound(res))
        .then(utils.respondWithResult(res))
        .catch(utils.handleError(res));
}

// Creates a new DrugPresentation in the DB
export function create(req, res) {
    return DrugPresentation.create(req.body)
        .then(utils.respondWithResult(res, 201))
        .catch(utils.handleError(res));
}

// Updates an existing DrugPresentation in the DB
export function update(req, res) {
    return DrugPresentation.findById(req.params.id).exec()
        .then(utils.handleEntityNotFound(res))
        .then(utils.saveUpdates(req.body))
        .then(utils.respondWithResult(res))
        .catch(utils.handleError(res));
}

// Deletes a DrugPresentation from the DB
export function destroy(req, res) {
    return DrugPresentation.findById(req.params.id).exec()
        .then(utils.handleEntityNotFound(res))
        .then(utils.removeEntity(res))
        .catch(utils.handleError(res));
}

// Get metadata
export function metadata(req, res) {
    res.json({
        name: 'presentación',
        pluralName: 'presentaciones',
        'fields': [
            {
                'title': 'Código',
                'field' : 'code',
                'type': 'text',
                'columnClass': 'col-md-4',
                'show': true,
                'controlType' : 'input',
                'icon': 'flaticon-bottle-of-chemical-elements',
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
                'title': 'Droga',
                'field': 'drug',
                'type': 'typeahead',
                'descField': 'name',
                'filterDescField': 'name',
                'remoteApi': 'drugs',
                'searchField': 'name',
                'show': true,
                'controlType': 'object',
                'icon': 'fa fa-user-md',
                'columnClass' : 'col-md-3',
                'placeholder' : 'Droga genérica',
                'attributes': {
                    required: true
                },
                'validations': {
                    'required': '',
                    'editable': ''
                }
            },
            {
                'title': 'Nombre',
                'field' : 'name',
                'type': 'text',
                'columnClass': 'col-md-4',
                'show': true,
                'controlType' : 'input',
                'icon': 'flaticon-bottle-of-chemical-elements',
                'attributes' : {
                    required: true,
                    minlength: '4'
                },
                'validations' : {
                    'required' : '',
                    'minlength' : 4
                }
            }
        ]

    });
}

