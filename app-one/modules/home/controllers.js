/*
 * julietONE home controller - v0.0.1
 * An angularJS controller for main
 * user interface with side menu bar,
 * tabs and main content area
 * Made by Vinod Tank <vinodtank@hotmail.com> (https://github.com/vinodtank)
*/
(function() {
/* jshint -W100 */
﻿'use strict';

angular.module('Home')

.controller('HomeController', function() {
})

.controller("dashboardCtrl", ["$location", "$cookieStore", "$http", "$rootScope", "$scope", "$filter", function($location, $cookieStore, $http, $rootScope, $scope, $filter) {
  $scope.$on("refreshDahsboard", function() {
    loadTickets();
  });

  $scope.toggleContainer = function(flag) {
    $scope.showNewTicketContainer = flag;
  };

  // change password
  $scope.chngePwd = function() {
    $scope.modalResult = {};
    $http.post($rootScope.POSTRequestURL,
    {
      requestName: "doUsers",
      values: $rootScope.globals.currentUser.ID + "," +
              $rootScope.globals.currentUser.name + "," +
              $rootScope.globals.currentUser.displayName + "," +
              $scope.password + "," +
              $rootScope.globals.currentUser.type + ",1"
    })
    .then(function successCallback(response) {
      $scope.modalResult.success = true;
    }, function errorCallback(error) {
      $scope.modalResult.error = true;
    });
  };

  $scope.resetPwdForm = function() {
    $scope.password = ""; $scope.confirmPassword = ""; $scope.modalResult = {};
  };

  // sign out
  $scope.signOut = function() {
    if (confirm('Confirm Sign out?')) {
      AuthenticationService.LoginInfo("Delete", function(response) {
        $rootScope.globals = {};
        $cookieStore.remove("globals");
        alert('User logged out successfully!');
        $location.path("/authenticate");
      });
    }
  };

  // tickets
  $scope.tickets = [{}];
  $scope.currentDt = getCurrentDate();
  loadTickets();

  $scope.callAction = function(id, action) {
    var resolution = prompt("Resolution", "#" + action);

    if (resolution === null) {
      return;
    }
    var para = {command:action, ID:id, ticketID:"", ticketdt:"", custID:"", name:$rootScope.globals.currentUser.displayName, email:$rootScope.globals.currentUser.name, prodID:"", issueType:"", issue:"", resolution:resolution, ip:""};

    $http.post($rootScope.POSTRequestURL,
    {
      requestName: "jildb.dbo.doTickets",
      values: normalize(para)
    })
    .then(function successCallback(response) {
      loadTickets();
    }, function errorCallback(response) {
      $scope.result = {error: "Something is went wrong."};
    });
  };

  $scope.checkClosedTickets = function() {
    return $filter("filter")($scope.tickets, {action:"close"}).length;
  };

  function loadTickets() {
    $scope.data = {email: $rootScope.globals.currentUser.name, userType:$rootScope.globals.currentUser.type};
    $http.post($rootScope.POSTRequestURL,
    {
      requestName: "jildb.dbo.getTickets",
      values: normalize($scope.data)
    })
    .then(function successCallback(response) {
      var resp = angular.fromJson(response.data);
      // error
      if (resp.length == 1 && response.Response == "Error") {
        $scope.result = {error: response.Error};
      }
      // success
      else {
        // $scope.result = {success: "true"};
        if (typeof resp === "object") {
          $scope.tickets = resp;
        }
      }
    }, function errorCallback(response) {
      $scope.result = {error: "Something is went wrong."};
    });
  }
}]) // contents

// navigation collapse for responsive
.controller("NavController", function($scope) {
  $scope.isCollapsed = true;
  $scope.$on("$routeChangeSuccess", function () {
    $scope.isCollapsed = true;
  });
})

// side bar menu
.directive("sideNav", function() {
  return {
    restrict: "E",
    templateUrl: "modules/home/views/side-nav.html",
    link: function () {
      // stretch sidbar height
      setTimeout(function() {
        // initialize first time
        var vpw = $(window).width();
        var vph = $(window).height();

        document.getElementById("side-menu").style.height = vph + "px";

        window.onresize = function () {
          var vpw = $(window).width();
          var vph = $(window).height();

          document.getElementById("side-menu").style.height = vph + "px";
        };

        // execute metisMenu plugin
        $("#side-menu").metisMenu();
      }, 1);
    },
    controller: function($http, $rootScope, $scope) {
      $scope.navItems = [];

      // get apps as per user privilege
      $http.post($rootScope.POSTRequestURL, {requestName: "getDBs", values: $rootScope.globals.currentUser.ID})
      .then(function successCallback(dbData) {
        $scope.DBs = angular.fromJson(dbData.data);
      }, function errorCallback(error) {
        console.error(error);
      });

      $scope.selectDB = function(selectedDB) {
        if (selectedDB === null) {
          $rootScope.globals.currentDB = {};
          $scope.navItems = [];
          $scope.divisions = {};
        } else {
          $rootScope.globals.currentDB = {
            appID: selectedDB.appID,
            name: selectedDB.name,
            dbName: selectedDB.dbName,
            hasDivisions: selectedDB.hasDivisions
          };

          // console.log(selectedDB.hasDivisions);
          if (selectedDB.hasDivisions == 1) {
            $scope.navItems = [];

            // get app"s divisions as per user privilege
            $http.post($rootScope.POSTRequestURL, {requestName: selectedDB.dbName + ".dbo.getDivisions", values: $rootScope.globals.currentUser.ID})
            .then(function successCallback(divData) {
              $scope.divisions = angular.fromJson(divData.data);

              $scope.selectDivision = function(selectedDivision) {
                if (selectedDivision) {
                  $rootScope.globals.currentDivision = {
                    ID: selectedDivision.ID,
                    name: selectedDivision.name
                  };

                  loadMenus();
                } else {
                  $scope.navItems = [];
                }
              };
            });
          } else {
            $scope.divisions = {};
            loadMenus();
          }

          $scope.selectedIndex = 0;
          $scope.selectMenu = function(menu) {
            $scope.selectedIndex = menu.id;
          };

          $scope.isSelected = function(menu) {
            return $scope.selectedIndex === menu.id;
          };

          /* jshint -W082 */
          function loadMenus() {
            // get modules as per user privilege
            $http.post($rootScope.POSTRequestURL,
            {requestName: "getModules", values: $rootScope.globals.currentDB.appID + "," + $rootScope.globals.currentUser.ID})
            .then(function successCallback(menuData) {
              $scope.navItems = angular.fromJson(menuData.data);
              // add support menu
            }, function errorCallback(error) {
              console.error(error);
            });
          }
        }
      };
    },
    controllerAs: "side-nav"
  };
})

.directive("tabs", function($filter) {
  return {
    restrict: "E",
    templateUrl: "modules/home/views/tabs.html",
    controller: function($scope) {
      var tabs = [],
                selected = null,
                previous = null;
      $scope.tabs = tabs;

      $scope.selectedIndex = 0;
      $scope.selectTab = function(tab) {
        $scope.tabs.previous = $scope.tabs.selected;
        $scope.tabs.selected = tab.id;

        $scope.selectedIndex = tab.id;
      };

      $scope.isSelected = function(tab) {
        return $scope.selectedIndex === tab.id;
      };

      $scope.addTab = function(tab) {
        if (tabs.indexOf(tab) == -1) {
          $scope.tabs.push(tab);
        }
      };

      $scope.removeTab = function(tab) {
        var index = $scope.tabs.indexOf(tab);
        $scope.tabs.splice(index, 1);

        // set the previous index
        if (tab.id == $scope.tabs.selected) {
          $scope.selectedIndex = $scope.tabs.previous;
        }

        // if previous not found then set the max index
        if (angular.toJson($filter("filter")($scope.tabs, {"id": $scope.tabs.previous})) == "[]") {
          $scope.selectedIndex = Math.max.apply(Math, $scope.tabs.map(function(o){return o.id;}));
        }
      };
    },
    controllerAs: "tabsCtrl"
  };
})

.directive("contents", function($filter) {
  return {
    restrict: "E",
    templateUrl: "modules/home/views/contents.html",
    transclude: true,
    controller: function($rootScope, $scope, $http) {
      var contents = [],
                    selected = null,
                    previous = null,
                    addRight = false,
                    editRight = false,
                    deleteRight = false,
                    viewMode = false,
                    viewData = [];
      $scope.contents = contents;

      $scope.selectedIndex = 0;
      $scope.selectContent = function(content) {
        $scope.contents.previous = $scope.contents.selected;
        $scope.contents.selected = content.id;

        $scope.selectedIndex = content.id;

        $rootScope.currentModuleId = $scope.contents.indexOf(content);
        $rootScope.currentModule = content.name;
      };

      $scope.isSelected = function(content) {
        return $scope.selectedIndex === content.id;
      };

      $scope.addContent = function(content) {
        if (contents.indexOf(content) == -1) {
          $scope.contents.push(content);
        }
      };

      $scope.removeContent = function(content) {
        var index = $scope.contents.indexOf(content);
        $scope.contents.splice(index, 1);

        // set the previous index
        if (content.id == $scope.contents.selected) {
          $scope.selectedIndex = $scope.contents.previous;
        }

        // if previous not found then set the max index
        if (angular.toJson($filter("filter")($scope.contents, {"id": $scope.contents.previous})) == "[]") {
          $scope.selectedIndex = Math.max.apply(Math, $scope.contents.map(function(o){return o.id;}));
        }
      };

      $scope.search = function(searchStr) {
        $scope.dataLoading = true;
        $scope.setViewMode(true);

        if (searchStr === undefined) {
          searchStr = "%";
        }

        $http.post($rootScope.POSTRequestURL,
        {
          requestName: $rootScope.globals.currentDB.dbName + ".dbo.getSearchData",
          values: $scope.contents[$rootScope.currentModuleId].tblName + "," + searchStr
        })
        .then(function successCallback(data) {
          $scope.contents[$rootScope.currentModuleId].viewData = angular.fromJson(data.data);
          $scope.colHeaders = Object.keys($scope.contents[$rootScope.currentModuleId].viewData[0]);
        }, function errorCallback(error) {
          $scope.error = JSON.stringify(error);
        });

        $scope.dataLoading = false;
        $scope.loading = "";
      };

      $scope.setViewMode = function(value) {
        $scope.contents[$rootScope.currentModuleId].viewMode = value;
      };

      $scope.setHelpScreen = function(value) {
        $scope.hideShowHelpScreen = value;
      };
    },
    controllerAs: "contentsCtrl"
  };
})

.directive("editTable", function() {
  return {
    restrict: "E",
    template: '<table class="table table-responsive table-striped table-bordered">' +
                '<thead>' +
                  '<tr>' +
                    '<th></th>' +
                    '<th ng-repeat="header in colHeaders" ng-hide="header.indexOf(' + "'ID'" + ') > -1">{{ header }}</th>' +
                  '</tr>' +
                '</thead>' +
                '<tbody>' +
                  '<tr ng-repeat="content in content.viewData">' +
                    '<td ng-hide="content.Error.length" width="30px">' +
                      '<a href="#/" ng-click="edit(content.ID); setViewMode(false)"><i class="fa fa-pencil"></i></a>' +
                    '</td>' +
                    '<td ng-repeat="key in colHeaders" ng-hide="key.indexOf(' + "'ID'" + ') > -1">{{ content[key] }}</td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>' +
              '<input ng-click="reset(); setViewMode(false)" type="button" class="btn btn-primary" value="Add New">'
  };
})

.directive("ieButton", function () {
  return {
    restrict: "E",
    template: '<input type="button value="text">"' 
      
  };
})

// home/views/contents.html
.controller("ticketSupportCtrl", ["$http", "$rootScope", "$scope", function($http, $rootScope, $scope) {
  $scope.data = {command:"add", ID:0, ticketID:"TS" + randomString(6), ticketDt:getCurrentDateTime(), custID:0,
                  name:$rootScope.globals.currentUser.displayName, email:$rootScope.globals.currentUser.name,
                  prodID:0, issueType:"", issue:"", resolution:"", ip:$rootScope.globals.currentUser.ip};

  //--------------------- Select Issue Type ---------------------
  $scope.issueTypes = [
    {id:0, name:"(Select)"},
    {id:1, name:"New Development"},
    {id:2, name:"Update Request"},
    {id:3, name:"Error"},
    {id:4, name:"Support"},
    {id:5, name:"Query"},
    {id:6, name:"Enhancement"}
  ];

  $scope.selectedIssueType = $scope.issueTypes[0];
  $scope.selectIssueType = function(selectedIssueType) {
    $scope.data.issueType = selectedIssueType.name;
  };
  //------------------------------------------------------------

  //--------------------- Select Company ---------------------
  $scope.companies = [
    {id:0, name:"(Select)"},
    {id:8, name:"JAL"},
    {id:9, name:"JIL"},
    {id:44, name:"BSLLP"}
  ];

  $scope.selectedCompany = $scope.companies[0];
  $scope.selectCompany = function(selectedCompany) {
    $scope.data.custID = selectedCompany.id;
  };
  //------------------------------------------------------------

  //--------------------- Select Products ---------------------
  $scope.products = [
    {id:0, name:"(Select)"},
    {id:42, name:"FIN - JAL"},
    {id:43, name:"FIN - JIL"},
    {id:44, name:"DST - Juliet"},
    {id:45, name:"DST - Sphere"},
    {id:46, name:"DST - Shades"},
    {id:47, name:"DST - Soulmate"},
    {id:48, name:"DST - Saffaran"},
    {id:49, name:"DST - Elastic"},
    {id:50, name:"DST - Embroidery"},
    {id:51, name:"MFG - Juliet"},
    {id:52, name:"MFG - Sphere"},
    {id:53, name:"MFG - JIL"},
    {id:54, name:"PAY - JAL"},
    {id:55, name:"PAY - JIL"},
    {id:56, name:"PAY - JAL C"},
    {id:57, name:"PAY - JAL Bhiwandi"},
    {id:58, name:"BSLLP"},
    {id:59, name:"Delhi"},
    {id:60, name:"Gujarat"},
    {id:61, name:"Hyderabad"},
    {id:62, name:"Bengaluru"}
  ];

  $scope.selectedProduct = $scope.products[0];
  $scope.selectProduct = function(selectedProduct) {
    $scope.data.prodID = selectedProduct.id;
  };
  //------------------------------------------------------------

  $scope.submit = function() {
    $scope.result = {};

    $http.post($rootScope.POSTRequestURL,
    {
      requestName: "jildb.dbo.doTickets",
      values: normalize($scope.data)
    })
    .then(function successCallback(response) {
      var resp = response.data;

      // error
      if (resp.length == 1 && response.Response == "Error") {
        $scope.result = {error: response.Error};
      }
      // success
      else {
        $scope.result = {success: "true"};
        if (typeof resp === "object") {
          $scope.data.ticketID = angular.fromJson(resp.data)[0].ticketID;
        }
      }
    }, function errorCallback(response) {
      $scope.result = {error: "Something is went wrong."};
    });

    $rootScope.$broadcast("refreshDahsboard", {});
  };

  $scope.reset = function() {
    $scope.result = {};
    $scope.data = {command:"add", ID:0, ticketID:"TS" + randomString(6), ticketDt:getCurrentDateTime(), custID:0,
                    name:$rootScope.globals.currentUser.displayName, email:$rootScope.globals.currentUser.name,
                    prodID:0, issueType:"", issue:"", resolution:"", ip:$rootScope.globals.currentUser.ip};

    $scope.selectedIssueType = $scope.issueTypes[0];
    $scope.selectedCompany = $scope.companies[0];
    $scope.selectedProduct = $scope.products[0];
  };
}]); // contents
})();
