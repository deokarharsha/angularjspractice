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
app.factory('connectJson', function($http) {

  return {
      getItems: function () {
         return  $http.get('data.json');
      }
}
});
app.controller('birthController', function($scope, connectJson){
  connectJson.getItems().then(function(response){
              $scope.BirthData = response;
        });
        $scope.year;
        $scope.dob1;
        $scope.BirthData = {};
        $scope.bdate = [{"Day" :"Sunday","NameInitials" : []},
                   {"Day" :"Monday","NameInitials" : []},
                   {"Day" :"Tuesday","NameInitials" : []},
                   {"Day" :"Wednesday","NameInitials" : []},
                   {"Day" :"Thursday","NameInitials" : []},
                   {"Day" :"Friday","NameInitials" : []},
                   {"Day" :"Saturday","NameInitials" : []}];
        $scope.submit = function(){
          angular.forEach($scope.BirthData,function(value,key){
            var newdob = new Date(value.DOB);
            newdob.setYear($scope.year);
            var dob = newdob.getDay();
            var splitName = value.Name.split(" ");
            var Initials = splitName[0].charAt(0) + splitName[1].charAt(0);
            $scope.bdate[dob].NameInitials.push(Initials);
          });
          }
});
app.service('myService', function($http) {
  this.getItems = function () {
    return  $http.get('data.json');
 };
});

 app.controller('deptController',function($scope , myService)
 {
   $scope.error ;
   $scope.Deprartments;
   $scope.DeptID = 0;
   $scope.DeptName;
   $scope.exist=0;
   $scope.DepartmentsData=[];

   myService.getItems().then(function(response){
         $scope.DepartmentsData = angular.fromJson(response.data.Departments);
         $scope.Departments = angular.copy($scope.DepartmentsData);
         });



   $scope.submit = function()
   {
       if($scope.DeptName){
         angular.forEach($scope.Departments,function(value,key){
           if($scope.DeptName == value.Name){
             $scope.exist = 1;
             alert("Department is already exist");

           }
           if(value.id > $scope.DeptID){
             $scope.DeptID = value.id;
           }
         });
       }else{
         $scope.exist = 1;
         alert("Please enter Department Name...");
       }
       if($scope.exist == 0){
         var Department = {};
         Department.id = $scope.DeptID + 1;
         Department.Name = $scope.DeptName;
         $scope.Departments.push(Department);
         $scope.DepartmentsData = angular.copy($scope.Departments);
         Department = {};
         $scope.DeptName = null;


       }
       $scope.exist = 0;
   };
   $scope.Reset = function(index){

   var resetName = $scope.DepartmentsData[index].Name;
   alert(resetName);
   $scope.Departments[index].Name = resetName;

   // $scope.Departments = angular.copy($scope.DepartmentsData);
   }


 });
