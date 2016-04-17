'use strict';

angular.module('sacpApp.auth', [
  'sacpApp.constants',
  'sacpApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
