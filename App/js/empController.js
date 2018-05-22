// use strict;

/**
 * @ngdoc controller
 * @name app.controller:empController
 *
 * @description
 * This is MyCtrl description
 */

app.controller('empController', function($scope, $http)
{

    $scope.employees;
    var totalDeduction = 0
    $http.get("../data.json").then(function(response)
    //Get the data from JSON file...
    {
        $scope.employees = angular.fromJson(response.data.employees);
    });
/**
* Solves equations of the form a * x = b
* @example
* // returns 2
* GrossTotal.method1(5, 10);
* @example
* // returns 3
* Deduction.method2(5, 15);
* @returns {Number} Returns the value of x for the equation.
*/
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
});
