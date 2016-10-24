angular.module('settingsService', [])
    .factory('Settings', function ($http) {
        var settingsFactory = {};

        settingsFactory.updateUser = function (userData) {
            return $http.put('/api/me', userData);
        };
        settingsFactory.getUser = function () {
            return $http.get('api/me');
        };

        return settingsFactory;
    });