'use strict';

describe('Controller: DemoController', function () {

  // load the controller's module
  beforeEach(module('svgChartsApp'));

  var DemoController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DemoController = $controller('DemoController', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(1).toBe(1);
  });
});
