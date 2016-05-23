'use strict';

describe('Service: SvgChartsSubPlot', function () {

  // load the service's module
  beforeEach(module('svgChartsApp'));

  // instantiate service
  var SvgChartsSubPlot;
  var testData = angular.copy(window.testData);

  beforeEach(inject(function (_SvgChartsSubPlot_) {
    SvgChartsSubPlot = _SvgChartsSubPlot_;
  }));

  describe('SvgChartsSubPlot.http', function () {

    it('SvgChartsSubPlot should exist', function () {
      expect(SvgChartsSubPlot.http).not.toBeUndefined();
      expect(testData).not.toBeUndefined();
    });

  });

});
