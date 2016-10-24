angular.module('settingsCtrl', [])

.controller('settingsController', function (Settings, $scope) {
        var vm = this;

        Settings.getUser().success(function (data) {
            vm.user = data;
            console.log(data);
        });

        vm.updateUser = function () {
            console.log(vm.user);
            Settings.updateUser(vm.user).success(function (data) {
                if(data.success){
                    console.log(data);
                    vm.success = data.message;
                    setTimeout(function () {
                        vm.success = null;
                        $scope.$apply();

                    },5000);
                }else{
                    vm.error = 'An error occurred';
                }
            });
        }

    });