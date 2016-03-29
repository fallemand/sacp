'use strict';

angular.module('focorApp.auth', [
  'focorApp.constants',
  'focorApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
