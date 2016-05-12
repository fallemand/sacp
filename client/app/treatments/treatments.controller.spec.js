'use strict';

describe('Component: TreatmentsComponent', function () {

  // load the controller's module
  beforeEach(module('sacpApp'));

  var TreatmentsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    TreatmentsComponent = $componentController('TreatmentsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
