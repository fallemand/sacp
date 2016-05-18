'use strict';

describe('Directive: dynamicAttributes', function () {

  // load the directive's module
  beforeEach(module('sacpApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dynamic-attributes></dynamic-attributes>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dynamicAttributes directive');
  }));
});
