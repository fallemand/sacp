'use strict';

describe('Component: DatatableComponent', function () {

  // load the controller's module
  beforeEach(module('sacpApp'));

  var DatatableComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    DatatableComponent = $componentController('DatatableComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
