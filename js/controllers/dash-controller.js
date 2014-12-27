angular.module('starter.controllers')
    .controller('DashCtrl', function($scope) {});

angular.module('starter.controllers')
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