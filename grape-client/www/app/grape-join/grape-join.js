(function (module) {
    module.controller('GrapeJoinController', function ($scope, Grape, $ionicModal) {
        var vm = this;

        vm.grape = {
            name: '',
            password: ''
        };

        vm.join_grape = function () {
            Grape.join(vm.grape).$promise.then(function (response) {
                // Send to grape page
                $state.go('grape.play', { id: response.data.grape.id })
            });
        }
    });
}(angular.module('Grape.Join', ['lbServices'])));