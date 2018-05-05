var app = angular.module('mainApp', []);
app.controller('empController', function($scope, $http)
{
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

});
