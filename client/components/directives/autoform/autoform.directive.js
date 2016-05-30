'use strict';

angular.module('sacpApp')
  .directive('autoform', function () {
    return {
      templateUrl: 'components/directives/autoform/autoform.html',
        restrict: 'EA',
        controller: 'AutoFormController',
        controllerAs: 'vm',
        scope: {
            parameters: '=',
            object: '='
        }
    };
  });
