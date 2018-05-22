var app = angular.module('mainApp', []);
app.controller('empController', function($scope, $http)
{
    // $http.post(url,$httpParamSerializer({param:val,secondParam:secondVal}));

    $scope.employees;
    var totalDeduction = 0
    $http.get("emp1.json").then(function(response)
    {
        $scope.employees = angular.fromJson(response.data.employees);
        console.log($scope.employees.length);
    });
    $scope.GrossTotal = function()
    {
      var GrossTotal=0;
      angular.forEach($scope.employees,function(value,key)
      {
        GrossTotal += parseFloat(value.GrossSalary);
      });
      return GrossTotal;
    }

    $scope.Deduction = function(sal)
    {
      var DeductSal = 0;
      switch(parseFloat(sal)) {
        case (sal <= 15000):
            return 0;
            break;
        case (sal > 15000 && sal <= 25000) :
            DeductSal  = (sal / 100) * 5;
            totalDeduction = totalDeduction + DeductSal;
            return DeductSal;
            break;
        default:
            DeductSal  = (sal / 100 ) * 7 ;
            totalDeduction = totalDeduction + DeductSal;
            return DeductSal ;
            break;
      }
    };

    // GET VALUES FROM INPUT BOXES AND ADD A NEW ROW TO THE TABLE.
    $scope.addRow = function () {
           if ($scope.Name && $scope.GrossSalary && $scope.selectedDept) {
             if(!isNaN($scope.GrossSalary) && isNaN($scope.Name))
             {
               var employee = [];
               employee.Name = $scope.Name;
               employee.Dept = $scope.selectedDept;
               employee.GrossSalary = $scope.GrossSalary;

               $scope.employees.push(employee);

               // CLEAR TEXTBOX.
               $scope.Name = null;
               $scope.Dept = null;
               $scope.GrossSalary = null;
               $scope.showError = null;          }
            else {
               $scope.showError = true;
            }
           }
       };

       // REMOVE SELECTED ROW(s) FROM TABLE.
       $scope.removeRow = function () {
           var arrEmp = [];
           angular.forEach($scope.employees, function (value) {
               if (!value.Remove) {
                   arrEmp.push(value);
               }
           });
           $scope.employees = arrEmp;
       };
       // FINALLY SUBMIT THE DATA.
       // $scope.submit = function () {
       //       var arremployee = [];
       //       angular.forEach($scope.employees, function (value) {
       //           arremployee.push('Name:' + value.Name + ', GrossSalary:' + value.GrossSalary);
       //       });
       //       $scope.display = arremployee;
       //   };

});
