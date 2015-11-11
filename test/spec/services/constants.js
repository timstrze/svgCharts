'use strict';

describe('Service: Constants', function () {

  // load the service's module
  beforeEach(module('svgChartsApp'));

  // instantiate service
  var Constants;
  var testData = angular.copy(window.testData);

  beforeEach(inject(function (_Constants_) {
    Constants = _Constants_;
  }));

  describe('Constants.http', function () {

    it('Constants should exist', function () {
      expect(Constants.http).not.toBeUndefined();
    });

  });

});
