'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import * as utils from '../../components/utility';
import * as mailUtils from '../../components/mails/mail-utils';
var crypto = require('crypto');

function validationError(res, statusCode) {
    statusCode = statusCode || 422;
    return function (err) {
        res.status(statusCode).json(err);
    }
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        if (err instanceof Error) {
            err = {message: err.message};
        }
        res.status(statusCode).send(err);
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function saveUpdates(updates) {
    return function (entity) {
        var updated = _.merge(entity, updates);
        return updated.save()
            .then(updated => {
                return updated;
            });
    };
}

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
    var options = {
        select: '-salt -recoverToken -recoverExpire -password'
    };
    utils.processQuery(User, req.query, options)
        .then(function (result) {
            res.status(200).json(result);
        })
        .catch(handleError(res));
}

/**
 * Count list of users
 * restriction: 'admin'
 */
export function count(req, res) {
    return User.count(req.query).exec()
        .then(count => {
            res.status(200).json(count);
        })
        .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save()
        .then(function (user) {
            var token = jwt.sign({_id: user._id}, config.secrets.session, {
                expiresIn: 60 * 60 * 5
            });
            res.json({token});
        })
        .catch(validationError(res));
}

// Updates an existing Patient in the DB
export function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    return User.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
    var userId = req.params.id;

    return User.findById(userId).exec()
        .then(user => {
            if (!user) {
                return res.status(404).end();
            }
            res.json(user.profile);
        })
        .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
    return User.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    return User.findById(userId).exec()
        .then(user => {
            if (user.authenticate(oldPass)) {
                user.password = newPass;
                return user.save()
                    .then(() => {
                        res.status(204).end();
                    })
                    .catch(validationError(res));
            } else {
                return res.status(403).end();
            }
        });
}

/**
 * Activate User
 */
export function activate(req, res) {
    return User.findById(req.params.id).exec()
        .then(user => {
            user.active = true;
            return user.save()
                .then(() => {
                    var context = {
                        user: user,
                        unsubscribeHash: user._id
                    };
                    try {
                        mailUtils.sendMail('activation', context, user.email);
                    } catch (e) {
                        console.log(e);
                    }
                    res.status(204).end();
                })
                .catch(validationError(res));
        });
}

/**
 * Recover: Generate Token User
 */
export function recover(req, res) {
    return User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if (!user) {
                throw new Error('El mail no esta asociado a ninguna cuenta')
            }
            return crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                user.recoverToken = token;
                var recoverExpire = new Date();
                recoverExpire.setHours(recoverExpire.getHours() + 1);
                user.recoverExpire = recoverExpire;
                return user.save()
                    .then(user => {
                        mailUtils.sendMail('recover', {
                            recoverUrl: '/recover/' + user._id + '/' + user.recoverToken,
                            user: user
                        }, user.email);
                        return res.status(204).end();
                    });
            });
        })
        .catch(handleError(res));
}

/**
 * Recover: Change password
 */
export function recoverPassword(req, res) {
    return User.findOne({_id: req.body.user})
        .exec()
        .then(user => {
            if (!user) {
                throw new Error('No se encontró un usuario con ese id');
            }
            if(user.recoverToken !== req.body.token) {
                throw new Error('Hubo un problema. Intente volver a recuperar su cuenta, o contacte a un administrador para recuperar su cuenta');
            }
            if(user.recoverExpire < new Date()) {
                throw new Error('Pasó demaciado tiempo desde que se envió el mail. Debe volver a recuperar su cuenta');
            }
            user.password = req.body.password;
            user.set('recoverToken', undefined, { strict: false });
            user.set('recoverExpire', undefined, { strict: false });
            return user.save()
                .then(user => {
                    return res.status(204).end()
                });
        })
        .catch(handleError(res));
}

/**
 * Get my info
 */
export function me(req, res, next) {
    var userId = req.user._id;

    return User.findOne({_id: userId}, '-salt -recoverToken -recoverExpire -password').exec()
        .then(user => { // don't ever give out the password or salt
            if (!user) {
                return res.status(401).end();
            }
            res.json(user);
        })
        .catch(err => next(err));
}

/**
 * Get metadata
 */
export function metadata(req, res, next) {
    res.json({
        name: 'usuario',
        pluralName: 'usuarios',
        'fields': [
            {
                'title': 'Nombre',
                'field': 'name',
                'type': 'string',
                'columnClass': 'col-md-2',
                'show': true,
                'controlType': 'input',
                'link': '/profile/doctor',
                'icon': 'fa fa-male',
                'validations': {
                    'required': '',
                    'minlength': '5'
                },
                'attributes': {
                    required: true,
                    'minlength': 5
                }
            },
            {
                'title': 'Email',
                'field': 'email',
                'columnClass': 'col-md-2',
                'type': 'email',
                'show': true,
                'controlType': 'input',
                'icon': 'fa fa-envelope',
                'attributes': {
                    'required': '',
                    'mongoose-error': ''
                },
                'validations': {
                    required: true,
                    'email': '',
                    'mongoose': ''
                }
            },
            {
                'title': 'Matricula',
                'shortTitle': 'Mat',
                'field': 'ma',
                'type': 'number',
                'columnClass': 'col-md-2',
                'show': true,
                'icon': 'fa fa-user-md',
                'controlType': 'input',
                'attributes': {
                    required: '',
                    'min': '1',
                    'max': '99999999'
                },
                'validations': {
                    required: true,
                    'max': '1',
                    'min': '99999999',
                    'number': ''
                }
            },
            {
                'title': 'Matricula Especialista',
                'shortTitle': 'Mat Especialista',
                'field': 'me',
                'type': 'number',
                'columnClass': 'col-md-2',
                'show': true,
                'icon': 'fa fa-user-md',
                'controlType': 'input',
                'attributes': {
                    required: '',
                    'max': '99999999',
                    'min': '1'
                },
                'validations': {
                    required: true,
                    'max': '1',
                    'min': '99999999',
                    'number': ''
                }
            },
            {
                'title': 'Activo',
                'shortTitle': 'Activo',
                'field': 'active',
                'type': 'text',
                'columnClass': 'col-md-2',
                'show': true,
                'icon': 'fa fa-user-md',
                'controlType': 'input',
                'attributes': {
                    required: '',
                    pattern: '(true|false)'
                },
                'validations': {
                    required: true,
                    'pattern': 'true o false'
                }
            },
            {
                'title': 'Contraseña',
                'field': 'password',
                'type': 'password',
                'columnClass': 'col-md-2',
                'show': true,
                'hideInList': true,
                'icon': 'fa fa-asterisk',
                'controlType': 'input',
                'attributes': {
                    'mongoose-error': ''
                },
                'validations': {
                    'mongoose': ''
                }
            }
        ]

    });
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
    res.redirect('/');
}
