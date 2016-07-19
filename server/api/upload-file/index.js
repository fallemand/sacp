'use strict';

var express = require('express');
var controller = require('./upload-file.controller');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty({ uploadDir: 'server/files/temp' });

var router = express.Router();

router.post('/:entity/:id/:number', multipartyMiddleware, controller.create);

module.exports = router;
