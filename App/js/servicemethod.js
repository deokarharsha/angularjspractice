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
