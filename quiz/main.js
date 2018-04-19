var app = angular.module('quizApp', []);
app.controller('questionsController', function($scope, $http) {
  $http.get("question.json").then(function(response) {

       $scope.questions = response.data.questions;
  });
        $scope.submit=function(isValid)
        {
         console.log("ok");
       };

 // if ($scope.userSelect != "" && $scope.userSelect != undefined)
 //
 // $scope.msg = 'Selected Value: '+$scope.userSelect;
 //
 // else
 //
 // $scope.msg = 'Please Select Dropdown Value';
 // }


});
