(function (module) {
    module.controller('LoginController', function ($scope, $state, GrapeUser) {
        var vm = this;

        vm.username = '';
        vm.password = '';

        vm.loggingIn = false;

        vm.login = function () {
            vm.loggingIn = true;
            GrapeUser.login({
                username: vm.username,
                password: vm.password
            }).$promise.then(function (response) {
                $state.go('grape.create');
            }, function (error) {
                vm.loggingIn = false;
            });
        }
    })
}(angular.module('Grape.Login', [])));