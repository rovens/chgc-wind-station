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
