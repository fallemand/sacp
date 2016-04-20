'use strict';

angular.module('sacpApp')
  .directive('mainnav', () => ({
    templateUrl: 'components/navbar/mainnav.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
  }));
