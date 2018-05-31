var app = angular.module("App" , ["ngRoute"]);

app.config(function($routeProvider)
{
    $routeProvider
    .when("/", {
        templateUrl : "modules/home.html",
    })
    .when("/form", {
        templateUrl : "modules/form.html",
    })
    .when("/department", {
        templateUrl : "modules/department.html",
        controller: "deptController"
    })
    .when("/empDetails", {
        templateUrl : "modules/empDetails.html",
        controller: "empController"
    })
    .when("/birth", {
        templateUrl : "modules/birth.html",
        controller: "birthController"
    })
    .when("/bar", {
        templateUrl : "modules/bar.html",
        controller: "barController"
    })
});
app.controller('birthController', function($scope, $http){
  $http.get("../data.json").then(function(response)
  {
      $scope.BirthData = angular.fromJson(response.data.BirthData);
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
            $scope.bdate[dob].NameInitials.push({'NI':Initials,'C' : $scope.getRandomColor()});


          });
          }
          $scope.getRandomColor = function(){
                return  '#'+ Math.floor(Math.random()*16777215).toString(16)

            };
          });




app.controller('deptController',function($scope , $http)
{
  $scope.error ;
  $scope.Deprartments;
  $scope.DeptID = 0;
  $scope.DeptName;
  $scope.exist=0;
  $scope.DepartmentsData=[];
  alert('changemade');

  $http.get("../data.json").then(function(response)
  {
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
