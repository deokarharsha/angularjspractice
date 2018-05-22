/*
* v8 data service - v0.0.1
* An angularJS service for CRUD operation
* save, edit and delete
* Made by Vinod Tank <vinodtank@hotmail.com> (https://github.com/vinodtank)
*/
(function () {
'use strict';

angular.module('DataService')

.factory('DataServices', ['$http', '$rootScope', '$filter', function ($http, $rootScope, $filter) {
  var service = {};

  service.Submit = function (requestName, data, callback) {
    var result = {};

    $http.post($rootScope.POSTRequestURL,
    {
      requestName: $rootScope.globals.currentDB.dbName + '.dbo.' + requestName,
      values: normalize(data)
    })
    .then(function successCallback(response) {
      var resp = angular.fromJson(response.data);

      // error
      if (resp.length == 1 && angular.fromJson(response.data)[0].Response == 'Error') {
        result = {error: angular.fromJson(response.data)[0].Error};
      }
      // success
      else {
        result = {success: 'true'};
        if (resp[0] !== 'object') {
          result.data = resp[0];
        }
      }

      callback(result);
    }, function errorCallback(response) {
      result = {error: 'Something is went wrong.'};

      callback(result);
    });
  };

  service.Edit = function (tableName, id, callback) {
    $http.post($rootScope.POSTRequestURL,
    {
      requestName: $rootScope.globals.currentDB.dbName + '.dbo.getEditData',
      values: tableName + ',' + id
    })
    .then(function successCallback(response) {
      callback(angular.fromJson(response.data)[0]);
    });
  };

  // use for Select list and Dropdown controls
  service.SelectData = function(tableName, sortOrder, callback) {
    $http.post($rootScope.POSTRequestURL,
    {
      requestName: $rootScope.globals.currentDB.dbName + '.dbo.getSelectData',
      values: tableName + ',' + sortOrder
    })
    .then(function successCallback(response) {
      callback(angular.fromJson(response.data));
    });
  };

  // get custom data
  service.getData = function (requestName, parameters, callback) {
    $http.post($rootScope.POSTRequestURL,
    {
      requestName: $rootScope.globals.currentDB.dbName + '.dbo.' + requestName,
      values: normalize(parameters)
    })
    .then(function successCallback(response) {
      callback(angular.fromJson(response.data));
    });
  };

  return service;
}])

.filter('unique', function () {
  return function (collection, keyname) {
    var output = [],
        keys = [];

    angular.forEach(collection, function (item) {
        var key = item[keyname];
        if (keys.indexOf(key) === -1) {
            keys.push(key);
            output.push(item);
        }
    });

    return output;
  };
})

.filter('Count', function () {
  return function (data, key) {
    if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
        return 0;
    }

    var count = 0;
    for (var i = data.length - 1; i >= 0; i--) {
        count += 1;
    }

    return count;
  };
})

.filter('Sum', function () {
  return function (data, key) {
    if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
        return 0;
    }

    var sum = 0;
    for (var i = data.length - 1; i >= 0; i--) {
        sum += parseInt(data[i][key]);
    }

    return sum;
  };
});
})();
