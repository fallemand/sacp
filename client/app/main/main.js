'use strict';

angular.module('focorApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        template: '<main></main>'
      });
  });
