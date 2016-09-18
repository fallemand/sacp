'use strict';

var express = require('express');
var controller = require('./report.controller');

var router = express.Router();

router.get('/:report/:id', controller.getReport);

module.exports = router;
