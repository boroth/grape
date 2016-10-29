(function (module) {
    module.controller('SignupController', function ($scope, $state, GrapeUser, $ionicModal) {
        var vm = this;

        vm.user = {
            username: 'bo2',
            email: 'robert.bo.roth@gmail.com',
            password: 'asdf'
        };
        vm.password2 = 'asdf';

        $ionicModal.fromTemplateUrl('app/signup/signup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        var errorModalScope = $scope.$new(true);
        $ionicModal.fromTemplateUrl('templates/api-error.html', {
            scope: errorModalScope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.errorModal = modal;
            errorModalScope.modal = modal;
        });

        $scope.signup = function () {
            vm.loggingIn = true;
            GrapeUser.create(vm.user).$promise.then(function (response) {
                $scope.modal.show();
            }, function (response) {
                var error = response.data.error;

                errorModalScope.errorResponse = error;
                if (error.details) {
                    errorModalScope.errorMessages = [];

                    _.each(error.details.messages, function (messages) {
                        errorModalScope.errorMessages = errorModalScope.errorMessages.concat(messages);
                    });
                }
                $scope.errorModal.show();
            });
        };


        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
    })
}(angular.module('Grape.Signup', [])));