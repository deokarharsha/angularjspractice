(function() {
  'use strict';
  
  angular.module('Payroll')
  
  /**
  * @ngdoc controller
  * @name Main.Trans:AttnTransCtrl
  * @description
  * <strong>Database: <span style="color: orange">Payroll</span>
  * Table: <span style="color: orange">Companies</span>
  * Type: <span style="color: magenta">Master</span></strong>
  *
  * <strong>View: <span style="color: green">&lt;root&gt;/modules/pay/main/views/company.html</span></strong>
  *
  * <strong>Dependancies:</strong> <span class="label label-success">DataServices</span>&nbsp;
  * <span class="label label-info">$scope</span>&nbsp;<span class="label label-info">$filter</span>
  */
  .controller('AttnTransCtrl',['DataServices','$rootScope','$scope', function (DataServices, $rootScope, $scope){
    $scope.data = {ID:0};
    $scope.viewMode = false;

  
    //-----------------Autocomplete Employee------------------------------
    DataServices.SelectData('Employees','firstName',function(response){
      $scope.employees = response;
      $scope.selectedEmp = function(selected) {
        if (selected) {
         $scope.data.empID = selected.originalObject.id;
        }
      }
    })
    //--------------------------------------------------------------------

    //-----------------Select Shifts--------------------------------------
    DataServices.SelectData('Shifts','code',function(response){
      $scope.shifts = response;
      $scope.selectedShift = $scope.shifts[0];
      $scope.selectShift = function(selectedShift) {
        $scope.data.shiftID= selectedShift.name;
      }
    })
    //--------------------------------------------------------------------

    //----------------Select Months---------------------------------------
    $scope.months= [
      {id:'0', name:'(Select)'},
      {id:'1', name:'January' },
      {id:'2', name:'February'},
      {id:'3', name:'March'},
      {id:'4', name:'April'},
      {id:'5', name:'May'},
      {id:'6', name:'June'},
      {id:'7', name:'July'},
      {id:'8', name:'August'},
      {id:'9', name:'September'},
      {id:'10', name:'October'},
      {id:'11', name:'November'},
      {id:'12', name:'December'}
    ];
    $scope.selectedMonth = $scope.months[0];
    $scope.selectMonth= function(selectedMonth){
         $scope.month = selectedMonth.id;
    }
    //---------------------------------------------------------------------

    //--------------------Select years-------------------------------------
    var dt = new Date();
    var yr = dt.getFullYear();
    $scope.years= [
      {id:'0', name: '(Select)'},
      {id:'1', name: yr - 3},
      {id:'2', name: yr - 2},
      {id:'3', name: yr - 1},
      {id:'4', name: yr},
      {id:'5', name: yr + 1},
      {id:'6', name: yr + 2},
    ];
    $scope.selectedYear = $scope.years[0];
    $scope.selectYear= function(selectedYear){
       $scope.year = selectedYear.name;
    }
    //----------------------------------------------------------------------

    $scope.setEditMode = function(value) {
      $scope.editMode = value;
    }

    $scope.view = function(){
      var para= {empID:$scope.data.empID, shiftID:$scope.data.shiftID, month:$scope.month, year:$scope.year};
      DataServices.getData('getAttnTransData', para, function(response){
        $scope.attns = response;
        if($scope.attns == ''){
          $scope.viewMode = true;
        }
      })
    }

    $scope.setStatus = function(status){
      $scope.data.NoOfDays = 30;
      var para = {EmpId:$scope.data.empID,Month:$scope.month,Year:$scope.year,NoOfDays:$scope.data.NoOfDays,Shift:$scope.data.shiftID,Status:status};

      if(status == 'X'){
        document.getElementById('Present').disabled = true;
        document.getElementById('Absent').disabled = true;
      }
      if(status == 'P'){
        document.getElementById('Schedule').disabled = true;
        document.getElementById('Absent').disabled = true;
      }
      if(status == 'A'){
        document.getElementById('Schedule').disabled = true;
        document.getElementById('Present').disabled = true;
      }
      DataServices.Submit('InsertAttn', para, function(response){
        $scope.result = response;
        $scope.view();
      })
    }

    $scope.edit = function(id){
      $scope.result = {};
      DataServices.Edit('AttnTrans', id, function(response){
        $scope.attn = response;
      })
    }

    $scope.save = function (para) {
      para = {ID:para.ID, status:para.status};
      DataServices.Submit('doAttnTrans', para, function(response){
        $scope.result = response;
        $scope.view();
      })
    }

    $scope.reset = function() {
      $scope.selectedShift = $scope.shifts[0];
      $scope.selectedMonth = $scope.months[0];
      $scope.selectedYear = $scope.years[0];
      $scope.attns = {};
      $scope.$broadcast('angucomplete-alt:clearInput');

      document.getElementById('Schedule').disabled = false;
      document.getElementById('Present').disabled = false;
      document.getElementById('Absent').disabled = false;
    }
}])//attn.html

//pay/trans/views/sal.html
.controller('SalCtrl',['DataServices','$rootScope','$scope', function (DataServices, $rootScope, $scope){
    $scope.data = {};
    $scope.btnName="View";
    //----------------Autocomplete Divisions--------------------------
    DataServices.SelectData('divisions','Name',function(response){
      $scope.divisions = response;
      $scope.selectedDiv = function(selected) {
        if (selected) {
          $scope.data.divID = selected.originalObject.id;
        }
      }
    })
    //-----------------------------------------------------------------

    //----------------Select Months------------------------------------
    var dt = new Date();
    var dm = dt.getMonth();
    $scope.months= [
      {id:'1', name:'January'},
      {id:'2', name:'February'},
      {id:'3', name:'March'},
      {id:'4', name:'April'},
      {id:'5', name:'May'},
      {id:'6', name:'June'},
      {id:'7', name:'July'},
      {id:'8', name:'August'},
      {id:'9', name:'September'},
      {id:'10', name:'October'},
      {id:'11', name:'November'},
      {id:'12', name:'December'}
    ];
    $scope.selectedMonth = $scope.months[dm];
    $scope.data.month = $scope.months[dm].id;
    $scope.selectMonth= function(selectedMonth){
         $scope.data.month = selectedMonth.id;
    }
    //-------------------------------------------------------------------

    //----------------------Select Years---------------------------------
    var dy = dt.getFullYear();
    $scope.years= [
        { name: dy },
        { name: dy - 2 },
        { name: dy - 1 },
        { name: dy + 1 },
        { name: dy + 2 },
    ];
    $scope.selectedYear = $scope.years[0];
    $scope.data.year = $scope.years[0].name;
    $scope.selectYear= function(selectedYear){
         $scope.data.year = selectedYear.name;
    }
    //--------------------------------------------------------------------

    $scope.view = function(){
      var para= {tblName:$scope.contents[$rootScope.currentModuleId].tblName,divID:$scope.data.divID,month:$scope.data.month,year:$scope.data.year};
      DataServices.getData('getSalTransData', para, function(response){
        $scope.salaries = response;
      })
    }


    $scope.bindForm = function(){
       if($scope.btnName =="Reset"){
         $scope.$broadcast('angucomplete-alt:clearInput','Divisions');
         $scope.salaries = {};
         $scope.selectedMonth = $scope.months[dm];
         $scope.selectedYear = $scope.years[0];
         $scope.btnName="View";
       }
       else{
         $scope.view();
         $scope.btnName = "Reset";
      }
    }

    $scope.deleteSal = function() {
      $scope.result = {};
      var para= {divID:$scope.data.divID,month:$scope.data.month,year:$scope.data.year};
      DataServices.Submit('deleteSalary', para, function(response){
        $scope.result = response;
        $scope.bindForm();
      })
    }
}])//sal.html
//modules/pay/trans/views/pf-data.html
.controller('PfDataCtrl',['DataServices','$rootScope','$scope', function (DataServices, $rootScope, $scope){
    $scope.data = {ID:0};
    $scope.btnName="View";

    //-----------------Autocomplete Employee------------------------------
    DataServices.SelectData('Employees','firstName',function(response){
      $scope.employees = response;
      $scope.selectedEmp = function(selected) {
        if (selected) {
         $scope.data.empID = selected.originalObject.id;
        }
      }
    })
    //--------------------------------------------------------------------

    //-----------------Select Months--------------------------------------
    $scope.months= [
      {id:'0', name:'(Select)'},
      {id:'1', name:'January'},
      {id:'2', name:'February'},
      {id:'3', name:'March'},
      {id:'4', name:'April'},
      {id:'5', name:'May'},
      {id:'6', name:'June'},
      {id:'7', name:'July'},
      {id:'8', name:'August'},
      {id:'9', name:'September'},
      {id:'10', name:'October'},
      {id:'11', name:'November'},
      {id:'12', name:'December'}
    ];
    $scope.selectedMonth = $scope.months[0];
    $scope.selectMonth= function(selectedMonth){
        $scope.month = selectedMonth.id;
    }
    //------------------------------------------------------------------

    //--------------------Select Years----------------------------------
    var dt = new Date();
    var yr = dt.getFullYear();
    $scope.years= [
      {id:'0', name: '(Select)'},
      {id:'1', name: yr - 5},
      {id:'2', name: yr - 4},
      {id:'3', name: yr - 3},
      {id:'4', name: yr - 2},
      {id:'5', name: yr - 1},
      {id:'6', name: yr},
      {id:'7', name: yr + 1},
      {id:'8', name: yr + 2},
    ];
    $scope.selectedYear = $scope.years[0];
    $scope.selectYear= function(selectedYear){
        $scope.year = selectedYear.name;
    }
    //------------------------------------------------------------------

    $scope.view = function() {
      if($scope.btnName =="Reset"){
        $scope.pftrans = [];
        $scope.result = {};
        $scope.selectedMonth = $scope.months[0];
        $scope.selectedYear = $scope.years[0];
        $scope.btnName="View";
      }
      else{
        var para= {divID:1,month:$scope.month,year:$scope.year};
        DataServices.getData('getPFdata', para, function(response){
          $scope.pftrans = response;
        })
        $scope.btnName = "Reset";
      }
    }

    $scope.save = function (para) {
      para = {ID:para.ID, divID:1, empID:para.empID, month:$scope.month, year:$scope.year, gross:para.gross, pf:para.pf, epfDiff:para.epfDiff, pfContro:para.pfContro};
      DataServices.Submit('doPFTrans', para, function(response){
        $scope.result = response;
        $scope.btnName = "View";
        $scope.view();
        $scope.data = {ID:0};
        $scope.$broadcast('angucomplete-alt:clearInput');
      })
    }

    $scope.setEditMode = function(value) {
      $scope.editMode = value;
    }
}])//PfData

//modules/pay/trans/views/esic-data.html
.controller('EsicDataCtrl',['DataServices','$rootScope','$scope', function (DataServices, $rootScope, $scope){
    $scope.data = {ID:0};
    $scope.btnName="View";

    //----------------------Select Employees---------------------------------
    DataServices.SelectData('Employees','firstName',function(response){
      $scope.employees = response;
      $scope.selectedEmployee = function(selected) {
        if (selected) {
          $scope.data.empID = selected.originalObject.id;
        }
      }
    })
    //---------------------------------------------------------------------

    //----------------Select Months----------------------------------------
    var dt = new Date();
    var dm = dt.getMonth();
    $scope.months= [
      {id:'1', name:'January'},
      {id:'2', name:'February'},
      {id:'3', name:'March'},
      {id:'4', name:'April'},
      {id:'5', name:'May'},
      {id:'6', name:'June'},
      {id:'7', name:'July'},
      {id:'8', name:'August'},
      {id:'9', name:'September'},
      {id:'10', name:'October'},
      {id:'11', name:'November'},
      {id:'12', name:'December'}
    ];
    $scope.selectedMonth = $scope.months[dm];
    $scope.data.month = $scope.months[dm].id;
    $scope.selectMonth= function(selectedMonth){
         $scope.data.month = selectedMonth.id;
    }
    //-------------------------------------------------------------------

    //----------------------Select Years---------------------------------
    var dy = dt.getFullYear();
    $scope.years= [
        { name: dy },
        { name: dy - 2 },
        { name: dy - 1 },
        { name: dy + 1 },
        { name: dy + 2 },
    ];
    $scope.selectedYear = $scope.years[0];
    $scope.data.year = $scope.years[0].name;
    $scope.selectYear= function(selectedYear){
         $scope.data.year = selectedYear.name;
    }
    //--------------------------------------------------------------------

    $scope.setEditMode = function(value) {
      $scope.editMode = value;
    }

    $scope.save = function (para) {
      para = {ID:para.ID, divID:1, empID:para.empID, month:$scope.data.month, year:$scope.data.year, gross:para.gross, esicAmt:para.esicAmt, employeesContribution:para.employeesContribution, employerContribution:para.employerContribution};
      DataServices.Submit('doESICTrans', para , function(response){
        $scope.result = response;
        $scope.btnName ="View";
        $scope.view();
        $scope.data = {ID:0};
      })
    }

    $scope.view = function() {
      if($scope.btnName =="Reset"){
        $scope.esic = [];
        $scope.selectedMonth = $scope.months[dm];
        $scope.selectedYear = $scope.years[0];
        $scope.btnName = "View";
      }
      else{
        var para= {divID:1,month:$scope.data.month,year:$scope.data.year};
        DataServices.getData('getESICData', para, function(response){
          $scope.esicTrans = response;
          $scope.btnName = "Reset";
        })
      }
    }
}])//esic data

//pay/trans/views/loan.html
.controller('LoanCtrl',['DataServices','$scope','$filter', function (DataServices, $scope, $filter){
    $scope.data = {ID:0, loanID:'', loanDt:'', empID:'', method:'', loanAmt:undefined, loanInt:undefined, totAmt:undefined, totMonth:undefined, deduct:undefined};
    $scope.txtgrid = {ID:0};
    $scope.loans = [];

    var addAmt = 0;
    var lessAmt = 0;
    var outSidePaid = 0;

    //---------------------Autocomplete Employees------------------------
    DataServices.SelectData('Employees','firstName',function(response){
      $scope.employees = response;
    })
    $scope.selectedEmp = function(selected) {
      if (selected) {
       $scope.data.empID = selected.originalObject.id;
       $scope.selectedEmpName = selected.originalObject.name;
      }
    }
    //-------------------------------------------------------------------

    function bindLoanTransGrid(){
      var para= {tblName:'LoanTrans',ID:0,loanID:$scope.data.loanID};
      DataServices.getData('getTransSearchData', para, function(response){
        $scope.loans = response;
        for(var i=0; i < $scope.loans.length;i++){
          addAmt = addAmt + $scope.loans[i].addAmt;
          lessAmt = lessAmt + $scope.loans[i].lessAmt;
          outSidePaid = outSidePaid + $scope.loans[i].outSidePaid;
        }
        $scope.balAmt = addAmt - (lessAmt + outSidePaid);
      })
    }

    $scope.addToGrid = function(grid){
      if($scope.txtgrid.deductDt == null){
        $scope.result.error = 'Please fill deduct Dt';
      }
      else {
        $scope.loans.push(grid);
        addAmt = addAmt + $scope.txtgrid.addAmt;
        lessAmt = lessAmt + $scope.txtgrid.lessAmt;
        outSidePaid = outSidePaid + $scope.txtgrid.outSidePaid ;
        $scope.balAmt = addAmt - (lessAmt + outSidePaid);
        $scope.txtgrid = {};
      }
    }

    $scope.remove = function(grid){
      $scope.result = {};
      var index = $scope.loans.indexOf(grid);
      if(index != ''){
        $scope.loans.splice(index,1);
      }
      else{
        var para= {tblName:'LoanTrans',ID:grid.ID,LoanID:0};
        DataServices.Submit('getTransSearchData', para, function(response){
          $scope.result = response;
          bindLoanTransGrid();
          $scope.result = {};
        })
      }
    }

    $scope.submit = function () {
      $scope.result = {};
      DataServices.Submit('doLoan', $scope.data, function(response){
        $scope.result = response;
        if($scope.result.error == undefined){
          saveGrid();
        }
        else{
          $scope.result.error = 'Loan Details are not saved..';
        }
      })
    }

    function saveGrid(){
      if($scope.loans != {}){
          for(var i = 0; i < $scope.loans.length ;i++){
            $scope.loans = [{ID:$scope.loans[i].ID, loanID:$scope.data.loanID, empID:$scope.data.empID, deductDt:$scope.loans[i].deductDt, addAmt:$scope.loans[i].addAmt,
                                  lessAmt:$scope.loans[i].lessAmt, outSidePaid:$scope.loans[i].outSidePaid, loanAdv:$scope.loans[i].loanAdv}];
            DataServices.Submit('doLoanDeduct', $scope.loans[i], function(response){
              $scope.result = response;
              bindLoanTransGrid();
            })
          }
       }
    }

    $scope.saveRows = function (id) {
      $scope.result = {};
      $scope.loan = {ID:id, loanID:$scope.data.loanID, empID: $scope.data.empID, deductDt: $scope.loan.deductDt, addAmt: $scope.loan.addAmt, lessAmt: $scope.loan.lessAmt,
                    outSidePaid: $scope.loan.outSidePaid, loanAdv: $scope.loan.loanAdv};
      DataServices.Submit('doLoanDeduct', $scope.loan, function(response){
        $scope.result = response;
        bindLoanTransGrid();
        $scope.result = {};
      })
    }

    $scope.edit = function(id) {
      $scope.result = {};
      DataServices.Edit('Loans', id, function(response){
        $scope.data = response;
        bindLoanTransGrid();
        $scope.$broadcast('angucomplete-alt:changeInput', 'Employee', $filter('filter')($scope.employees, {'id': $scope.data.empID}, true)[0]);
      })
    }

    $scope.reset = function() {
      $scope.data = {ID:0, loanID:'', loanDt:'', empID:'', method:'', loanAmt:undefined, loanInt:undefined, totAmt:undefined, totMonth:undefined, deduct:undefined};
      $scope.txtgrid = {ID:0};
      $scope.loans = [];
      $scope.$broadcast('angucomplete-alt:clearInput','Employee');
      $scope.balAmt = '';
    }
}])//loan
//pay/trans/views/loan-Deduct.html
.controller('LoanDeductCtrl',['DataServices','$rootScope','$scope', function (DataServices, $rootScope, $scope){
    $scope.data = {};
    $scope.btnName = "View";

    DataServices.SelectData('Divisions','Name',function(response){
      $scope.divisionName = response;
    })
    $scope.selectedDivision = function(selected) {
      if (selected) {
       $scope.data.divID = selected.originalObject.id;
      }
    }

    var dt = new Date();
    var dm = dt.getMonth();
    $scope.months= [
        {id:'1', name:'January'},
        {id:'2', name:'February'},
        {id:'3', name:'March'},
        {id:'4', name:'April'},
        {id:'5', name:'May'},
        {id:'6', name:'June'},
        {id:'7', name:'July'},
        {id:'8', name:'August'},
        {id:'9', name:'September'},
        {id:'10', name:'October'},
        {id:'11', name:'November'},
        {id:'12', name:'December'}
    ];
    // $scope.selectedMonth = $scope.months[0];
    $scope.selectedMonth = $scope.months[dm];
    $scope.data.month = $scope.months[dm].id;
    $scope.selectMonth= function(selectedMonth){
         $scope.data.month = selectedMonth.id;
    }

    var dy = dt.getFullYear();
    $scope.years= [
        { name: dy },
        { name: dy - 2 },
        { name: dy - 1 },
        { name: dy + 1 },
        { name: dy + 2 },
    ];
    $scope.selectedYear = $scope.years[0];
    $scope.data.year = $scope.years[0].name;
    $scope.selectYear= function(selectedYear){
         $scope.data.year = selectedYear.name;
    }

    $scope.bindGrid = function(){
      if($scope.btnName =="Reset"){
        $scope.data = {};
        $scope.loans = {};
        $scope.$broadcast('angucomplete-alt:clearInput');
        $scope.btnName = "View";
        $scope.selectedMonth = $scope.months[dm];
        $scope.selectedYear = $scope.years[0];
       }
      else{
        $scope.btnName = "Reset";
        $scope.data = {divID:$scope.data.divID , month:$scope.data.month, year:$scope.data.year};
        DataServices.getData('getLoanDeductData', $scope.data, function(response){
          $scope.loans = response;
        })
      }
    }

    $scope.save = function (para) {
      para = {ID:para.ID, loanID:'', empID:'', deductDt:'', addAmt:0, lessAmt:para.lessAmt, outSidePaid:para.outSidePaid, loanAdv:'D'};
      DataServices.Submit('doLoanDeduct', para, function(response){
        $scope.result = response;
        $scope.btnName = "View";
        $scope.bindGrid();
      })
    }
}])//loanDeduction

//pay/trans/views/IT.html
.controller('ItCtrl',['DataServices','$scope', function (DataServices, $scope){
    $scope.data = {ID:0, divID:1, empID:'', fromYear:0, toYear:0, sec17_1:0, sec17_2:0, sec17_3:0, sec17_Add:0, sec17GrossTot:0, sec17NetTot:0, entAllowance:0,
                  employmentTax:0, stdDeductTot:0, chargeTotIncome:0, grossTotIncome:0, it80CCC:0, it80CCD:0, chapter6ATot:0, totIncome:0, totIncomeTax:0,
                  surcharge:0, eduCess:0, grossTaxPayable:0, releif89:0, netTaxPayable:0, sec192_1:0, sec192_1A:0, totalTax:0};
    $scope.btnName="View";
    $scope.allowances = [];
    $scope.otherIncomes = [];
    $scope.IT80Cs=[];
    $scope.IT80Es=[];

    // ------------------------autocomplete employees---------------------
    DataServices.SelectData('Employees','Name',function(response){
        $scope.employees = response;
        $scope.selectedEmployee = function(selected) {
          if (selected) {
           $scope.data.empID = selected.originalObject.id;
           $scope.empName = selected.originalObject.name;
           $scope.gender = selected.originalObject.gender;
          }
        }
      })
    //---------------------------------------------------------------------
    // ------------------------select year---------------------------------
      var dt = new Date();
      var dy = dt.getFullYear();
      $scope.years= [
          { name: dy - 2 },
          { name: dy - 1 },
          { name: dy },
          { name: dy + 1 },
          { name: dy + 2 },
      ];

      $scope.selectedFromYear = $scope.years[1];
      $scope.selectedToYear = $scope.years[2];

      $scope.data.fromYear = $scope.years[1].name;
      $scope.data.toYear = $scope.years[2].name;

      $scope.selectFromYear= function(selectedFromYear){
       $scope.data.fromYear = selectedFromYear.name;
      }
      $scope.selectToYear= function(selectedToYear){
         $scope.data.toYear = selectedToYear.name;
      }
    //---------------------------------------------------------------------

    $scope.calculateOnChange = function(){
       $scope.data.sec17GrossTot = $scope.data.sec17_1 + $scope.data.sec17_Add + $scope.data.sec17_2 + $scope.data.sec17_3;
    }
    // calculation
    $scope.$watch('[data.sec17_1 , data.sec17_Add, data.sec17_2, data.sec17_3,data.sec17GrossTot, data.entAllowance , \
                    data.employmentTax,data.sec17NetTot, data.stdDeductTot,data.chargeTotIncome, data.it80CCC, data.it80CCD,data.grossTotIncome, data.chapter6ATot, \
                    data.totIncome, data.totIncomeTax, data.surcharge, data.eduCess,\
                    data.grossTaxPayable, data.releif89, data.sec192_1, data.sec192_1A, data.netTaxPayable]',function(){
          // 1
          // $scope.data.sec17GrossTot = $scope.data.sec17_1 + $scope.data.sec17_Add + $scope.data.sec17_2 + $scope.data.sec17_3;
          //3
          var less = 0;
          for(var i = 0; i < $scope.allowances.length ;i++){
            less = less +  $scope.allowances[i].amount;
          }
          $scope.data.sec17NetTot = $scope.data.sec17GrossTot - less;
          // 5
          $scope.data.stdDeductTot = ($scope.data.entAllowance + $scope.data.employmentTax) /2;
          //6
          $scope.data.chargeTotIncome = $scope.data.sec17NetTot - $scope.data.stdDeductTot ;
          //8
          var add = 0;
          for(var i = 0; i < $scope.otherIncomes.length ;i++){
            add = add +  $scope.otherIncomes[i].amount;
          }
          $scope.data.grossTotIncome = $scope.data.chargeTotIncome + add;
          //10
          calc10();
          //11
          $scope.data.totIncome= $scope.data.grossTotIncome - $scope.data.chapter6ATot;
          //12
          if($scope.viewForm == true){
            getIncomeTax();
          }
          //15
          $scope.data.grossTaxPayable= $scope.data.totIncomeTax + $scope.data.surcharge + $scope.data.eduCess;
          //17
          $scope.data.netTaxPayable= $scope.data.grossTaxPayable - $scope.data.releif89;
          //19
          $scope.data.totalTax = $scope.data.netTaxPayable - ($scope.data.sec192_1 + $scope.data.sec192_1A);
    });


    function calc10(){
       var grid80C = 0;
       var grid80E = 0;
       for(var i = 0; i < $scope.IT80Cs.length ;i++){
          grid80C = grid80C +  $scope.IT80Cs[i].amount;
       }

       for(var i = 0; i < $scope.IT80Es.length ;i++){
         grid80C = grid80C +  $scope.IT80Es[i].amount;
       }
       $scope.data.chapter6ATot = ($scope.data.it80CCC + $scope.data.it80CCD + grid80C + grid80E) / 4 ;
    }


    function getIncomeTax(){
      var para = {fromYear:$scope.data.fromYear, toyear:$scope.data.toYear, gender:$scope.gender};
      DataServices.getData('getITYears',para,function(response){
          $scope.IncomeTax = response;
          for(var i = 0; i < response.length; i++){
            if (response[i].fromAmt <= $scope.data.totIncome && response[i].toAmt >= $scope.data.totIncome){
              $scope.data.totIncomeTax = ($scope.data.totIncome*response[i].taxPer)/100;
            }
          }
      })
    }

    //grids add and delete of Less
    $scope.addAllowance = function(grid){
      if($scope.allowanceData.amount == null || $scope.allowanceData.name == null){
        $scope.result.error = 'please fill textbox';
      }
      else {
        grid = {ID:0, name:grid.name, amount:grid.amount};
        $scope.allowances.push(grid);
        $scope.data.sec17NetTot =   $scope.data.grossTotIncome - grid.amount;
        $scope.allowanceData = {};
        $scope.result = {};
      }
    }
    $scope.removeAllowance = function(grid){
      $scope.data.sec17NetTot = $scope.data.sec17NetTot + grid.amount;
      $scope.allowances.splice(grid,1);
    }
    //Less

    //grids add and delete of Add
    $scope.addOtherIncome = function(grid){
      if($scope.otherIncomeData.name == null || $scope.otherIncomeData.amount == null){
        $scope.result.error = 'please fill Addtional income Name and Amount';
      }
      else {
        grid = {ID:0, name:grid.name, amount:grid.amount};
        $scope.otherIncomes.push(grid);
        $scope.data.grossTotIncome =   $scope.data.grossTotIncome + grid.amount;
        $scope.otherIncomeData = {};
        $scope.result = {};
      }
    }
    $scope.removeOtherIncome = function(grid){
      $scope.data.grossTotIncome =   $scope.data.grossTotIncome - grid.amount
      $scope.otherIncomes.splice(grid,1);
    }
    //Add

    //grids add and delete of 80C
    $scope.addIT80C = function(grid){
      if($scope.IT80CData.name == null || $scope.IT80CData.amount == null){
        $scope.result.error = 'please fill 80C Name and Amount';
      }
      else {
        grid = {ID:0, name:grid.name, amount:grid.amount};
        $scope.IT80Cs.push(grid);
        $scope.IT80CData = {};
        $scope.result = {};
        calc10();
      }
    }
    $scope.removeIT80C = function(grid){
      $scope.IT80Cs.splice(grid,1);
      calc10();
    }
    //80C

    //grids add and delete of 80E
    $scope.addIT80E = function(grid){
      if($scope.IT80EData.name == null || $scope.IT80EData.amount == null || $scope.IT80EData.qualifyAmount == null){
        $scope.result.error = 'please fill 80E Name and Amount';
      }
      else {
        $scope.IT80Es.push(grid);
        $scope.IT80EData = {};
        $scope.result = {};
        calc10();
      }
    }
    $scope.removeIT80E = function(grid){
      $scope.IT80Es.splice(grid,1);
      calc10();
    }
    //80E

    $scope.bindForm = function(){
       if($scope.btnName =="Reset"){
         $scope.reset();
        }
      else{
          $scope.btnName = "Reset";
          $scope.salary={empID:$scope.data.empID, fromYear:$scope.data.fromYear, toYear:$scope.data.toYear};
          DataServices.getData('getSalary', $scope.salary,function(netSalary){
              if(netSalary != ''){
                $scope.data.sec17_1 = netSalary[0].net;
                $scope.viewForm= true;
              }
              else{
                $scope.result = {error1:'Salary not exists'};
              }
          })
      }
    }

    $scope.submit = function (){
      $scope.result = {};
      DataServices.Submit('doITTrans', $scope.data, function(response){
        $scope.result = response;
        if($scope.result.error == undefined){
            saveGrids();
        }
        else{
          $scope.result.error = "ITTrans details are not saved..";
        }
      })
    }

    //save grid
    function saveGrids(){
      //Less Allowance under section 10
      if($scope.allowances != {}){
        for(var i = 0; i < $scope.allowances.length ;i++){
          var cl= {tblName:'ITAllowance', ID:$scope.allowances[i].ID, name:$scope.allowances[i].name, amount:$scope.allowances[i].amount, qualify:'0'};
          DataServices.Submit('doITAddDeduct', cl, function(response){
           $scope.result = response;
         })
         cl = {};
       }
      }

      if($scope.otherIncomes != {}){
        for(var i = 0; i < $scope.otherIncomes.length ;i++){
          var ca = {tblName:'ITOtherIncome', ID:$scope.otherIncomes[i].ID, name:$scope.otherIncomes[i].name, amount:$scope.otherIncomes[i].amount, qualify:'0'};
          DataServices.Submit('doITAddDeduct', ca, function(response){
           $scope.result = response;
         })
         ca = {};
       }
      }

      if($scope.IT80Cs != {}){
        for(var i = 0; i < $scope.IT80Cs.length ;i++){
          var c80 = {tblName:'IT80C', ID:$scope.IT80Cs[i].ID, name:$scope.IT80Cs[i].name, amount:$scope.IT80Cs[i].amount, qualify:'0'};
          DataServices.Submit('doITAddDeduct', c80, function(response){
           $scope.result = response;
         })
         c80 = {};
       }
      }

      if($scope.IT80Es != {}){
        for(var i = 0; i < $scope.IT80Es.length ;i++){
          var e80 = {tblName:'IT80EG', ID:$scope.IT80Es[i].ID, name:$scope.IT80Es[i].name, amount:$scope.IT80Es[i].amount, qualify:$scope.IT80Es[i].qualifyAmount};
          DataServices.Submit('doITAddDeduct', e80, function(response){
           $scope.result = response;
         })
         e80 = {};
        }
      }
    }

    $scope.reset = function () {
      $scope.btnName = "View";
      $scope.viewForm= false;
      $scope.$broadcast('angucomplete-alt:clearInput');
      $scope.result = {};
      $scope.selectedFromYear = $scope.years[1];
      $scope.selectedToYear = $scope.years[2];
    }
}])//IT
})();
