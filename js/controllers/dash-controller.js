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