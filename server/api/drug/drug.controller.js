/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/drugs              ->  index
 * POST    /api/drugs              ->  create
 * GET     /api/drugs/:id          ->  show
 * PUT     /api/drugs/:id          ->  upsert
 * PATCH   /api/drugs/:id          ->  patch
 * DELETE  /api/drugs/:id          ->  destroy
 */

'use strict';
var utils = require('../../components/utility');
import Drug from './drug.model';


// Gets a list of Drugs
export function index(req, res) {
    return utils.processQuery(Drug,req.query)
        .then(utils.respondWithResult(res))
        .catch(utils.handleError(res));
}

// Gets a single Drug from the DB
export function show(req, res) {
    return Drug.findById(req.params.id).exec()
        .then(utils.handleEntityNotFound(res))
        .then(utils.respondWithResult(res))
        .catch(utils.handleError(res));
}

// Creates a new Drug in the DB
export function create(req, res) {
    return Drug.create(req.body)
        .then(utils.respondWithResult(res, 201))
        .catch(utils.handleError(res));
}

// Updates an existing Drug in the DB
export function update(req, res) {
    return Drug.findById(req.params.id).exec()
        .then(utils.handleEntityNotFound(res))
        .then(utils.saveUpdates(req.body))
        .then(utils.respondWithResult(res))
        .catch(utils.handleError(res));
}

// Deletes a Drug from the DB
export function destroy(req, res) {
    return Drug.findById(req.params.id).exec()
        .then(utils.handleEntityNotFound(res))
        .then(utils.removeEntity(res))
        .catch(utils.handleError(res));
}

// Get metadata
export function metadata(req, res) {
    res.json({
        name: 'droga',
        pluralName: 'drogas',
        'fields': [
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

