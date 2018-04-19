var app = angular.module('quizApp', []);
app.controller('questionsController', function($scope, $http) {
  $http.get("question.json").then(function(response) {
      $scope.data = response.data;
  });
});
