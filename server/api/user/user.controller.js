'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

function validationError(res, statusCode) {
    statusCode = statusCode || 422;
    return function (err) {
        res.status(statusCode).json(err);
    }
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
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
    return User.find(req.query, '-salt -password').exec()
        .then(users => {
            res.status(200).json(users);
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
    return User.findByIdAndRemove(req.params.id).exec()
        .then(function () {
            res.status(204).end();
        })
        .catch(handleError(res));
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
                    res.status(204).end();
                })
                .catch(validationError(res));
        });
}

/**
 * Get my info
 */
export function me(req, res, next) {
    var userId = req.user._id;

    return User.findOne({_id: userId}, '-salt -password').exec()
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
        name : 'usuario',
        pluralName: 'usuarios',
        'fields': [
            {
                'title': 'Nombre',
                'field' : 'name',
                'type': 'string',
                'show': true,
                'controlType' : 'input',
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
                'field' : 'email',
                'type': 'email',
                'show': true,
                'controlType' : 'input',
                'icon': 'fa fa-envelope',
                'attributes' : {
                    'required': '',
                    'mongoose-error' : ''
                },
                'validations' : ['required','mongoose','email']
            },
            {
                'title': 'Matricula Nacional',
                'field' : 'mn',
                'type': 'number',
                'show': true,
                'icon': 'fa fa-user-md',
                'controlType' : 'input',
                'attributes' : {
                    required: '',
                    max : '8',
                    min: '1'
                },
                'validations' : ['required','max','min', 'number']
            },
            {
                'title': 'Matricula Provincial',
                'field' : 'mp',
                'type': 'number',
                'show': true,
                'icon': 'fa fa-user-md',
                'controlType' : 'input',
                'attributes' : {
                    required: '',
                    max : '8',
                    min: '1'
                },
                'validations' : ['required','max','min', 'number']
            },
            {
                'title': 'Contraseña',
                'field' : 'password',
                'type': 'password',
                'show': true,
                'hideInList': true,
                'icon': 'fa fa-asterisk',
                'controlType' : 'input',
                'attributes' : {
                    required: true,
                    'mongoose-error' : ''
                },
                'validations' : {
                    'required' : '',
                    'mongoose' : ''
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
