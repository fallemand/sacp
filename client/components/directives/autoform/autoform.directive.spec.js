'use strict';

describe('Directive: input', function () {

  // load the directive's module and view
  beforeEach(module('sacpApp.input'));
  beforeEach(module('app/input/input.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<app.input></app.input>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the input directive');
  }));
});
