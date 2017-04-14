'use strict';

var express = require('express');
var controller = require('./report.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/:report/:id', auth.isAuthenticated(), controller.getReport);

module.exports = router;
