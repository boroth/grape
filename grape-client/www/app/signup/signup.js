(function (module) {
    module.controller('SignupController', function ($scope, $state, User) {
        var vm = this;

        vm.user = {
            username: '',
            email: '',
            password: ''
        };
        vm.password2 = '';

        vm.signup = function () {
            vm.loggingIn = true;
            User.create(vm.user).$promise.then(function (response) {

            });
        }
    })
}(angular.module('Grape.Signup', [])));