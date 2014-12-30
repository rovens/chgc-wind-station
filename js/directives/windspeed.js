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
