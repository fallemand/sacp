'use strict';

var express = require('express');
var controller = require('./upload-file.controller');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty({ uploadDir: 'server/files' });

var router = express.Router();

router.post('/', multipartyMiddleware, controller.create);

module.exports = router;
