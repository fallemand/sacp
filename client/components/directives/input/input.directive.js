'use strict';

angular.module('sacpApp.input')
  .directive('input', function () {
    return {
      templateUrl: 'components/directives/input/input.html',
        restrict: 'EA',
        controller: 'InputController',
        controllerAs: 'vm',
        scope: {
            parameters: '='
        }
    };
  });
