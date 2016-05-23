'use strict';

describe('Service: SvgChartsAxis', function () {

  // load the service's module
  beforeEach(module('svgChartsApp'));

  // instantiate service
  var SvgChartsAxis;
  var testData = angular.copy(window.testData);

  beforeEach(inject(function (_SvgChartsAxis_) {
    SvgChartsAxis = _SvgChartsAxis_;
  }));

  describe('SvgChartsAxis.http', function () {

    it('SvgChartsAxis should exist', function () {
      expect(SvgChartsAxis.http).not.toBeUndefined();
      expect(testData).not.toBeUndefined();
    });

  });

});
