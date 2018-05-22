/*
* julietONE admin controller - v0.0.1
* An angularJS controller for admin modules
*/
(function () {
﻿'use strict';

angular.module('Admin')

// admin/views/apps.html
.controller('AppsCtrl', ['DataServices', '$scope', function (DataServices, $scope) {
  $scope.data = {};
  $scope.data.ID = 0;

  $scope.submit = function () {
    DataServices.Submit('doApps', $scope.data, function (response) {
      $scope.result = response;
    });
  };

  $scope.edit = function (id) {
    $scope.result = {};
    DataServices.Edit('Apps', id, function (data) {
      $scope.data = data;
    });
  };

  $scope.reset = function () {
    $scope.data = {};
    $scope.data.ID = 0;
  };
}]) // apps

// admin/views/dbs.html
.controller('DBsCtrl', ['DataServices', '$scope', '$filter', function (DataServices, $scope, $filter) {
  $scope.data = {ID:0, appID:0, name:'', dbName:'', hasDivisions:0};

  // get apps data
  DataServices.SelectData('Apps', 'name', function (response) {
    $scope.apps = response;
    $scope.selectedApp = $scope.apps[0];
  });

  $scope.selectApp = function (selectedApp) {
    $scope.data.appID = selectedApp.id;
  };

  $scope.submit = function () {
    DataServices.Submit('doDBConfig', $scope.data, function (response){
      $scope.result = response;
    });
  };

  $scope.edit = function (id) {
    $scope.result = '';
    DataServices.Edit('DBConfig', id, function (response) {
      $scope.data = response;
      $scope.selectedApp = $filter('filter')($scope.apps, {'id': $scope.data.appID})[0];
    });
  };

  $scope.reset = function () {
    $scope.data = {ID:0, appID:0, name:'', dbName:'', hasDivisions:0};
    $scope.selectedApp = $scope.apps[0];
  };
}]) // dbs

// admin/views/db-access.html
.controller('DbAccessCtrl', ['DataServices', '$scope', function (DataServices, $scope) {
  DataServices.SelectData('Users', 'userName', function (response) {
    $scope.users = response;
    $scope.selectedUser = function (selected) {
      if (selected) {
        $scope.selectedUser.id = selected.originalObject.id;
        getAccessData(selected.originalObject.id);
      }
    };
  });

  function getAccessData(id) {
    var para = {ID:id, tblName:'DBAccess'};
    DataServices.getData('getAccessData', para, function (response) {
      $scope.databases = response;
    });
  }

  $scope.checked = function (data) {
    var para = {userID: $scope.selectedUser.id, dbID: data.dbID, canAccess: data.canAccess};
    DataServices.Submit('doDBAccess', para, function (response) {
      $scope.result = response;
    });
  };

  $scope.reset = function () {
    $scope.$broadcast('angucomplete-alt:clearInput', 'Users');
    $scope.databases = [];
  };
}]) // db-access

// admin/views/modules.html
.controller('ModulesCtrl', ['DataServices', '$scope', '$filter', function (DataServices, $scope, $filter) {
   $scope.data = {ID:0, appID:0, parentID:0, name:'', action:'', icon:'', sortID:0, tblName:'', para:''};

   // get apps
   DataServices.SelectData('Apps', 'name', function (response) {
     $scope.apps = response;
     $scope.selectedApp = $scope.apps[0];
     $scope.selectApp = function (selectedApp) {
       $scope.data.appID = selectedApp.id;
     };
   });

  // get parents
  $scope.parents = [
   {id:'0', name:'(Select)'},
   {id:'1', name:'Main'},
   {id:'2', name:'Transactions'},
   {id:'3', name:'Reports'},
   {id:'4', name:'Utility'},
   {id:'5', name:'Settings'}
  ];

  $scope.selectedParent = $scope.parents[0];
  $scope.selectParent= function (selectedParent) {
    $scope.data.parentID = selectedParent.id;
  };

  $scope.submit = function () {
    DataServices.Submit('doModules', $scope.data, function (response) {
      $scope.result = response;
    });
  };

  $scope.edit = function (id) {
    DataServices.Edit('Modules', id, function (response) {
      $scope.data = response;
      $scope.selectedApp = $filter('filter')($scope.apps, {'id': $scope.data.appID})[0];
      $scope.selectedParent = $filter('filter')($scope.parents, {'id': $scope.data.parentID})[0];
    });
  };

  $scope.reset = function () {
    $scope.data = {ID:0, appID:0, parentID:0, name:'', action:'', icon:'', sortID:0, tblName:'', para:''};
    $scope.selectedApp = $scope.apps[0];
    $scope.selectedParent = $scope.parents[0];
  };
}]) // modules

// admin/views/mod-access.html
.controller('ModAccessCtrl', ['DataServices', '$scope', function (DataServices, $scope) {
  initialise();

  function initialise() {
    $scope.users = {};
    $scope.modules = [];
    $scope.selectedApp = {};
    $scope.$broadcast('angucomplete-alt:clearInput','Users');

    loadUsernames();

    $scope.canAddAll = false;
    $scope.canEditAll = false;
    $scope.canDeleteAll = false;
    $scope.canAccessAll = false;
  }

  $scope.parents = [
    {id:'0', name:'(All)'},
    {id:'1', name:'Main'},
    {id:'2', name:'Transactions'},
    {id:'3', name:'Reports'},
    {id:'4', name:'Settings'}
  ];

  $scope.selectedParent = $scope.parents[0];
  $scope.selectParent= function (selectedParent) {
    $scope.parentID = selectedParent.id;
  };

  function loadUsernames() {
    DataServices.SelectData('Users', 'userName', function (response) {
      $scope.users = response;
      $scope.selectedUser = function (selected) {
        if (selected) {
          $scope.selectedUser.id = selected.originalObject.id;
          getAccessData($scope.selectedUser.id);
        }
      };
    });
  }

  function getAccessData (id) {
    var para = {ID:id, tblName:'ModuleAccess'};
    DataServices.getData('getAccessData', para, function (response) {
      $scope.modules = response;
      for (var i = 0; i < $scope.modules.length; i++) {
        if ($scope.modules[i].canAdd == true) {
          $scope.canAddAll = true;
        }
        if ($scope.modules[i].canEdit == true) {
          $scope.canEditAll = true;
        }
        if ($scope.modules[i].canDelete == true) {
          $scope.canDeleteAll = true;
        }
        if ($scope.modules[i].canAccess == true) {
          $scope.canAccessAll = true;
        }
      }
    });
  }

  $scope.checked = function (data) {
    var para = {ID:data.modID, userID:$scope.selectedUser.id, canAdd:data.canAdd, canEdit:data.canEdit, canDelete:data.canDelete, canAccess:data.canAccess, appID:data.appID, parentID:data.parentID};
    DataServices.Submit('doModuleAccess', para, function (response) {
      $scope.result = response;
    });
  };

  $scope.checkAll = function () {
    var appID ='';
    var parentID = '';
    for (var i = 0; i < $scope.modules.length; i++) {
      $scope.modules[i].canAdd = $scope.canAddAll;
      $scope.modules[i].canEdit = $scope.canEditAll;
      $scope.modules[i].canDelete = $scope.canDeleteAll;
      $scope.modules[i].canAccess = $scope.canAccessAll;

      if ($scope.selectedApp.appName == undefined && $scope.parentID == undefined) {
        appID = '%';
        parentID = '%';
      } else {
        appID = $scope.selectedApp.appID;
        parentID = $scope.parentID;
      };
      var para = {ID:0, userID:$scope.selectedUser.id, canAdd:$scope.modules[i].canAdd, canEdit:$scope.modules[i].canEdit, canDelete:$scope.modules[i].canDelete, canAccess:$scope.modules[i].canAccess, appID:appID, parentID:parentID};
    };

    DataServices.Submit('doModuleAccess', para, function (response) {
      $scope.result = response;
    });
  };

  $scope.reset = function () {
    initialise();
  };
}]) // mod-access

// admin/views/users.html
.controller('UserCtrl', ['DataServices','$scope', function (DataServices, $scope) {
  $scope.data = {ID:0, userName:'', displayName:'', password:'', userType:'', isActive:1};

  $scope.submit = function () {
    DataServices.Submit('doUsers', $scope.data, function (response) {
      $scope.result = response;
    });
  };

  $scope.edit = function (id) {
    $scope.result = {};
    DataServices.Edit('Users', id, function (response) {
      $scope.data = response;
      $scope.data.password = '';
    });
  };

  $scope.reset = function () {
    $scope.data = {ID:0, userName:'', displayName:'', password:'', userType:'', isActive:1};
    $scope.confirmPassword = '';
  };
}]) // users

// admin/views/ip-whitelist.html
.controller('IpWhitelistCtrl', ['DataServices','$scope', function (DataServices, $scope) {
  $scope.data = {ID:0,ipAddress:'',desc:''};

  $scope.submit = function () {
    DataServices.Submit('doIP', $scope.data, function (response) {
      $scope.result = response;
    });
  };

  $scope.edit = function (id) {
    $scope.result = {};
    DataServices.Edit('IPTable', id, function (response) {
      $scope.data = response;
    });
  };

  $scope.reset = function () {
    $scope.data = {ID:0, ipAddress:'', desc:''};
  };
}]); // ip-whitelist
})();
