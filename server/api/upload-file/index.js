'use strict';

var express = require('express');
var controller = require('./upload-file.controller');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty({ uploadDir: 'client/files/temp' });
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/:entity/:id/:number', multipartyMiddleware, controller.create);
router.get('/:entity/:id', auth.isAuthenticated(), controller.getFiles);
router.del('/:entity/:file', auth.isAuthenticated(), controller.removeFile);

module.exports = router;
