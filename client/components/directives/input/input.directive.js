'use strict';

angular.module('sacpApp')
  .directive('forminput', function () {
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
