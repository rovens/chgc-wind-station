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
