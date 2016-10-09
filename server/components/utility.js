/**
 * Created by falle on 25/05/2016.
 */

import _ from 'lodash';

'use strict';
export function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

export function saveUpdates(updates) {
    return function (entity) {
        var updated = _.merge(entity, updates);
        return updated.save()
            .then(updated => {
                return updated;
            });
    };
}

export function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

export function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

export function handleError(res, statusCode) {
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

export function processQuery(model, query, options) {
    options = options || {};
    query.sorting = (query.sorting) ? JSON.parse(query.sorting) : {};
    options.sort = (Object.keys(query.sorting).length > 0) ? query.sorting : options.sort;
    options.page = (query.page) ? parseInt(query.page) : 1;
    options.limit = (query.count) ? parseInt(query.count) : 50;
    var populateFilter;

    if (query.filter) {
        var filters = JSON.parse(query.filter);
        for (var filter in filters) {
            if (filters[filter] && filters[filter] !== '') {
                //I want to filter by an inner attribute ex: patient.name
                if (filter.indexOf('.') > -1) {
                    var field = filter.substr(0, filter.indexOf('.'));
                    var descField = filter.substr(filter.indexOf('.') + 1, filter.length);
                    var populate = {};
                    populate.path = field;
                    populate.match = {};
                    if(descField === '_id') {
                        populate.match[descField] = filters[filter];
                    }
                    else {
                        populate.match[descField] = new RegExp(filters[filter], 'i');
                    }

                    options.populate.push(populate);
                    populateFilter = field;
                }
                else {
                    //I want to filter by OR
                    if(filter === 'or') {
                        var orFilters = filters[filter].replace('[','').replace(']','');
                        orFilters = orFilters.split('&');
                        var array = [];

                        for(var orFilter in orFilters) {
                            var object = {};
                            var key =  orFilters[orFilter].substring(0,  orFilters[orFilter].indexOf('='));
                            var value =  orFilters[orFilter].substring(orFilters[orFilter].indexOf('=') + 1,  orFilters[orFilter].length);
                            object[key] = new RegExp(value, 'i');
                            array.push(object);
                        }
                        query.$or = array;
                    }
                    //Just filter by attribute
                    else {
                        query[filter] = new RegExp(filters[filter], 'i');
                    }
                }
            }
        }
    }

    delete query.page;
    delete query.count;
    delete query.sorting;
    delete query.filter;

    if (!populateFilter) {
        return model.paginate(query, options);
    }
    else {
        return model.paginate(query, options).then(function(documents) {
            documents.docs = documents.docs.filter(function (document) {
                return document[populateFilter];
            });
            return documents;
        });
    }
}
