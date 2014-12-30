//'use strict';
//
//angular.module('chgcApp')
//  .directive('windStatistics', function () {
//    return {
//      require: '^tile',
//      restrict: 'E',
//      templateUrl: 'partials/directives/windStatistics.html',
//      scope: {
//        period: '@'
//      },
//      link: function (scope, element, attrs, tileCtrl) {
//
//        tileCtrl.setTitle('scope.title');
//      }
//    };
//  });
'use strict';

angular.module('chgc.directives')
    .directive('windStatistics', function ($http, $timeout) {

        return {
            templateUrl: 'templates/windStatistics.html',
            //require: '^tile',
            restrict: 'E',
            //replace: true,
            scope: {
                station: '=',
                period: '=',
                title: '@'
            },
            link: function postLink(scope, element, attrs) {
                var reloadTimer;
                //tileCtrl.setTitle(scope.title);
                var getStatistics = function (station, period) {
                    $http.get('https://chgcapi.herokuapp.com/api/station/' + station + '/stats/' + period)
                        .success(function (response, status) {
                            if (status !== 200) {
                                scope.error = {code: status, description: ''};
                            } else {
                                scope.error = undefined;
                                scope.statistics = response;
                            }
                            // tileCtrl.setFooter('sdfsdf');
                        })
                        .error(function (response, status) {
                            scope.error = {code: status, description: ''};
                        });
                };

                scope.reload = function () {
                    reloadTimer = $timeout(function () {
                        getStatistics(scope.station, scope.period);
                    }, 30000);
                };

                scope.startStationFeed = function () {
                    if (reloadTimer) {
                        $timeout.cancel(reloadTimer);
                    }
                    getStatistics(scope.station, scope.period);
                    scope.reload();
                    reloadTimer.then(function () {
                        scope.reload();
                    });
                };

                scope.$on(
                    '$destroy',
                    function () {
                        $timeout.cancel(reloadTimer);
                    }
                );
                scope.$watch('period', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    scope.startStationFeed();
                });

                scope.startStationFeed();
            }
        };
    });
