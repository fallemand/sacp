/**
 * Created by falle on 25/05/2016.
 */

'use strict';

export function processQuery(model, query, options) {
    options.sort = (query.sorting) ? JSON.parse(query.sorting) : options.sort;
    options.page = (query.page) ? parseInt(query.page) : 1;
    options.limit = (query.count) ? parseInt(query.count) : 50;

    if(query.filter) {
        var filters = JSON.parse(query.filter);
        for(var filter in filters) {
            if(filters[filter] && filters[filter] !== '') {
                if(filter.indexOf('.') > -1) {
                    var field = filter.substr(0, filter.indexOf('.'));
                    var descField = filter.substr(filter.indexOf('.') + 1, filter.length);
                    console.log(field);
                    console.log(descField);
                    console.log(filters[filter]);
                    var populate = {
                        path: field,
                        match: {}
                    };
                    populate.match[descField] = new RegExp(filters[filter], 'i');
                    options.populate = populate;
                }
                else {
                    query[filter] = new RegExp(filters[filter], 'i');
                }
            }
        }
    }

    delete query.page;
    delete query.count;
    delete query.sorting;
    delete query.filter;

    return model.paginate(query, options);
}
