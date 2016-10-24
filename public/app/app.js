angular.module('ShoppingList',['ngRoute', 'authService', 'mainCtrl', 'listCtrl', 'settingsCtrl', 'settingsService', 'listSettingsCtrl'])
    .config(function($routeProvider, $locationProvider, $httpProvider) {

        $routeProvider
            .otherwise('/lists')
            // route for the home page
            .when('/lists/', {
                templateUrl : 'app/views/pages/lists.html',
                controller: 'listController',
                controllerAs: 'lists'
            }).when('/lists/:listId/settings',{
                templateUrl: 'app/views/pages/listSettings.html',
                controller: 'listSettingsController',
                controllerAs: 'settings'
            }).when('/login',{
                templateUrl: 'app/views/pages/login.html',
                controller: 'mainController',
                controllerAs: 'login'
            }).when('/settings',{
                templateUrl: 'app/views/pages/settings.html',
                controller: 'settingsController',
                controllerAs: 'settings'
            }).when('/register',{
                templateUrl: 'app/views/pages/register.html',
                controller: 'mainController',
                controllerAs: 'register'
            });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push('AuthInterceptor');

    });