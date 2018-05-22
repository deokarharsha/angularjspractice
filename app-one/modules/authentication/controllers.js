/*
 * v8trade authentication controller - v0.0.1
 * An angularJS controller for login user
 * and route the location
 * Made by Vinod Tank <vinodtank@hotmail.com> (https://github.com/vinodtank)
*/
(function () {
/* jshint -W100 */
﻿'use strict';

angular.module('Authentication')

/**
* @ngdoc controller
* @name Authentication.controller:AuthenticationController
* @description
* A controller for the dashboard page of JulietONE
*/
// modules/authentication/views/authenticate.html
.controller('AuthenticationController', ['$cookieStore', '$rootScope', '$http', '$location', '$scope', function ($cookieStore, $rootScope, $http, $location, $scope) {
  document.getElementById('login').style.display = 'none';

  // stretch main div
  setTimeout(function () {
    window.onresize = function () {
      var vpw = $(window).width();
      var vph = $(window).height();

      document.getElementById('main-div').style.height = vph + 'px';
    };
  }, 1);

  $http.get('https://api.ipify.org/')
  .then(function (ip) {
    $http.post($rootScope.POSTRequestURL,
      {requestName: 'authenticateIP', values: ip.data}
    )
    .then(function (response) {
      if(angular.fromJson(response.data)[0].result == 1) {
        $rootScope.globals.authenticatedIP = true;
        $cookieStore.put('ip', ip.data);
        $location.path('/login');
      } else {
        $rootScope.globals.authenticatedIP = false;
        document.getElementById('main-div').style.display = 'none';
        document.getElementById('login').style.display = 'block';
      }
    });
  });

  $scope.login = function () {
    $scope.error = 'User name or password not matched.';
  };
}]) //authenticate

// modules/authentication/views/login.html
.controller('LoginController', ['AuthenticationService', '$location', '$http', '$rootScope', '$scope',  function (AuthenticationService, $location, $http, $rootScope, $scope) {
  // reset login status
  AuthenticationService.ClearCredentials();

  $scope.login = function () {
    AuthenticationService.Login($scope.username, $scope.password, function (response) {
      console.log($rootScope.globals);
      if (response.success) {
        // // save login session
        // $http.post($rootScope.POSTRequestURL,
        // {requestName: 'doLoginInfo', values: 'Add,' + $rootScope.globals.currentUser.ID + ',' + $rootScope.globals.currentUser.session + ',' + $rootScope.globals.currentUser.ip})
        // .then(function (response) {
        //     result = {success: 'Success!'};
            $location.path('/');
      //     }, function (error) {
      //       result = {error: 'Oops! User is already logged in.'};
      //     });
      // } else {
      //   $scope.error = response.message;
      }
    });
  };
}]); //login
})();
