'use strict';

(function () {

    class InputController {
        constructor($scope) {
            this.$scope = $scope;
            this.parameters = $scope.parameters;
            this.isSaving = false;
        }

        getMessage(key, value) {
            switch(key) {
                case 'required' : return 'El campo es requerido';
                case 'max' : return 'El valor máximo es ' + value;
                case 'min' : return 'El valor mínimo es ' + value;
                case 'maxlength' : return 'Máximo ' + value + ' dígitos';
                case 'minlength' : return 'Mínimo ' + value + ' dígitos';
            }
        }

        register(form) {
            this.isSaving = true;
            this.submitted = true;
            if (form.$valid) {
                alert(true);
            }
        }
    }

    angular.module('sacpApp.admin')
        .controller('InputController', InputController);

})();
