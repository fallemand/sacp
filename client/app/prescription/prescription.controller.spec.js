'use strict';

describe('Component: PrescriptionComponent', function () {

  // load the controller's module
  beforeEach(module('sacpApp'));

  var PrescriptionComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    PrescriptionComponent = $componentController('PrescriptionComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
