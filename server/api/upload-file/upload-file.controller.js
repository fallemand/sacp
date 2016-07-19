/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/upload-files              ->  index
 * POST    /api/upload-files              ->  create
 * GET     /api/upload-files/:id          ->  show
 * PUT     /api/upload-files/:id          ->  update
 * DELETE  /api/upload-files/:id          ->  destroy
 */

'use strict';
var fs = require('fs');

// Creates a new UploadFile in the DB
export function create(req, res) {
    console.log(req.body, req.files);
    var types = ['image/gif', 'image/jpeg', 'image/png', 'image/bmp', 'application/pdf', 'application/x-pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    var entity = req.params.entity,
        id = req.params.id,
        number = req.params.number,
        newPath = '',
        extension,
        files = req.files;
    for(var file in files) {
        if(types.indexOf(files[file].type) > -1) {
            extension = files[file].originalFilename.substring(files[file].originalFilename.indexOf('.')+1, files[file].originalFilename.length);
            newPath = newPath = 'server/files/' + entity + '/' + id + '-' + number + '.' + extension;
            fs.rename(files[file].path, newPath);
        }
    }
    return res.status(200).send('OK');
}
