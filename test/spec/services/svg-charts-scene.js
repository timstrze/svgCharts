'use strict';

describe('Service: SvgChartsScene', function () {

  // load the service's module
  beforeEach(module('svgChartsApp'));

  // instantiate service
  var SvgChartsScene;
  var testData = angular.copy(window.testData);

  beforeEach(inject(function (_SvgChartsScene_) {
    SvgChartsScene = _SvgChartsScene_;
  }));

  describe('SvgChartsScene.http', function () {

    it('SvgChartsScene should exist', function () {
      expect(SvgChartsScene.http).not.toBeUndefined();
      expect(testData).not.toBeUndefined();
    });

  });

});
