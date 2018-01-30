// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    // Angular modules
    'ngMessages',
    'ui.validate',

    // Ionic
    'ionic',
    'starter.controllers',

    // Common Directives
    'Common.Directives.ngSubmit',
    'Common.GrapeFormField',

    // Common Services
    'lbServices',

    // Grape Modules
    'Grape.Login',
    'Grape.Signup',
    'Grape.Create',
    'Grape.Join',
    'Grape.Play'
])

    .run(function ($ionicPlatform, $rootScope, $user, $state, LoopBackAuth) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // Validate authentication
            var hasAccessToken = LoopBackAuth.accessTokenId;
            if ( !hasAccessToken && (!toState.data || toState.data._auth !== false) && toState.name != 'login' && !$user.data) {
                event.preventDefault();

                // Go to login
                $state.go('login');
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('login', {
                url: '/login',
                controller: 'LoginController as vm',
                templateUrl: 'app/login/login.html',
                data: {
                    _auth: false
                }
            })

            .state('signup', {
                url: '/signup',
                controller: 'SignupController as vm',
                templateUrl: 'app/signup/signup.html',
                data: {
                    _auth: false
                }
            })

            .state('logout', {
                url: '/logout',
                controller: function ($scope, $state, LoopBackAuth, $ionicHistory, $ionicLoading) {
                    $ionicLoading.show({template:'Logging out....'});

                    // Clear authentication from storage
                    LoopBackAuth.clearUser();
                    LoopBackAuth.clearStorage();

                    // Remove back button and clear history
                    $ionicHistory.clearCache().then(function () {

                        $ionicHistory.clearHistory();
                        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });

                        $ionicLoading.hide();

                        $state.go('login', null, { reload: true });

                    });
                },
                data: {
                    _auth: false
                }
            })

            // setup an abstract state for the tabs directive
            .state('main', {
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('main.dash', {
                url: '/dash',
                views: {
                    'grape-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('main.create', {
                url: '/create',
                views: {
                    'grape-create': {
                        templateUrl: 'app/grape-create/grape-create.html',
                        controller: 'GrapeCreateController as vm'
                    }
                }
            })

            .state('main.join', {
                url: '/join',
                views: {
                    'grape-join': {
                        templateUrl: 'app/grape-join/grape-join.html',
                        controller: 'GrapeJoinController as vm'
                    }
                }
            })

            .state('grape', {
                url: '/grape',
                abstract: true,
                templateUrl: 'templates/grape-tabs.html'
            })

            .state('grape.play', {
                url: '/:id/play',
                views: {
                    'grape-play': {
                        templateUrl: 'app/grape-play/grape-play-1.html',
                        controller: 'GrapePlayController as vm'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise( function($injector, $location) {
            var $state = $injector.get("$state");
            $state.go('main.dash');
        });

        $httpProvider.interceptors.push(function() {
            return {
                request: function(req) {
                    // Transform **all** $http calls so that requests that go to `/`
                    // instead go to a different origin, in this case localhost:3000
                    if (/^\/api/.test(req.url)) {
                        req.url = 'http://grape.local:3000' + req.url;
                        // and make sure to send cookies too
                        req.withCredentials = true;
                    }

                    return req;
                }
            };
        });
    })

    // The $user service represents the currently logged in user
    // and the `GrapeUser` argument is defined in the lbServices module generated for you
    .factory('$user', function (GrapeUser) {
        var userService = {};

        // This function reloads the currently logged in user
        userService.load = function () {
            GrapeUser.findById({id: 'me'}, function (v) {
                userService.data = v;
            });
        };

        userService.load();

        return userService;
    });
