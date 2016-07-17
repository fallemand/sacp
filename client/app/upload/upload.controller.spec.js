'use strict';

describe('Component: UploadComponent', function () {

  // load the controller's module
  beforeEach(module('sacpApp'));

  var UploadComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    UploadComponent = $componentController('UploadComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
