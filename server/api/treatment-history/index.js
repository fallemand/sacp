'use strict';

var express = require('express');
var controller = require('./treatment-history.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/metadata', auth.isAuthenticated(), controller.metadata);
router.get('/:id', auth.isAuthenticated(), controller.show);
// router.post('/', controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
