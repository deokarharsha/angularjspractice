/*
 * julietONE app - v0.0.1
 * An angularJS app
 *
 * Made by Vinod Tank <vinodtank@hotmail.com> (https://github.com/vinodtank)
 */
(function () {
'use strict';

// declare modules
angular.module('DataService', []);
angular.module('Authentication', []);
angular.module('Admin', []);
angular.module('Home', []);
angular.module('Finance', []);
angular.module('Payroll', []);
angular.module('Distributor', []);
angular.module('GAPIService', []);
angular.module('ODMS', []);

angular.module('julietONE', [
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'ngCsv',
  'angucomplete-alt',
  'ngTagsInput',
  'DataService',
  'Authentication',
  'Admin',
  'Home',
  'Finance',
  'Payroll',
  'Distributor',
  'GAPIService',
  'ODMS'
])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/authenticate', {
      controller: 'AuthenticationController',
      templateUrl: 'modules/authentication/views/authenticate.html'
    })
    .when('/login', {
      controller: 'LoginController',
      templateUrl: 'modules/authentication/views/login.html'
    })
    .when('/', {
      controller: 'HomeController',
      templateUrl: 'modules/home/views/home.html'
    })
    .otherwise({ redirectTo: '/authenticate' });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http', function ($rootScope, $location, $cookieStore, $http) {
  // LIVE
  $rootScope.POSTRequestURL = 'http://api.julietapparels.com/ReSTService.svc/POSTRequest';
  // Sandbox
  // $rootScope.POSTRequestURL = 'http://sandbox.julietinfotech.com/ReSTService.svc/POSTRequest';

  // keep user logged in after page refresh
  $rootScope.globals = $cookieStore.get('globals') || {};
  if ($rootScope.globals.currentUser) {
    // $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
  }

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    // redirect to login page if not logged in
    if ($location.path() !== '/authenticate' && !$rootScope.globals.authenticatedIP) {
      $location.path('/authenticate');
    }

    if ($rootScope.globals.currentUser) {
      $location.path('/');
    }
  });
}])

.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();

				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});

window.onbeforeunload = confirmExit;
function confirmExit() {
  return "You have attempted to leave this page. Are you sure?";
}
})();
