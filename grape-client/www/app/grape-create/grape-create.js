(function (module) {
    module.controller('GrapeCreateController', function ($scope, Grape, $ionicModal) {
        var vm = this;

        vm.grape = {
            name: '',
            password: ''
        };

        vm.create_grape = function () {
            Grape.create(vm.grape).$promise.then();
        }
    });
}(angular.module('Grape.Create', ['lbServices'])));