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