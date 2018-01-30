(function (module) {
    module.controller('GrapePlayController', function ($scope, $stateParams, $ionicLoading, Grape, GrapeEntry) {
        var vm = this;

        var init = function () {
            $ionicLoading.show({template:'Loading...'});

            Grape.findById({ id: $stateParams.id }).$promise.then(function (response) {
                vm.grape = response.grape;

                $ionicLoading.hide();
            });
        };

        vm.grapeEntries = [
            {
                name: ''
            },
            {
                name: ''
            },
            {
                name: ''
            }
        ];

        vm.start_grape = function () {
            // Grape.start($stateParams.id).$promise.then(function (response) {
            //
            // });
        };

        vm.add_entry = function (idx) {
            var grapeEntry = vm.grapeEntries[idx];

            if (grapeEntry) {
                GrapeEntry.create({
                    name: grapeEntry.name,
                    grapeId: $stateParams.id
                }).$promise.then(function(response) {

                });
            }
        };

        init();
    });
}(angular.module('Grape.Play', ['lbServices'])));