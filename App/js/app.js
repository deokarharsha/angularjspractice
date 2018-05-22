

/**
 * @ngdoc controller
 * @name controller:empController
 *
 * @description
 * <span style="color: violet">Employee payroll management system</span>
 */

app.controller('empController', function($scope, $http)
{
  /**
   * @ngdocs method
   * @name httpservice
   * @methodOf controller:empController
   * @description
   * Creates <span class="label label-info">$scope.employees</span> object and
   * bind to <span class="label label-success">angular</span> input text element for autosuggesting.
   *
   * @param {string} tableName employees
   * @param {int} sortOrder id
   * @param {int} sortOrder Name
   * @param {string} sortOrder Dept
   * @param {int} sortOrder Grosssalary
   * @param {function} Get returns response object
   */
    $scope.employees;
    var totalDeduction = 0
    $http.get("../data.json").then(function(response)

    {
        $scope.employees = angular.fromJson(response.data.employees);
    });
    /**
    * @ngdoc method
    * @name GrossTotal
    * @methodOf controller:empController
    * @description
    * angular.<span class="label label-success">forEach</span>loop to get data from json
    *
    * add json values with <strong>grossTotal</strong> and move it into grosstotal
    *
    * Return: <span style="color: blue">GrossTotal</span></strong>
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
    /**
    * @ngdoc method
    * @name Deduction
    * @methodOf controller:empController

    * @description
    * @param {function} sal
    * Use <span class="label label-success"> Switch </span> case for salary
    *
    * <strong>case :0 </strong>salary is<strong> sal<= 15000 </strong> then move it into grosstotalthen return<strong>0</strong><br>
    * <strong>case :1 </strong>salary is<strong> sal > 15000 && sal <= 25000</strong> then deductSal <strong> (sal / 100) * 5</strong> and finally add totalDeduction and deductSal and move it into <strong>totalDeduction</strong> and return it.<br>
    * <strong>case :2 </strong>salary is<strong> sal > 15000 && sal <= 25000</strong> then deductSal<strong> (sal / 100 ) * 7</strong> and finally add totalDeduction and deductSal and move it into <strong>totalDeduction</strong> and return it.
    */
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
    /**
    * @ngdoc method
    * @name addRow
    * @methodOf controller:empController
    * @description
    * Check <strong>$scope.Name ,</strong>  <strong>$scope.GrossSalary ,</strong>  <strong>$scope.selectedDept</strong> is 0 then<br>
    * Also check <strong>$scope.GrossSalary</strong> and <strong>$scope.Name</strong> is <span style="color: red">!isNaN</span> Then do following<br>
    * create <span style="color : red">employee</span> array then<br>
    * Move the values from <strong>employee.Name = $scope.Name ,</strong><br>
      &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>employee.Dept = $scope.selectedDept ,</strong><br>
      &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>employee.GrossSalary = $scope.GrossSalary</strong> <br><br>
    * Push the employee array into <strong>$scope.employees</strong><br>
    * Finally all values are set to the NULL
    */
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
       /**
       * @ngdoc method
       * @name removeRow
       * @methodOf controller:empController
       * @description
       * Create array of employee <strong>arrEmp = []</strong>
       * Using <span style="color : red">angular</span>.forEach loop get the all values of employees Then<br>
       * Check <span style="color : red">(! value.Remove)</span> and push that values in array of employee i.e.<strong>arrEmp</strong> then<br>
       * At the last push values from array to json employee so that row is deleted
       */
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


/**
 * @ngdoc controller
 * @name controller:birthController
 *
 * @description
 * <span style="color: violet">Day on birthdate</span>
 */
app.factory('connectJson', function($http) {

  return {
      getItems: function () {
         return  $http.get('data.json');
      }
}
});
app.controller('birthController', function($scope, connectJson){
  /**
 * @ngdocs method
 * @name httpservice
 * @methodOf controller:birthController
 * @description
 * Creates <span class="label label-info">$scope.BirthData</span> object and
 * bind to <span class="label label-success">angular</span> input text element for autosuggesting.
 *
 * @param {string} tableName employees
 * @param {int} sortOrder id
 * @param {int} sortOrder Name
 * @param {string} sortOrder DOB
 * @param {function} getItems returns response object
 */
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

/**
 * @ngdoc controller
 * @name controller:deptController
 *
 * @description
 * <span style="color: orange">Add,Remove Departments</span>
 */

 app.controller('deptController',function($scope , myService)
 {
   $scope.error ;
   $scope.Deprartments;
   $scope.DeptID = 0;
   $scope.DeptName;
   $scope.exist=0;
   $scope.DepartmentsData=[];
   /**
    * @ngdocs method
    * @name httpservice
    * @methodOf controller:deptController
    * @description
    * Creates <span class="label label-info">$scope.Departments</span> object and
    * bind to <span class="label label-success">angucomplete-</span> input text element for autosuggesting.
    *
    * @param {string} tableName employees
    * @param {int} sortOrder id
    * @param {int} sortOrder Name
    * @param {string} sortOrder Dept
    * @param {int} sortOrder Grosssalary
    * @param {function} getItems returns response object
    */
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


   }


 });
