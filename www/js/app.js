// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('chgc', ['ionic', 'highcharts-ng', 'chgc.controllers', 'chgc.services', 'chgc.directives', 'chgc.filters'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.launches', {
      url: '/launches',
      views: {
          'tab-launches': {
              templateUrl: 'templates/tab-launches.html',
              controller: 'LaunchesCtrl'
          }
      }
  })

  .state('tab.launch-detail', {
      url: '/launch/:launchId',
      views: {
          'tab-launches': {
              templateUrl: 'templates/tab-launch-detail.html',
              controller: 'LaunchDetailCtrl'
          }
      }
  })
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

angular.module('chgc.controllers', []);
angular.module('chgc.controllers')
.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

angular.module('chgc.controllers')
    .controller('DashCtrl', function($scope) {});

angular.module('chgc.controllers')
    .controller('LaunchesCtrl', function($scope) {

        $scope.launches = [
            {
                name: 'tamborine',
                direction: 'E'
            },
            {
                name: 'beechmont',
                direction: 'NNE'
            }
        ];
    });
angular.module('chgc.controllers')
    .controller('LaunchDetailCtrl', function ($scope, $stateParams, windStation) {
        $scope.myActiveSlide = 0;
        $scope.period = 'last-hour';
        $scope.station = $stateParams.launchId;

        windStation.pollWindStation(true, 'last-hour', $stateParams.launchId);


        $scope.togglePeriod = function() {
            if ($scope.period === 'last-20-minutes'){
                $scope.period = 'last-hour';
            } else{
                $scope.period = 'last-20-minutes';
            }
            windStation.pollWindStation(true,  $scope.period, $stateParams.launchId);
        }
        $scope.$on('windStation.windrose', function(data, args){
            $scope.windroseData = args;
        })

        $scope.$on(
            '$destroy',
            function () {
                windStation.pollWindStation(false);
            }
        );
    });
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

angular.module('chgc.directives',[]);
angular.module('chgc.directives')
  .directive('tile', function () {
    return {
      templateUrl: 'templates/tile.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        title: '='
      },
      controller: function ($scope) {

        this.setTitle = function (title) {
          $scope.title = title;
        };

        this.setSubTitle = function (title) {
          $scope.title = title;
        };

        this.setFooter = function (text) {
          $scope.footer = text;
        };
      },

      link: function () {
      }
    };
  });

'use strict';

/* global Highcharts */
angular.module('chgc.directives')
  .directive('windRose', function ($filter, windStation) {
    var highChartOptions = {
      chart: {
        polar: true,
        type: 'column'//,
        //width: 200
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      legend: {
        reversed: true
      },
      xAxis: {
        tickmarkPlacement: 'on',
        categories: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
      },
      yAxis: {
        min: 0,
        endOnTick: false,
        showLastLabel: true,
        title: {
          text: 'Frequency (%)'
        },
        labels: {
          formatter: function () {
            return this.value + '%';
          }
        }
      },
      tooltip: {
        valueSuffix: '%',
        followPointer: true
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          shadow: false,
          groupPadding: 0,
          pointPlacement: 'on'
        }
      }
    };

    var initialiseChart = function (scope, element) {
      highChartOptions.chart.renderTo = element[0];
      var chart = new Highcharts.Chart(highChartOptions);
      return chart;
    };
    return {
      template: '<div></div>',

      scope: {
        station: '=',
        period: '=',
        title: '@'

      },
      replace: true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //tileCtrl.setTitle('Wind Rose');
        scope.subTitleTemplate = 'Between {0} and {1} on {2}.';
        var colour = function (name) {
          var speed = name.split(' ')[0];
          switch (speed) {
            case '0':
              return '#5cb85c';
            case '9':
              return '#5bc0de';
            case  '17':
              return '#f0ad4e';
            default:
              return '#d9534f';
          }
        };

        var chart = initialiseChart(scope, element);
        scope.windOrder = function (windRoseItem) {
          return parseInt(windRoseItem.name.split(' ')[0]);
        };

        scope.$watch('data', function (newSeries, oldSeries) {
          //do nothing when called on registration
          if (newSeries === oldSeries  || !newSeries) {
            return;
          }
          newSeries.data = $filter('orderBy')(newSeries.data, scope.windOrder, true);
          while (chart.series.length > 0) {
            chart.series[0].remove(true);
          }
          angular.forEach(newSeries.data, function (value) {
            chart.addSeries({name: value.name, data: value.data, color: colour(value.name)}, false);
            //chart.series[key].setData(value.data, false);
          });
          chart.setTitle(
            {text: ''},//$filter('capitalize')(newSeries.station) + ' Wind Rose'},
            {text: ''}//subTitle(newSeries)}
          );

          chart.redraw();
        }, true);

        scope.$on('windStation.windrose', function(event,args){
           scope.data = args.data;
        });

      }
    };
  });

'use strict';
/* global Highcharts */
angular.module('chgc.directives')
    .directive('windSpeed', function ($filter, windStation) {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        var highChartOptions = {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    overflow: 'justify'
                }
            },
            yAxis: {
                title: {
                    text: 'Wind speed (km/h)'
                },
                min: 0,
                max: 30,
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                alternateGridColor: null
            },
            tooltip: {
                valueSuffix: ' km/h'
            },
            plotOptions: {
                areaspline: {
                    //lineWidth: 1,
                    color: '#5cb85c',
                    //lineColor: '#5cb85c',
                    //fillOpacity:.5,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
//        spline: {
//          lineWidth: 1,
//          states: {
//            hover: {
//              lineWidth: 2
//            }
//          },
//          marker: {
//            enabled: false
//          }
//        }
            },
            navigation: {
                menuItemStyle: {
                    fontSize: '10px'
                }
            }
        };

        var initialiseChart = function (scope, element) {
            highChartOptions.chart.renderTo = element[0];
            var chart = new Highcharts.Chart(highChartOptions);
            return chart;
        };

        return {
            template: '<div></div>',
            restrict: 'E',
            replace: 'true',
            scope: {
                station: '=',
                title: '@',
                period: '='
            },
            link: function postLink(scope, element, attrs) {

                var chart = initialiseChart(scope, element);


                var subTitle = function (data) {

                    var start = $filter('date')(data.start, 'HH:mm');
                    var finish = $filter('date')(data.end, 'HH:mm');
                    var generated = $filter('date')(data.end, 'dd/MM/yyyy');
                    return $filter('stringFormat')(scope.template, [start, finish, generated, data.seriesInterval]);
                };

                scope.$watch('data', function (newSeries, oldSeries) {
                    //do nothing when called on registration
                    if (newSeries === oldSeries || !newSeries) {
                        return;
                    }
                    chart.setTitle(
                        {text: ''},//$filter('capitalize')(newSeries.station) + ' Wind Speed'},
                        {text: ''}//subTitle(newSeries)}
                    );
                    while (chart.series.length > 0) {
                        chart.series[0].remove(true);
                    }
                    var data = newSeries.series.map(function (i) {
                        return i.speed;
                    });

                    chart.addSeries({
                        //color: 'red',
                        name: $filter('capitalize')(newSeries.station),
                        data: data,
                        pointStart: newSeries.start,
                        pointInterval: newSeries.seriesInterval * 1000
                    }, false);

                    chart.redraw();


                }, true);

                scope.$on('windStation.windspeed', function(event, args){
                    scope.data = args.data;
                })
            }
        };
    });

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

angular.module('chgc.filters', []);
'use strict';

angular.module('chgc.filters')
  .filter('capitalize', function () {
    return function (input) {
      if (input !== null){
        input = input.toLowerCase();
      }
      return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
  });

'use strict';

angular.module('chgc.filters')
  .filter('stringFormat', function () {
    function toFormattedString(useLocale, format, values) {
      var result = '';

      for (var i = 0; ;) {
        // Find the next opening or closing brace
        var open = format.indexOf('{', i);
        var close = format.indexOf('}', i);
        if ((open < 0) && (close < 0)) {
          // Not found: copy the end of the string and break
          result += format.slice(i);
          break;
        }
        if ((close > 0) && ((close < open) || (open < 0))) {

          if (format.charAt(close + 1) !== '}') {
            throw new Error('format stringFormatBraceMismatch');
          }

          result += format.slice(i, close + 1);
          i = close + 2;
          continue;
        }

        // Copy the string before the brace
        result += format.slice(i, open);
        i = open + 1;

        // Check for double braces (which display as one and are not arguments)
        if (format.charAt(i) === '{') {
          result += '{';
          i++;
          continue;
        }

        if (close < 0) {
          throw new Error('format stringFormatBraceMismatch');
        }

        // Find the closing brace

        // Get the string between the braces, and split it around the ':' (if any)
        var brace = format.substring(i, close);
        var colonIndex = brace.indexOf(':');
        var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10);

        if (isNaN(argNumber)) {
          throw new Error('format stringFormatInvalid');
        }

        var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);

        var arg = values[argNumber];
        if (typeof (arg) === 'undefined' || arg === null) {
          arg = '';
        }

        // If it has a toFormattedString method, call it.  Otherwise, call toString()
        if (arg.toFormattedString) {
          result += arg.toFormattedString(argFormat);
        } else if (useLocale && arg.localeFormat) {
          result += arg.localeFormat(argFormat);
        } else if (arg.format) {
          result += arg.format(argFormat);
        } else{
          result += arg.toString();
        }

        i = close + 1;
      }

      return result;
    }

    return function (/*string*/template, /*array*/values) {
      if (!values || !values.length || !template) {
        return template;
      }
      return toFormattedString(false, template, values);
    };
  });

angular.module('chgc.services',[]);
angular.module('chgc.services')
    .factory('windStation', function ($rootScope, $http, $timeout, $filter){

        var period = '';
        var station = '';
        var reloadTimer;

        var setPeriod = function (newPeriod) {
            period = newPeriod;
            $rootScope.$broadcast('windstation.period', newPeriod);
        };


        var setStation = function (newStation) {
            station = newStation;
            $rootScope.$broadcast('windstation.station', newStation);
        };


        var constructUri  = function(name){
            return 'https://chgcapi.herokuapp.com/api/station/' + station + '/' + name + '/' + period;
        }

        var pollWindStation = function(poll, aperiod, astation){
            if (reloadTimer) {
                $timeout.cancel(reloadTimer);
            }

            if (poll){
                period = aperiod;
                station = astation;
                startStationFeed();
            }
        }

        var getWindStationData = function (dataName) {
            if (period === '' || station === '' ) return;

            $http.get(constructUri(dataName))
                .success(function (data) {
                    var start = $filter('date')(data.start, 'HH:mm');
                    var finish = $filter('date')(data.finish, 'HH:mm');
                    var result = {
                        start: start,
                        finish: finish,
                        data: data
                    };
                    $rootScope.$broadcast('windStation.' + dataName, result);
                });
        };

        var reload = function () {
            reloadTimer = $timeout(function () {
                getWindStationData("windrose");
                getWindStationData("windspeed");
                getWindStationData("stats");
            }, 30000);
        };

        var startStationFeed = function () {
            if (reloadTimer) {
                $timeout.cancel(reloadTimer);
            }
            getWindStationData("windrose");
            getWindStationData("windspeed");
            getWindStationData("stats");

            reload();
            reloadTimer.then(function () {
                reload();
            });
        };

        return {
            period: setPeriod,
            station: setStation,
            pollWindStation: pollWindStation

        }
    });