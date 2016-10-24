angular.module('mainCtrl', [])

    .controller('mainController', function ($rootScope, $location, Auth, $http) {
        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();
        console.log(Auth.isLoggedIn());

        $rootScope.$on('$routeChangeStart', function () {
            vm.loggedIn = Auth.isLoggedIn();

            Auth.getUser().then(function (data) {
                vm.user = data.data;
                console.log(vm.user);
            });
        });

        vm.doLogin = function () {
            Auth.login(vm.loginData.email, vm.loginData.password)
                .success(function (data) {
                    if (data.success)
                    $location.path('/');
                    else vm.error = data.message;
                });
        };

        vm.doRegister = function () {
            Auth.register(vm.loginData.email, vm.loginData.password, vm.loginData.firstName, vm.loginData.lastName).success(function (data) {
                if (data.success)
                    Auth.login(vm.loginData.email, vm.loginData.password).success(function (data) {
                        if(data.success)
                        $location.path('/');
                    });
                else
                    vm.error = data.message;
            });
        };

        vm.doLogout = function () {
            Auth.logout();
            vm.user = {};
            $location.path('/login');
        };
    });