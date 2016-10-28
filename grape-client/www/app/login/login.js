(function (module) {
    module.controller('LoginController', function ($scope, $state, User) {
        var vm = this;

        this.login = function () {
            User.login({
                username: vm.username,
                password: vm.password
            }).$promise.then(function (response) {
                $state.go('tab.dash');
            });
        }
    })
}(angular.module('Grape.Login', [])));