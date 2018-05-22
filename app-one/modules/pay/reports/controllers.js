(function() {
'use strict';

angular.module('Payroll')

  .controller('PMPYCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
    $scope.pmpyEmpSummary = {};
    $scope.employees = {};
    $scope.selectedOption = [];

    // get options
    $scope.options = [
    {id:'0', name:'(Select)'},
    {id:'1', name:'KYC Pending'},
    {id:'2', name:'PMPY Pending'},
    {id:'3', name:'PMPY Enrolled'},
    {id:'4', name:'Eligible'},
    {id:'5', name:'Not Eligible'},
    {id:'6', name:'Total Employees'}
    ];

    $scope.selectedOption = $scope.options[0];
    $scope.selectOption = function (selectedOption) {
      if (selectedOption.id != 0) {
        bindGrid();
      }
    };

    // get PMPY Emp summary
    DataServices.getData('getPMPYEmployeesSummary', {divID:$rootScope.globals.currentDivision.ID}, function(response) {
      $scope.pmpyEmpSummary = response[0];
    });

    $scope.setEditMode = function(mode) {
      $scope.editMode = mode;
    };

    $scope.updatePMPYStatus = function(empID) {
      if (confirm("Do you want to Update the Status?")) {
        DataServices.Submit('updateEmpPMPYStatus', {empID: empID, pmpyStatus: $scope.selectedOption.id}, function(response) {
          bindGrid();
        });
      } else {
        $filter('filter')($scope.employees, {empID:empID}, true)[0].pmpyStatus = 0;
      }
    };

    function bindGrid() {
      DataServices.getData('getPMPYEmployees', {command:$scope.selectedOption.id, divID:$rootScope.globals.currentDivision.ID}, function(response) {
        $scope.employees = response;
      });
    }
    }]) // emp-pmpy

  //modules/pay/reports/views/empinfo.html
  .controller('EmpInfoCtrl', ['DataServices', '$scope', function (DataServices, $scope) {
    initialise();
    function initialise() {
      $scope.data = {};
      $scope.data.divID = 1;
      $scope.btnName = "View";
      $scope.disableEmp = false;
      $scope.$broadcast('angucomplete-alt:clearInput');
      // $scope.reportData = [];
      // $scope.reportData.date = getCurrentDate();
    }

    //---------------------Autocomplete Employees-----------------------
    DataServices.SelectData('Employees', 'firstName', function (response) {
      $scope.employees = response;
    })
    $scope.selectedEmp = function (selected) {
      if (selected) {
        $scope.data.EmpID = selected.originalObject.id;
      }
    }
    //------------------------------------------------------------------

    $scope.view = function () {
      if ($scope.btnName == "Reset") {
        initialise();
      }
      else {
        var para = { divID: $scope.data.divID, EmpID: $scope.data.EmpID };
        DataServices.getData('GetEmpInfo', para, function (response) {
          $scope.data = response[0];
          $scope.reportData = [];
          $scope.reportData.date = getCurrentDate();
          $scope.disableEmp = true;
          $scope.btnName = "Reset";
        })
      }
    }
  }])//empinfo.html

    //modules/pay/reports/views/dailyattn.html
    .controller('DailyAttnCtrl', ['DataServices', '$scope', function (DataServices, $scope) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.data.DivId = 1;
        $scope.data.SDate = "2014-02-01";
        $scope.data.EDate = "2014-02-28";
        $scope.btnName = "View";
        $scope.gridData = [];
        $scope.collection = {};
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.disableDept = false;
      }

      //-----------------Autocomplete Dept-----------------------
      DataServices.SelectData('Dept', 'name', function (response) {
        $scope.deptName = response;//R&D
      })
      $scope.selectedDept = function (selected) {
        if (selected) {
          $scope.data.DeptId = selected.originalObject.id;
        }
      }
      //---------------------------------------------------------

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          var para = { DivId: $scope.data.DivId, DeptId: $scope.data.DeptId, SDate: $scope.data.SDate, EDate: $scope.data.EDate };
          DataServices.getData('AttnInfo', para, function (response) {
            if (response.length > 0) {
              $scope.gridData = response[0];
              $scope.collection = response;
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.btnName = "Reset"
              $scope.disableDept = true;
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//dailyattn.html

    //modules/pay/reports/views/lateearlyinfo.html
    .controller('LateEarlyInfoCtrl', ['DataServices', '$scope', '$filter', function (DataServices, $scope, $filter) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.data.DivId = 14;
        $scope.data.SDate = "2011-08-02";
        $scope.data.EDate = "2011-08-31";
        $scope.btnName = "View";
        $scope.collection = [];
        $scope.reportData = [];
        $scope.reportData.date = getCurrentDate();
      }

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          var para = { DivId: $scope.data.DivId, SDate: $scope.data.SDate, EDate: $scope.data.EDate, LateMinutes: $scope.data.LateMinutes };
          DataServices.getData('getLateEarlyInfo', para, function (response) {
            if (response.length > 0) {
              $scope.gridData = response[0];
              $scope.collection = response;
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.btnName = "Reset";
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//lateearlyinfo.html

    //modules/pay/reports/views/dutyhours.html
    .controller('DutyHoursCtrl', ['DataServices', '$scope', '$filter', function (DataServices, $scope, $filter) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.gridData = [];
        $scope.collection = [];
        $scope.data.DivId = 1;
        $scope.data.SDate = "2014-02-01";
        $scope.data.EDate = "2014-03-30";
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.btnName = "View";
        $scope.disableDept = false;
      }

      //--------------------Autocomplete dept---------------------
      DataServices.SelectData('Dept', 'name', function (response) {
        $scope.deptName = response;
      })
      $scope.selectedDept = function (selected) {
        if (selected) {
          $scope.data.DeptId = selected.originalObject.id;
        }
      }
      //----------------------------------------------------------

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          var para = { DivId: $scope.data.DivId, DeptId: $scope.data.DeptId, SDate: $scope.data.SDate, EDate: $scope.data.EDate };
          DataServices.getData('getDutyHrsInfo', para, function (response) {
            if (response.length > 0) {
              $scope.gridData = response[0];
              $scope.collection = response;
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.disableDept = true;
              $scope.btnName = "Reset";
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//dutyhours.html

    //modules/pay/reports/views/salregister.html
    .controller('SalRegisterCtrl', ['DataServices', '$scope', function (DataServices, $scope) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.data.DivId = 1;
        $scope.gridData = [];
        $scope.collection = [];
        $scope.content.viewMode = false;
        $scope.btnName = "View";
      }

      //------------------Select Months---------------------
      $scope.months = [
        { id: '0', name: '(Select)' },
        { id: '1', name: 'January' },
        { id: '2', name: 'February' },
        { id: '3', name: 'March' },
        { id: '4', name: 'April' },
        { id: '5', name: 'May' },
        { id: '6', name: 'June' },
        { id: '7', name: 'July' },
        { id: '8', name: 'August' },
        { id: '9', name: 'September' },
        { id: '10', name: 'October' },
        { id: '11', name: 'November' },
        { id: '12', name: 'December' }
      ];
      $scope.selectedMonth = $scope.months[0];
      $scope.selectMonth = function (selectedMonth) {
        $scope.month = selectedMonth.id;
      }
      //------------------------------------------------------

      //---------------Select Years---------------------------
      var dt = new Date();
      var yr = dt.getFullYear();
      $scope.years = [
        { id: '0', name: '(Select)' },
        { id: '1', name: yr - 3 },
        { id: '2', name: yr - 2 },
        { id: '3', name: yr - 1 },
        { id: '4', name: yr },
        { id: '5', name: yr + 1 },
        { id: '6', name: yr + 2 },
      ];
      $scope.selectedYear = $scope.years[0];
      $scope.selectYear = function (selectedYear) {
        $scope.year = selectedYear.name;
      }
      //-------------------------------------------------------

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          var para = {};
          para.DivId = $scope.data.DivId; para.month = $scope.month; para.year = $scope.year;
          DataServices.getData('GetSalaryRegister', para, function (response) {
            if ($scope.selectedMonth != $scope.months[0] && $scope.selectedYear != $scope.years[0] && response.length > 0) {
              $scope.gridData = response[0];
              $scope.collection = response;
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.content.viewMode = true;
              $scope.btnName = "Reset";
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//salregister.html

    //modules/pay/reports/views/salsummary.html
    .controller('SalSummaryCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
      $scope.reportData = {};
      $scope.data = {};
      $scope.data.DivId = 1;
      $scope.collection = [];
      $scope.reportData.date = getCurrentDate();

      loadMonths();
      loadYears();
      loadTypes();

      function loadMonths() {
        $scope.months = [
          { id: '0', name: '(Select)' },
          { id: '1', name: 'January' },
          { id: '2', name: 'February' },
          { id: '3', name: 'March' },
          { id: '4', name: 'April' },
          { id: '5', name: 'May' },
          { id: '6', name: 'June' },
          { id: '7', name: 'July' },
          { id: '8', name: 'August' },
          { id: '9', name: 'September' },
          { id: '10', name: 'October' },
          { id: '11', name: 'November' },
          { id: '12', name: 'December' }
        ];
        $scope.selectedMonth = $scope.months[0];
        $scope.selectMonth = function (selectedMonth) {
          $scope.month = selectedMonth.id;
        }
      }

      function loadYears() {
        var dt = new Date();
        var yr = dt.getFullYear();
        $scope.years = [
          { id: '0', name: '(Select)' },
          { id: '1', name: yr - 3 },
          { id: '2', name: yr - 2 },
          { id: '3', name: yr - 1 },
          { id: '4', name: yr },
          { id: '5', name: yr + 1 },
          { id: '6', name: yr + 2 },
        ];
        $scope.selectedYear = $scope.years[0];
        $scope.selectYear = function (selectedYear) {
          $scope.year = selectedYear.name;
        }
      }

      function loadTypes() {
        $scope.types = [
          { id: '0', name: '(Select)' },
          { id: '1', name: 'Salary Summary' },
          { id: '2', name: 'PT Summary' },
          { id: '3', name: 'PF Challan' },
          { id: '4', name: 'Pay Type Summary' },
        ];
        $scope.selectedType = $scope.types[0];
        $scope.selectType = function (selectedType) {
          $scope.type = selectedType.name;
        }
      }

      $scope.view = function () {
        if ($scope.type == '(Select)') {
          $scope.viewSalary = false;
          $scope.viewSalaryContent = false;
        }
        if ($scope.type == 'Salary Summary') {
          getSalarySummary();
        }
        if ($scope.type == 'PT Summary') {
          getSalaryContentSummary('.dbo.getPTSummary');
        }
        if ($scope.type == 'PF Challan') {
          getSalaryContentSummary('.dbo.getPFChallan');
        }
        if ($scope.type == 'Pay Type Summary') {
          getSalaryContentSummary('.dbo.getPayTypeSummary');
        }
      }

      function getSalarySummary() {
        $scope.result = {};
        var para = {};
        para.DivId = $scope.data.DivId; para.month = $scope.month; para.year = $scope.year;
        DataServices.getData('getSalarySummary', para, function (response) {
          $scope.collection = response;
          $scope.content.viewMode = true;
          $scope.viewSalary = true;
          $scope.viewSalaryContent = false;
        })
      }

      function getSalaryContentSummary(spName) {
        $scope.result = {};
        var para = {};
        para.DivId = $scope.data.DivId; para.month = $scope.month; para.year = $scope.year;
        DataServices.getData($rootScope.globals.currentDB.dbName + spName, para, function (response) {
          $scope.contents[$rootScope.currentModuleId].viewData = response;
          $scope.colHeaders = Object.keys($scope.contents[$rootScope.currentModuleId].viewData[0]);
          $scope.content.viewMode = true;
          $scope.viewSalaryContent = true;
          $scope.viewSalary = false;
        })
      }

      $scope.reset = function () {
        $scope.data = {};
        $scope.data.DivId = 1;
        $scope.collection = [];
        $scope.getCurrentDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.getCurrentTime = $filter('date')(new Date(), 'HH:mm:ss');

        loadMonths();
        loadYears();
        loadTypes();
      }
    }])//salsummary.html

    //modules/pay/reports/views/emploaninfo.html
    .controller('EmpLoanInfoCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
      initialise();
      function initialise() {
        $scope.reportData = {};
        $scope.data = {};
        $scope.total = {};
        $scope.collection = [];
        $scope.reportData.date = getCurrentDate();


        $scope.total.AddAmt = 0;
        $scope.total.LessAmt = 0;
        $scope.total.OutSidePaid = 0;
        $scope.Balance = 0;
        $scope.btnName = 'View';
        $scope.content.viewMode = false;
        $scope.disableEmp = false;
        $scope.$broadcast('angucomplete-alt:clearInput');

        // loadEmployees();
      }
      $scope.report = [{ companyName: 'Juliet Apparels ltd.', companyAddress: '313, Shah & Nahar ind. Estate, S.J. Marg, Lower Parel,, Mumbai - 400013, Maharashtra' }];

      var rpt = [];
      rpt = angular.fromJson($scope.report);
      $scope.report.companyName = rpt[0].companyName;
      $scope.report.companyAddress = rpt[0].companyAddress;

      // function loadEmployees(){

      DataServices.SelectData('Employees', 'firstName', function (response) {
        $scope.empName = response;
      })
      $scope.selectedEmp = function (selected) {
        if (selected) {
          $scope.data.EmpID = selected.originalObject.id;
        }
      }
      // }

      $scope.view = function () {
        if ($scope.btnName == 'Reset') {
          initialise();
        }
        else {
          var para = { divID: 1, EmpID: $scope.data.EmpID };
          DataServices.getData('getEmpLoanInfo', para, function (response) {
            if (response.length <= 0) {
              alert('No record found!!!');
              initialise();
            }
            else {
              $scope.data = response[0];
              $scope.collection = response;
              for (var i = 0; i < $scope.collection.length; i++) {
                $scope.total.AddAmt = $scope.total.AddAmt + $scope.collection[i].AddAmt;
                $scope.total.LessAmt = $scope.total.LessAmt + $scope.collection[i].LessAmt;
                $scope.total.OutSidePaid = $scope.total.OutSidePaid + $scope.collection[i].OutSidePaid;
              }
              $scope.Balance = $scope.total.AddAmt - ($scope.total.LessAmt + $scope.total.OutSidePaid);
              $scope.content.viewMode = true;
              $scope.disableEmp = true;
              $scope.btnName = 'Reset';
            }
          })
        }
      }
    }])//emploaninfo.html

    //modules/pay/reports/views/dutyhourssummary.html
    .controller('DutyHoursSummaryCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.data.DivId = 1;
        $scope.data.SDate = "2014-02-01";
        $scope.data.EDate = "2014-02-28";
        $scope.btnName = "View";
        $scope.content.viewMode = false;
        $scope.reportData = [];
      }

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          var para = { DivId: $scope.data.DivId, SDate: $scope.data.SDate, EDate: $scope.data.EDate };
          DataServices.getData('getDeptDutyHrs', para, function (response) {
            if (response.length <= 0) {
              alert("Data not found");
              initialise();
            }
            else {
              $scope.reportData = [];
              $scope.content.viewMode = true;
              $scope.btnName = "Reset";
              $scope.reportData = response;
              $scope.reportData.date = getCurrentDate();
              $scope.reportData.rpt_colHeaders = Object.keys($scope.reportData[0]);
            }
          })
        }
      }
    }])//dutyhourssummary.html

    //modules/pay/reports/views/irregularinfo.html
    .controller('IrregularInfoCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.gridData = {};
        $scope.data.DivId = 1;
        $scope.data.SDate = "2014-04-01";
        $scope.data.EDate = "2014-04-30";
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.btnName = "View";
        $scope.disableDept = false;
        $scope.content.viewMode = false;

        loadDepartments();
      }

      function loadDepartments() {
        $scope.requireDept = true;
        $scope.deptName = {};

        DataServices.SelectData('Dept', 'name', function (response) {
          $scope.deptName = response;
        })
        $scope.selectedDept = function (selected) {
          if (selected) {
            $scope.data.DeptId = selected.originalObject.id;
          }
        }
      }

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          var para = { DivId: $scope.data.DivId, DeptId: $scope.data.DeptId, IrregularDays: $scope.data.IrregularDays, SDate: $scope.data.SDate, EDate: $scope.data.EDate };
          DataServices.getData('getIrregularInfo', para, function (response) {
            if (response.length > 0) {
              $scope.gridData = response[0];
              $scope.collection = response;
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.content.viewMode = true;
              $scope.disableDept = true;
              $scope.btnName = "Reset";

              $scope.totalStatus = 0;
              for (var i = 0; i < $scope.collection.length; i++) {
                if ($scope.collection[i].Status == 'A') {
                  $scope.totalStatus = $scope.totalStatus + 1;
                }
              }
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//irregularinfo.html

    //modules/pay/reports/views/attendance.html
    .controller('AttendanceCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
      initialise();

      function initialise() {
        $scope.data = {};
        $scope.gridData = {};
        $scope.data.SDate = "2014-02-01";
        $scope.data.EDate = "2014-02-28";
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.btnName = "View";
        $scope.content.viewMode = false;
        $scope.disableDept = false;

        loadDepartments();
      }

      function loadDepartments() {
        $scope.requireDept = true;
        $scope.deptName = {};
        DataServices.SelectData('Dept', 'name', function (response) {
          $scope.deptName = response;
        })
        $scope.selectedDept = function (selected) {
          if (selected) {
            $scope.data.DeptID = selected.originalObject.id;
            $scope.gridData.Dept = selected.originalObject.name;
          }
        }
      }

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          $scope.result = {};
          var para = {};
          para.DivID = 1; para.DeptID = $scope.data.DeptID; para.SDate = $scope.data.SDate; para.EDate = $scope.data.EDate;
          DataServices.getData('GetAttendance', para, function (response) {
            if (response.length > 0) {
              $scope.collection = response;
              $scope.gridData = response[0];
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.content.viewMode = true;
              $scope.disableDept = true;
              $scope.btnName = "Reset";
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//attendance.html

    //modules/pay/reports/views/attndetails.html
    .controller('AttnDetailsCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.gridData = {};
        $scope.data.SDate = "2014-02-01";
        $scope.data.EDate = "2014-02-28";
        $scope.collectionM = [];
        $scope.btnName = "View";
        $scope.disableDept = false;
        $scope.content.viewMode = false;
        $scope.$broadcast('angucomplete-alt:clearInput');

        loadDepartments();
      }

      function loadDepartments() {
        $scope.requireDept = true;
        $scope.deptName = {};
        DataServices.SelectData('Dept', 'name', function (response) {
          $scope.deptName = response;
        })
        $scope.selectedDept = function (selected) {
          if (selected) {
            $scope.data.DeptID = selected.originalObject.id;
            $scope.gridData.Dept = selected.originalObject.name;
          }
        }
      }

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          $scope.result = {};
          var para = {};
          para.DivID = 1; para.DeptID = $scope.data.DeptID; para.SDate = $scope.data.SDate; para.EDate = $scope.data.EDate;
          DataServices.getData('GetAttendance', para, function (response) {
            if (response.length > 0) {
              $scope.content.viewMode = true;
              $scope.disableDept = true;
              $scope.btnName = "Reset";
              $scope.gridData = response[0];
              $scope.collection = response;
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.collectionM = [
                { id: '1', M_value: '' },
                { id: '2', M_value: '' },
                { id: '3', M_value: '' },
                { id: '4', M_value: '' },
                { id: '5', M_value: '' },
                { id: '6', M_value: '' },
                { id: '7', M_value: '' },
                { id: '8', M_value: '' },
                { id: '9', M_value: '' },
                { id: '10', M_value: '' },
                { id: '11', M_value: '' },
                { id: '12', M_value: '' },
                { id: '13', M_value: '' },
                { id: '14', M_value: '' },
                { id: '15', M_value: '' },
                { id: '16', M_value: '' },
                { id: '17', M_value: '' },
                { id: '18', M_value: '' },
                { id: '19', M_value: '' },
                { id: '20', M_value: '' },
                { id: '21', M_value: '' },
                { id: '22', M_value: '' },
                { id: '23', M_value: '' },
                { id: '24', M_value: '' },
                { id: '25', M_value: '' },
                { id: '26', M_value: '' },
                { id: '27', M_value: '' },
                { id: '28', M_value: '' },
                { id: '29', M_value: '' },
                { id: '30', M_value: '' },
              ];
              for (var i = 0; i < $scope.collection.length; i++) {
                if ($scope.collection[i].Status != 'P') {
                  $scope.collectionM[i].M_value = 'M';
                }
              }
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }

      $scope.reset = function () {
        initialise();
      }
    }])//attndetails.html

    //modules/pay/reports/views/attninfoshiftwise.html
    .controller('AttnInfoShiftWiseCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.gridData = {};
        $scope.data.SDate = "2014-02-01";
        $scope.data.EDate = "2014-02-28";
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.btnName = "View";
        $scope.disableDept = false;
        $scope.content.viewMode = false;

        loadDepartments();
      }

      function loadDepartments() {
        $scope.requireDept = true;
        $scope.deptName = {};
        DataServices.SelectData('Dept', 'name', function (response) {
          $scope.deptName = response;
        })
        $scope.selectedDept = function (selected) {
          if (selected) {
            $scope.data.DeptID = selected.originalObject.id;
            $scope.gridData.Dept = selected.originalObject.name;
          }
        }
      }

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          $scope.result = {};
          var para = {};
          para.DivID = 1; para.DeptID = $scope.data.DeptID; para.SDate = $scope.data.SDate; para.EDate = $scope.data.EDate;
          DataServices.getData('GetAttendance', para, function (response) {
            if (response.length > 0) {
              $scope.disableDept = true;
              $scope.content.viewMode = true;
              $scope.collection = response;
              $scope.gridData = response[0];
              $scope.reportData = []
              $scope.reportData.date = getCurrentDate();
              $scope.btnName = "Reset";
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//attninfoshiftwise.html

    //modules/pay/reports/views/attndetailsshiftwise.html
    .controller('AttnDetailsShiftWiseCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.gridData = {};
        $scope.data.SDate = "2014-02-01";
        $scope.data.EDate = "2014-02-28";
        $scope.collectionM = [];
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.btnName = "View";
        $scope.disableDept = false;
        $scope.content.viewMode = false;

        loadDepartments();
      }

      function loadDepartments() {
        $scope.requireDept = true;
        $scope.deptName = {};
        DataServices.SelectData('Dept', 'name', function (response) {
          $scope.deptName = response;
        })
        $scope.selectedDept = function (selected) {
          if (selected) {
            $scope.data.DeptID = selected.originalObject.id;
            $scope.gridData.Dept = selected.originalObject.name;
          }
        }
      }
      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          $scope.result = {};
          var para = {};
          para.DivID = 1; para.DeptID = $scope.data.DeptID; para.SDate = $scope.data.SDate; para.EDate = $scope.data.EDate;
          DataServices.getData('GetAttendance', para, function (response) {
            if (response.length > 0) {
              $scope.content.viewMode = true;
              $scope.disableDept = true;
              $scope.btnName = "Reset";
              $scope.gridData = response[0];
              $scope.collection = response;
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.collectionM = [
                { id: '1', M_value: '' },
                { id: '2', M_value: '' },
                { id: '3', M_value: '' },
                { id: '4', M_value: '' },
                { id: '5', M_value: '' },
                { id: '6', M_value: '' },
                { id: '7', M_value: '' },
                { id: '8', M_value: '' },
                { id: '9', M_value: '' },
                { id: '10', M_value: '' },
                { id: '11', M_value: '' },
                { id: '12', M_value: '' },
                { id: '13', M_value: '' },
                { id: '14', M_value: '' },
                { id: '15', M_value: '' },
                { id: '16', M_value: '' },
                { id: '17', M_value: '' },
                { id: '18', M_value: '' },
                { id: '19', M_value: '' },
                { id: '20', M_value: '' },
                { id: '21', M_value: '' },
                { id: '22', M_value: '' },
                { id: '23', M_value: '' },
                { id: '24', M_value: '' },
                { id: '25', M_value: '' },
                { id: '26', M_value: '' },
                { id: '27', M_value: '' },
                { id: '28', M_value: '' },
                { id: '29', M_value: '' },
                { id: '30', M_value: '' },
              ];

              for (var i = 0; i < $scope.collection.length; i++) {
                if ($scope.collection[i].Status != 'P') {
                  $scope.collectionM[i].M_value = 'M';
                }
              }
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//attndetailsshiftwise.html

    //modules/pay/reports/views/pfchallan.html
    .controller('PfChallanCtrl', ['DataServices', '$rootScope', '$scope', function (DataServices, $rootScope, $scope) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.data.DivId = 1;
        $scope.gridData = {};
        $scope.collection = [];
        $scope.btnName = "View";
        $scope.content.viewMode = false;

        loadMonths();
        loadYears();
      }

      function loadMonths() {
        $scope.months = [
          { id: '0', name: '(Select)' },
          { id: '1', name: 'January' },
          { id: '2', name: 'February' },
          { id: '3', name: 'March' },
          { id: '4', name: 'April' },
          { id: '5', name: 'May' },
          { id: '6', name: 'June' },
          { id: '7', name: 'July' },
          { id: '8', name: 'August' },
          { id: '9', name: 'September' },
          { id: '10', name: 'October' },
          { id: '11', name: 'November' },
          { id: '12', name: 'December' }
        ];
        $scope.selectedMonth = $scope.months[0];
        $scope.selectMonth = function (selectedMonth) {
          $scope.month = selectedMonth.id;
        }
      }

      function loadYears() {
        var dt = new Date();
        var yr = dt.getFullYear();
        $scope.years = [
          { id: '0', name: '(Select)' },
          { id: '1', name: yr - 5 },
          { id: '2', name: yr - 4 },
          { id: '3', name: yr - 3 },
          { id: '4', name: yr - 2 },
          { id: '5', name: yr - 1 },
          { id: '6', name: yr },
          { id: '7', name: yr + 1 },
          { id: '8', name: yr + 2 },
        ];
        $scope.selectedYear = $scope.years[0];
        $scope.selectYear = function (selectedYear) {
          $scope.year = selectedYear.name;
        }
      }

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          var para = { DivId: $scope.data.DivId, month: $scope.month, year: $scope.year };
          DataServices.getData('GetPFChallan', para, function (response) {
            if (response.length > 0) {
              $scope.gridData = response[0];
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.content.viewMode = true;
              $scope.btnName = "Reset";
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//pfchallan.html

    //modules/pay/reports/views/ptchallan.html
    .controller('PtChallanCtrl', ['DataServices', '$rootScope', '$scope', function (DataServices, $rootScope, $scope) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.data.DivId = 1;
        $scope.gridData = {};
        $scope.collection = [];
        $scope.btnName = "View";
        $scope.content.viewMode = false;

        loadMonths();
        loadYears();
      }

      $scope.report = [{ companyName: 'Juliet Apparels ltd.', companyAddress: '313, Shah & Nahar ind. Estate, S.J. Marg, Lower Parel,, Mumbai - 400013, Maharashtra' }];

      function loadMonths() {
        $scope.months = [
          { id: '0', name: '(Select)' },
          { id: '1', name: 'January' },
          { id: '2', name: 'February' },
          { id: '3', name: 'March' },
          { id: '4', name: 'April' },
          { id: '5', name: 'May' },
          { id: '6', name: 'June' },
          { id: '7', name: 'July' },
          { id: '8', name: 'August' },
          { id: '9', name: 'September' },
          { id: '10', name: 'October' },
          { id: '11', name: 'November' },
          { id: '12', name: 'December' }
        ];
        $scope.selectedMonth = $scope.months[0];
        $scope.selectMonth = function (selectedMonth) {
          $scope.month = selectedMonth.id;
        }
      }

      function loadYears() {
        var dt = new Date();
        var yr = dt.getFullYear();
        $scope.years = [
          { id: '0', name: '(Select)' },
          { id: '1', name: yr - 5 },
          { id: '2', name: yr - 4 },
          { id: '3', name: yr - 3 },
          { id: '4', name: yr - 2 },
          { id: '5', name: yr - 1 },
          { id: '6', name: yr },
          { id: '7', name: yr + 1 },
          { id: '8', name: yr + 2 },
        ];
        $scope.selectedYear = $scope.years[0];
        $scope.selectYear = function (selectedYear) {
          $scope.year = selectedYear.name;
        }
      }

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          var para = { DivId: $scope.data.DivId, month: $scope.month, year: $scope.year };
          DataServices.getData('getPTChallan', para, function (response) {
            if ($scope.selectedMonth != $scope.months[0] && $scope.selectedYear != $scope.years[0] && response.length > 0) {
              $scope.gridData = response[0];
              $scope.content.viewMode = true;
              $scope.btnName = "Reset";
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//ptchallan.html

    //modules/pay/reports/views/bonusregister.html
    .controller('BonusRegisterCtrl', ['DataServices', '$rootScope', '$scope', function (DataServices, $rootScope, $scope) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.gridData = {};
        $scope.data.DivId = 1;
        $scope.data.SDate = "2013-01-01";
        $scope.data.EDate = "2013-01-24";
        $scope.btnName = "View";
        $scope.content.viewMode = true;
        $scope.reportData = [];
        $scope.reportData.date = getCurrentDate();

        loadDepartments();
      }

      function loadDepartments() {
        $scope.requireDept = true;
        $scope.deptName = {};

        DataServices.SelectData('Dept', 'name', function (response) {
          $scope.deptName = response;
        })
        $scope.selectedDept = function (selected) {
          if (selected) {
            $scope.data.DeptId = selected.originalObject.id;
            $scope.gridData.Dept = selected.originalObject.name;
          }
        }
      }

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          $scope.result = {};
          var para = {};
          para.divID = $scope.data.divID; para.DeptId = $scope.data.DeptId; para.SDate = $scope.data.SDate; para.EDate = $scope.data.EDate;
          DataServices.getData('getBonusRegister', para, function (response) {
            if (response.length > 0) {
              $scope.gridData = response[0];
              $scope.collection = response;
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.content.viewMode = true;
              $scope.btnName = "Reset";
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }
    }])//bonusregister.html

    //modules/pay/reports/views/form16.html
    .controller('Form16Ctrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http, $filter) {
      $scope.data = {};
      $scope.data.DivId = 1;

      loadEmployees();
      loadYears();

      function loadEmployees() {
        $scope.requireEmp = true;
        $scope.empName = {};

        $http.post($rootScope.POSTRequestURL,
          {
            requestName: $rootScope.globals.currentDB.dbName + '.dbo.getSelectData',
            values: 'Employees, firstName'
          })
          .then(function (data) {
            $scope.empName = angular.fromJson(data.data);
          }, function (err) {
            alert(JSON.stringify(err));
          });

        $scope.selectedEmp = function (selected) {
          if (selected) {
            $scope.data.EmpID = selected.originalObject.id;
          }
        }
      }

      function loadYears() {
        var dt = new Date();
        var yr = dt.getFullYear();
        $scope.years = [
          { id: '0', name: '(Select)' },
          { id: '1', name: yr - 3 },
          { id: '2', name: yr - 2 },
          { id: '3', name: yr - 1 },
          { id: '4', name: yr },
          { id: '5', name: yr + 1 },
          { id: '6', name: yr + 2 },
        ];

        $scope.selectedFromYear = $scope.years[0];
        $scope.selectedToYear = $scope.years[0];

        $scope.selectFromYear = function (selectedFromYear) {
          $scope.fromYear = selectedFromYear.name;
        }
        $scope.selectToYear = function (selectedToYear) {
          $scope.toYear = selectedToYear.name;
        }
      }

      $scope.view = function () {
        $http.post($rootScope.POSTRequestURL,
          {
            requestName: $rootScope.globals.currentDB.dbName + '.dbo.getForm16',
            values: $scope.data.DivId + ',' + $scope.data.EmpID + ',' + $scope.fromYear + ',' + $scope.toYear
          })
          .then(function (data) {
          }, function (err) {
            alert(JSON.stringify(err));
          });
      }
    }])//form16.html

    //modules/pay/reports/views/form3A.html
    .controller('Form3ACtrl', ['DataServices', '$rootScope', '$scope', function (DataServices, $rootScope, $scope) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.total = {};
        $scope.data.DivId = 1;
        $scope.data.SDate = '2011-05-01';
        $scope.data.EDate = '2011-05-31';
        $scope.collection = [];
        $scope.content.viewMode = false;
        $scope.btnName = "View";
      }

      $scope.report = [{ companyName: 'Juliet Apparels ltd.', companyAddress: '313, Shah & Nahar ind. Estate, S.J. Marg, Lower Parel,, Mumbai - 400013, Maharashtra' }];
      var rpt = [];
      rpt = angular.fromJson($scope.report);
      $scope.report.companyName = rpt[0].companyName;
      $scope.report.companyAddress = rpt[0].companyAddress;

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          $scope.result = {};
          var para = {};
          para.divID = $scope.data.DivId; para.SDate = $scope.data.SDate; para.EDate = $scope.data.EDate;
          DataServices.getData('GetForm3A', para, function (response) {
            if (response.length > 0) {
              $scope.collection = response;
              $scope.gridData = response[0];
              $scope.content.viewMode = true;
              $scope.btnName = "Reset";
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }

      $scope.reset = function () {
        initialise();
      }
    }])//form3A.html

    //modules/pay/reports/views/form3A.html
    .controller('Form6ACtrl', ['DataServices', '$rootScope', '$scope', function (DataServices, $rootScope, $scope) {
      initialise();
      function initialise() {
        $scope.data = {};
        $scope.total = {};
        $scope.data.DivId = 1;
        $scope.data.SDate = '2011-05-01';
        $scope.data.EDate = '2011-05-31';
        $scope.collection = [];
        $scope.content.viewMode = false;
        $scope.btnName = "View";
      }
      $scope.report = [{ companyName: 'Juliet Apparels ltd.', companyAddress: '313, Shah & Nahar ind. Estate, S.J. Marg, Lower Parel,, Mumbai - 400013, Maharashtra' }];
      var rpt = [];
      rpt = angular.fromJson($scope.report);
      $scope.report.companyName = rpt[0].companyName;
      $scope.report.companyAddress = rpt[0].companyAddress;

      $scope.view = function () {
        if ($scope.btnName == "Reset") {
          initialise();
        }
        else {
          $scope.result = {};
          var para = {};
          para.divID = $scope.data.DivId; para.SDate = $scope.data.SDate; para.EDate = $scope.data.EDate;
          DataServices.getData('GetForm6A', para, function (response) {
            if (response.length > 0) {
              $scope.collection = response;
              // $scope.gridData = response[0];
              $scope.content.viewMode = true;
              $scope.btnName = "Reset";
            }
            else {
              alert("Data not found");
              initialise();
            }
          })
        }
      }

      $scope.reset = function () {
        initialise();
      }
    }])//form6A.html

    .controller('LoanRequestCtrl', ['DataServices', '$rootScope', '$scope', '$filter', function (DataServices, $rootScope, $scope, $filter) {
      initialize();
      function initialize() {
        $scope.data = {};
        $scope.total = {};
        $scope.collection = [];
        $scope.result = {};
        $scope.content.viewMode = false;
        $scope.btnName = 'View';

        $scope.total.Opg = 0;
        $scope.total.Advance = 0;
        $scope.total.Deduction = 0;
        $scope.total.OutSideLoanPaid = 0;
        $scope.total.Closing = 0;

        loadMonths();
        loadYears();
      }
      $scope.report = [{ companyName: 'Juliet Apparels ltd.', companyAddress: '313, Shah & Nahar ind. Estate, S.J. Marg, Lower Parel,, Mumbai - 400013, Maharashtra' }];

      var rpt = [];
      rpt = angular.fromJson($scope.report);
      $scope.report.companyName = rpt[0].companyName;
      $scope.report.companyAddress = rpt[0].companyAddress;

      if ($scope.currentModule == 'Advance Request Information') {
        $scope.rptTitle = 'Advance Request Form';
      }
      else {
        if ($scope.currentModule == 'Deduction Request Information') {
          $scope.rptTitle = 'Deduction Request Form';
        }
        else {
          $scope.rptTitle = 'Loan & Advance Register';
        }
      }

      function loadMonths() {
        var dt = new Date();
        var dm = dt.getMonth()
        $scope.months = [
          { id: '1', name: 'January' },
          { id: '2', name: 'February' },
          { id: '3', name: 'March' },
          { id: '4', name: 'April' },
          { id: '5', name: 'May' },
          { id: '6', name: 'June' },
          { id: '7', name: 'July' },
          { id: '8', name: 'August' },
          { id: '9', name: 'September' },
          { id: '10', name: 'October' },
          { id: '11', name: 'November' },
          { id: '12', name: 'December' }
        ];
        $scope.selectedMonth = $scope.months[dm];
        $scope.data.month = $scope.months[dm].id;
        $scope.selectMonth = function (selectedMonth) {
          $scope.data.month = selectedMonth.id;
        }
      }

      function loadYears() {
        var dt = new Date();
        var yr = dt.getFullYear();
        $scope.years = [
          { id: '1', name: yr - 3 },
          { id: '2', name: yr - 2 },
          { id: '3', name: yr - 1 },
          { id: '4', name: yr },
          { id: '5', name: yr + 1 },
          { id: '6', name: yr + 2 },
        ];
        $scope.selectedYear = $scope.years[3];
        $scope.data.year = $scope.years[3].name;
        $scope.selectYear = function (selectedYear) {
          $scope.data.year = selectedYear.name;
        }
      }

      $scope.view = function () {
        if ($scope.btnName == 'Reset') {
          initialize();
        }
        else {
          var para = { DivID: 1, month: $scope.data.month, year: $scope.data.year };
          DataServices.getData('GetloanInfo', para, function (response) {
            $scope.collection = response;
            if ($scope.collection.length > 0) {
              $scope.btnName = 'Reset';
              $scope.reportData = [];
              $scope.reportData.date = getCurrentDate();
              $scope.content.viewMode = true;
              for (var i = 0; i < $scope.collection.length; i++) {
                $scope.total.Opg = $scope.total.Opg + $scope.collection[i].Opg;
                $scope.total.Advance = $scope.total.Advance + $scope.collection[i].Advance;
                $scope.total.Deduction = $scope.total.Deduction + $scope.collection[i].Deduction;
                $scope.total.OutSideLoanPaid = $scope.total.OutSideLoanPaid + $scope.collection[i].OutSideLoanPaid;
                $scope.total.Closing = $scope.total.Closing + $scope.collection[i].Closing;
              }
            }
            else {
              alert('No record found!!!');
              initialize();
            }
          })
        }
      }
    }])//loanrequest.html

    //modules/pay/reports/views/payslip.html
    .controller('PaySlipCtrl', ['DataServices', '$rootScope', '$scope', function (DataServices, $rootScope, $scope) {
      $scope.btnName="Search";
     
      ////------------------Select Months---------------------
      var dt = new Date();
      var yr = dt.getFullYear();
      var mt = dt.getMonth();

      $scope.months = [{
          id: '0',
          name: 'January'
        },
        {
          id: '1',
          name: 'February'
        },
        {
          id: '2',
          name: 'March'
        },
        {
          id: '3',
          name: 'April'
        },
        {
          id: '4',
          name: 'May'
        },
        {
          id: '5',
          name: 'June'
        },
        {
          id: '6',
          name: 'July'
        },
        {
          id: '7',
          name: 'August'
        },
        {
          id: '8',
          name: 'September'
        },
        {
          id: '9',
          name: 'October'
        },
        {
          id: '10',
          name: 'November'
        },
        {
          id: '11',
          name: 'December'
        }
      ];
      $scope.selectedMonth = $scope.months[mt];
      $scope.selectMonth = function (selectedMonth) {
        $scope.month = selectedMonth.id;
      }
      //------------------------------------------------------

      //---------------Select Years---------------------------
      $scope.years = [{
          id: '1',
          name: yr - 3
        },
        {
          id: '2',
          name: yr - 2
        },
        {
          id: '3',
          name: yr - 1
        },
        {
          id: '4',
          name: yr
        },
      ];
      $scope.selectedYear = $scope.years[3];
      $scope.selectYear = function (selectedYear) {
        $scope.year = selectedYear.name;
      }

      DataServices.SelectData('dept', 'name', function (response) {
        $scope.departments = response;
        $scope.selectedDepartment = $scope.departments[0];
        $scope.selectDepartment = function (selected) {
          $scope.data.deptID = selected.id;
        };
      });

       //---------------------Autocomplete Employees-----------------------
       DataServices.SelectData('Employees', 'name', function (response) {
         $scope.employees = response;
       })
       $scope.selectedEmp = function (selected) {
         if (selected) {
           $scope.data.EmpID = selected.originalObject.id;
         }
       }
    }]) //payslip.html
})();
