'use strict';

(function () {
    angular.module('sacpApp.auth')
        .run(function ($rootScope, $state, Auth) {
            // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role

            var bypass;

            $rootScope.$on('$stateChangeStart', function (event, next, params) {
                if (bypass || !next.authenticate) {
                    bypass = false;
                    return;
                }
                event.preventDefault();
                if (typeof next.authenticate === 'string') {
                    Auth.hasRole(next.authenticate, _.noop).then(has => {
                        if (has) {
                            bypass = true;
                            $state.go(next, params);
                            return;
                        }
                        return Auth.isLoggedIn(_.noop).then(is => {
                            if(is) {
                                $state.go('treatments');
                            }
                            else {
                                $state.go('login', {'returnState' : next, 'returnParams' : params});
                            }
                        });
                    });
                } else {
                    Auth.isLoggedIn(_.noop).then(is => {
                        if (is) {
                            bypass = true;
                            $state.go(next, params);
                            return;
                        }
                        $state.go('login', {'returnState' : next, 'returnParams' : params});
                    });
                }
            });
        });

})();
