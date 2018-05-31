/*
* julietONE admin controller - v0.0.1
* An angularJS controller for admin modules
*/
(function () {
﻿'use strict';

angular.module('Admin')


/**
* @ngdoc controller
* @name controller:AppsCtrl
* @description
* <strong>Database: <span style="color: orange">JulietONE</span>
* Table: <span style="color: orange">Apps</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/admin/views/apps.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>
*/
// admin/views/apps.html
.controller('AppsCtrl', ['DataServices', '$scope', function (DataServices, $scope) {
  $scope.data = {};
  $scope.data.ID = 0;
  /**
  * @ngdoc method
  * @name submit
  * @methodOf controller:AppsCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doApps</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.submit = function () {
    DataServices.Submit('doApps', $scope.data, function (response) {
      $scope.result = response;
    });
  };
  /**
  * @ngdoc method
  * @name edit
  * @methodOf controller:AppsCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Edit()</span> method to get single record for edit/view.
  *
  * @param {number} id id
  */
  $scope.edit = function (id) {
    $scope.result = {};
    DataServices.Edit('Apps', id, function (data) {
      $scope.data = data;
    });
  };
  /**
  * @ngdoc method
  * @name reset
  * @methodOf controller:AppsCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function () {
    $scope.data = {};
    $scope.data.ID = 0;
  };
}]) // apps


/**
* @ngdoc controller
* @name controller:DBsCtrl
* @description
* <strong>Database: <span style="color: orange">JulietONE</span>
* Table: <span style="color: orange">DBConfig</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/admin/views/dbs.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>&nbsp;<span class="label label-info">$filter</span>
*/
// admin/views/dbs.html
.controller('DBsCtrl', ['DataServices', '$scope', '$filter', function (DataServices, $scope, $filter) {
  $scope.data = {ID:0, appID:0, name:'', dbName:'', hasDivisions:0};
  /**
  * @ngdoc method
  * @name DataServices SelectData
  * @methodOf controller:DBsCtrl
  * @description
  * Creates <span class="label label-info">$scope.apps</span> object and
  * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
  *
  * @param {string} tableName Apps
  * @param {string} sortOrder name
  * @param {function} callback returns response object
  */

  DataServices.SelectData('Apps', 'name', function (response) {
    $scope.apps = response;
    $scope.selectedApp = $scope.apps[0];
  });

  /**
  * @ngdoc method
  * @name selectApp
  * @methodOf controller:DBsCtrl
  * @description
  * Select the app by giving the parameter as <strong>id</strong> to selcetApp() method.
  *
  * @param {number} id id
  */
  $scope.selectApp = function (selectedApp) {
    $scope.data.appID = selectedApp.id;
  };

  /**
  * @ngdoc method
  * @name submit
  * @methodOf controller:DBsCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doDBConfig</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.submit = function () {
    DataServices.Submit('doDBConfig', $scope.data, function (response){
      $scope.result = response;
    });
  };
  /**
  * @ngdoc method
  * @name edit
  * @methodOf controller:DBsCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Edit()</span> method to get single record for edit/view.
  *
  * @param {number} id id
  */
  $scope.edit = function (id) {
    $scope.result = '';
    DataServices.Edit('DBConfig', id, function (response) {
      $scope.data = response;
      $scope.selectedApp = $filter('filter')($scope.apps, {'id': $scope.data.appID})[0];
    });
  };
  /**
  * @ngdoc method
  * @name reset
  * @methodOf controller:DBsCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function () {
    $scope.data = {ID:0, appID:0, name:'', dbName:'', hasDivisions:0};
    $scope.selectedApp = $scope.apps[0];
  };
}]) // dbs



/**
* @ngdoc controller
* @name controller:DbAccessCtrl
* @description
* <strong>Database: <span style="color: orange">JulietONE</span>
* Table: <span style="color: orange">DBAccess</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/admin/views/db-access.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>
*/
// admin/views/db-access.html
.controller('DbAccessCtrl', ['DataServices', '$scope', function (DataServices, $scope) {
  /**
  * @ngdoc method
  * @name DataServices SelectData
  * @methodOf controller:DbAccessCtrl
  * @description
  * Creates <span class="label label-info">$scope.users</span> object and
  * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
  *
  * @param {string} tableName Users
  * @param {string} sortOrder userName
  * @param {function} callback returns response object
  */

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
  /**
  * @ngdoc method
  * @name checked
  * @methodOf controller:DbAccessCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doDBAccess</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.checked = function (data) {
    var para = {userID: $scope.selectedUser.id, dbID: data.dbID, canAccess: data.canAccess};
    DataServices.Submit('doDBAccess', para, function (response) {
      $scope.result = response;
    });
  };
  /**
  * @ngdoc method
  * @name reset
  * @methodOf controller:DbAccessCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function () {
    $scope.$broadcast('angucomplete-alt:clearInput', 'Users');
    $scope.databases = [];
  };
}]) // db-access


/**
* @ngdoc controller
* @name controller:ModulesCtrl
* @description
* <strong>Database: <span style="color: orange">JulietONE</span>
* Table: <span style="color: orange">Modules</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/admin/views/modules.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>&nbsp<span class="label label-info">$filter</span>
*/
// admin/views/modules.html
.controller('ModulesCtrl', ['DataServices', '$scope', '$filter', function (DataServices, $scope, $filter) {
   $scope.data = {ID:0, appID:0, parentID:0, name:'', action:'', icon:'', sortID:0, tblName:'', para:''};

   /**
   * @ngdoc method
   * @name DataServices SelectData
   * @methodOf controller:ModulesCtrl
   * @description
   * Creates <span class="label label-info">$scope.apps</span> object and
   * bind to <span class="label label-success">angucomplete-alt</span> input text element for autosuggesting.
   *
   * @param {string} tableName Apps
   * @param {string} sortOrder name
   * @param {function} callback returns response object
   */
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
  /**
  * @ngdoc method
  * @name submit
  * @methodOf controller:ModulesCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doModules</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.submit = function () {
    DataServices.Submit('doModules', $scope.data, function (response) {
      $scope.result = response;
    });
  };
  /**
  * @ngdoc method
  * @name edit
  * @methodOf controller:ModulesCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Edit()</span> method to get single record for edit/view.
  *
  * @param {number} id id
  */
  $scope.edit = function (id) {
    DataServices.Edit('Modules', id, function (response) {
      $scope.data = response;
      $scope.selectedApp = $filter('filter')($scope.apps, {'id': $scope.data.appID})[0];
      $scope.selectedParent = $filter('filter')($scope.parents, {'id': $scope.data.parentID})[0];
    });
  };
  /**
  * @ngdoc method
  * @name reset
  * @methodOf controller:ModulesCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function () {
    $scope.data = {ID:0, appID:0, parentID:0, name:'', action:'', icon:'', sortID:0, tblName:'', para:''};
    $scope.selectedApp = $scope.apps[0];
    $scope.selectedParent = $scope.parents[0];
  };
}]) // modules



/**
* @ngdoc controller
* @name controller:ModAccessCtrl
* @description
* <strong>Database: <span style="color: orange">JulietONE</span>
* Table: <span style="color: orange">ModuleAccess</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/admin/views/mod-access.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>
*/
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
  /**
  * @ngdoc method
  * @name checked
  * @methodOf controller:ModAccessCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doModuleAccess</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.checked = function (data) {
    var para = {ID:data.modID, userID:$scope.selectedUser.id, canAdd:data.canAdd, canEdit:data.canEdit, canDelete:data.canDelete, canAccess:data.canAccess, appID:data.appID, parentID:data.parentID};
    DataServices.Submit('doModuleAccess', para, function (response) {
      $scope.result = response;
    });
  };
  /**
  * @ngdoc method
  * @name checkAll
  * @methodOf controller:ModAccessCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * Check all the data in the table.
  *
  * <strong>Stored Procedure: <span style="color: orange">doModuleAccess</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
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
  /**
  * @ngdoc method
  * @name reset
  * @methodOf controller:ModAccessCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function () {
    initialise();
  };
}]) // mod-access



/**
* @ngdoc controller
* @name controller:UserCtrl
* @description
* <strong>Database: <span style="color: orange">JulietONE</span>
* Table: <span style="color: orange">Users</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/admin/views/users.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>
*/
// admin/views/users.html
.controller('UserCtrl', ['DataServices','$scope', function (DataServices, $scope) {
  $scope.data = {ID:0, userName:'', displayName:'', password:'', userType:'', isActive:1};

  $scope.submit = function () {
    DataServices.Submit('doUsers', $scope.data, function (response) {
      $scope.result = response;
    });
  };
  /**
  * @ngdoc method
  * @name edit
  * @methodOf controller:UserCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Edit()</span> method to get single record for edit/view.
  *
  * @param {number} id id
  */
  $scope.edit = function (id) {
    $scope.result = {};
    DataServices.Edit('Users', id, function (response) {
      $scope.data = response;
      $scope.data.password = '';
    });
  };
  /**
  * @ngdoc method
  * @name reset
  * @methodOf controller:UserCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function () {
    $scope.data = {ID:0, userName:'', displayName:'', password:'', userType:'', isActive:1};
    $scope.confirmPassword = '';
  };
}]) // users




/**
* @ngdoc controller
* @name controller:IpWhitelistCtrl
* @description
* <strong>Database: <span style="color: orange">JulietONE</span>
* Table: <span style="color: orange">IPTable</span>
* Type: <span style="color: magenta">Master</span></strong>
*
* <strong>View: <span style="color: green">&lt;root&gt;/modules/admin/views/ip-whitelist.html</span></strong>
*
* <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
* <span class="label label-info">$scope</span>
*/
// admin/views/ip-whitelist.html
.controller('IpWhitelistCtrl', ['DataServices','$scope', function (DataServices, $scope) {
  $scope.data = {ID:0,ipAddress:'',desc:''};
  /**
  * @ngdoc method
  * @name submit
  * @methodOf controller:IpWhitelistCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Submit()</span> method to save/update data.
  *
  * <strong>Stored Procedure: <span style="color: orange">doIP</span>
  *
  * Response: <span style="color: darkblue">id</span></strong>
  */
  $scope.submit = function () {
    DataServices.Submit('doIP', $scope.data, function (response) {
      $scope.result = response;
    });
  };
  /**
  * @ngdoc method
  * @name edit
  * @methodOf controller:IpWhitelistCtrl
  * @description
  * Calls <span class="label label-success">DataServices.Edit()</span> method to get single record for edit/view.
  *
  * @param {number} id id
  */
  $scope.edit = function (id) {
    $scope.result = {};
    DataServices.Edit('IPTable', id, function (response) {
      $scope.data = response;
    });
  };
  /**
  * @ngdoc method
  * @name reset
  * @methodOf controller:IpWhitelistCtrl
  * @description
  * Reset all the form elements along with <span class="label label-success">angucomplete-alt</span> input text elements.
  */
  $scope.reset = function () {
    $scope.data = {ID:0, ipAddress:'', desc:''};
  };
}]); // ip-whitelist
})();
