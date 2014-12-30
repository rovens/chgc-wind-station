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