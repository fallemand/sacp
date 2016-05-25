'use strict';

describe('Directive: describe', function () {

  // load the directive's module and view
  beforeEach(module('sacpApp.describe'));
  beforeEach(module('components/directives/describe/describe.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<describe></describe>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the describe directive');
  }));
});
