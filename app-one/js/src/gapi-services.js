/*
* julietONE odms controller - v0.0.1
* An angularJS controller for google api services
*/
(function () {
'use strict';

angular.module('GAPIService')

.factory('GAPIServices', ['$q', '$rootScope', '$http', function ($q, $rootScope, $http) {
  var service = {};
  // live
  var client_id = "581440600032-33c3309ho23q67oh8f2ljpe8vifqg5op.apps.googleusercontent.com";
  // local
  // var client_id="971028619851-j8iphhel9n0n7saf1a2rpjcn15dmq2no.apps.googleusercontent.com";

  var scope = ['https://www.googleapis.com/auth/drive.file'];

  // Initialize the Google API
  gapiInitialize();
  window.gapiCallbacks = [];

  function gapiInitialize() {
    gapi.auth.init(function () {
      gapi.client.load('drive', 'v2')
      .then(function() {
        var GapiQueue = function() {
          this.push = function(callback) {
            setTimeout(callback, 0);
          };
        };

        var _old_gapiCallbacks = window.gapiCallbacks;
        window.gapiCallbacks = new GapiQueue();

        _old_gapiCallbacks.forEach(function (callback) {
          window.gapiCallbacks.push(callback);
        });
      },
      function(error) {
        console.error(error);
      });
    });
  }

  // Login into google drive
  service.login = function() {
    var deferred = $q.defer();

    this.checkAuthNonImmediate()
    .then(function (accessToken) {
      deferred.resolve(accessToken);
    },
    function() {
      gapi.auth.authorize({'client_id': client_id, 'scope': scope, 'immediate': true}, function(authResult) {
         if (authResult && !authResult.error) {
             deferred.resolve(gapi.auth.getToken().access_token);
         } else {
             deferred.reject(authResult);
         }
       });
    });

    return deferred.promise;
  };

  service.checkAuthNonImmediate = function() {
    var deferred = $q.defer();

    gapi.auth.authorize({'client_id': client_id, 'scope': scope, 'immediate': false},
      function(authResult) {
        if(authResult && !authResult.error) {
          deferred.resolve(gapi.auth.getToken().access_token);
        } else {
          deferred.reject(authResult);
        }
    });

    return deferred.promise;
  };

  // create main folder on Google drive
  service.createFolder = function(folderName) {
    var deferred = $q.defer();
    var request = gapi.client.request({
      'path': '/drive/v2/files/',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body':{
        "title" : folderName,
        "mimeType" : "application/vnd.google-apps.folder"
      }
    });

    request.then(function(file) {
      deferred.resolve(file.result);
    },
    function(reason) {
      deferred.reject(reason);
    });

    return deferred.promise;
  };

  // create folder under main folder on Google drive
  service.createSubFolder = function(folderName, parentID) {
    var deferred = $q.defer();
    var request = gapi.client.request({
      'path': '/drive/v2/files/',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body':{
        "title" : folderName,
        "mimeType" : "application/vnd.google-apps.folder",
        "parents" : [{id:parentID}]
      }
    });

    request.then(function(file) {
      deferred.resolve(file.result);
    },
    function(reason){
      deferred.reject(reason);
    });

    return deferred.promise;
  };

  service.rename = function(fileId, newTitle, callback) {
    var body = {'title': newTitle};
    var request = gapi.client.drive.files.patch({
      'fileId': fileId,
      'resource': body
    });

    request.then(function(response) {
        callback(angular.fromJson(response));
    });
  };

  // upload files into Google Drive
  service.upload = function(fileData, filename, folderTitle) {
    return ensureUploadFolderPresent(folderTitle)
    .then(function(directory) {
      return insertFile(fileData, filename, directory.id);
    })
    .then(function(file) {
      return waitForFileToBecomeActive(file.id).then(function() {
        return insertPermission(file).then(function() {
          return file;
        });
      });
    });
  };

  service.copy = function(originFileId, folderID, callback) {
    var body = {'parents':[{'id':folderID}]};
    var request = gapi.client.drive.files.copy({
      'fileId': originFileId,
      'resource': body
    });
    request.execute(function(resp) {
      if(!resp.error) {
        insertPermission(resp);
        service.deleteFile(originFileId);
        callback(angular.fromJson(resp));
      } else {
        alert("Error occured while copying file to drive");
      }
    });
  };

  service.deleteFile = function(fileId) {
    var deferred = $q.defer();
    var request = gapi.client.drive.files.delete({
      'fileId': fileId
    });
    request.execute(function(resp) {
        deferred.resolve(resp);
    });
    return deferred.promise;
  };

  function ensureUploadFolderPresent(folderTitle) {
    return gapi.client.drive.files.list(
      {q:"mimeType = 'application/vnd.google-apps.folder' and trashed = false and title = '"+ folderTitle +"'"}
    )
    .then(function(files) {
      var directory = files.result.items;
      return directory[0];
    });
  }

function insertFile(fileData, filename, parentId) {
  var deferred = $q.defer();

  var boundary = '-------314159265358979323846';
  var delimiter = "\r\n--" + boundary + "\r\n";
  var close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function (e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': filename,
      'mimeType': contentType,
      "parents": [{"id":parentId}]
    };

    var base64Data = btoa(reader.result);
    var multipartRequestBody = delimiter +
                                'Content-Type: application/json\r\n\r\n' +
                                JSON.stringify(metadata) +
                                delimiter +
                                'Content-Type: ' + contentType + '\r\n' +
                                'Content-Transfer-Encoding: base64\r\n' +
                                '\r\n' +
                                base64Data +
                                close_delim;

    var request = gapi.client.request({
      'path': '/upload/drive/v2/files',
      'method': 'POST',
      'params': {'uploadType': 'multipart'},
      'headers': {
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody});

    request.then(function(file) {
      deferred.resolve(file.result);},function(reason) {
        deferred.reject(reason);
      });
    };

    return deferred.promise;
  }

  function waitForFileToBecomeActive(fileId) {
    var deferred = $q.defer();

    gapi.client.request({
      'path': '/drive/v2/files/'+fileId,
      'method': 'GET'
    }).then(function() {
      deferred.resolve();
    }, function() {
      setTimeout(function() {
        waitForFileToBecomeActive(fileId).then(function() {
          deferred.resolve();
        },function(reason) {
          deferred.reject(reason);
        });
      },1000);
    });

    return deferred.promise;
  }

  function insertPermission(file) {
    var deferred = $q.defer();
    var request = gapi.client.drive.permissions.insert({
                    'fileId': file.id,
                    'resource': {
                      "withLink": true,
                      "role": "reader",
                      "type": "anyone"
                    }
                  });

    request.then(function(file) {
      deferred.resolve(file.result);
    }, function(reason) {
      deferred.reject(reason);
    });

    return deferred.promise;
  }

  return service;
}]);
})();
