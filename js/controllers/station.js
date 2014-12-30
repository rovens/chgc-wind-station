'use strict';

angular.module('chgc.controllers')
  .controller('StationCtrl', function ($scope, $routeParams) {
    $scope.station = $routeParams.station;
    $scope.period = $routeParams.period ? $routeParams.period : 'last-20-minutes';

    $scope.setPeriod = function (period) {
      $scope.period = period;
    };

    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };
  });
