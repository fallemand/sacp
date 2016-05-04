'use strict';

(function () {

    class DatatableController {
        constructor($scope, $http, NgTableParams) {
            // Use the User $resource to fetch all users
            this.$scope = $scope;
            this.parameters = $scope.parameters;


            this.notActiveDoctorsTable = new NgTableParams({count: 2}, {
                getData: function ($defer, params) {
                    $http.get('/api/users?active=false').then(response => {
                        $defer.resolve(response.data);
                    });
                }
            });
        }

        activateUser = this.$scope.parameters.activateEvent;
        deleteUser = this.$scope.parameters.cancelEvent;
    }

    angular.module('sacpApp.admin')
        .controller('DatatableController', DatatableController);

})();
