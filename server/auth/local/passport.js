import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

function localAuthenticate(User, email, password, done) {
    User.findOne({
        email: email.toLowerCase()
    }).exec()
        .then(user => {
            if (!user) {
                return done(null, false, {
                    message: 'El email no se encuentra registrado.'
                });
            }
            if (user.active == false) {
                return done(null, false, {
                    message: 'Su cuenta debe ser autorizada por un Administrador. Será notificado a: ' + user.email
                });
            }
            user.authenticate(password, function (authError, authenticated) {
                if (authError) {
                    return done(authError);
                }
                if (!authenticated) {
                    return done(null, false, {message: 'La contraseña no es correcta.'});
                } else {
                    return done(null, user);
                }
            });
        })
        .catch(err => done(err));
}

export function setup(User, config) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    }, function (email, password, done) {
        return localAuthenticate(User, email, password, done);
    }));
}
