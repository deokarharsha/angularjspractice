var app = angular.module('quizApp', []);
app.controller('questionsController', function($scope, $http) {
  $scope.result={};
  $scope.correct =0;
  $scope.incorrect=0;
  $scope.questions=[];
  $http.get("question.json").then(function(response) {
    $scope.questions = angular.fromJson(response.data.questions);

  });

  $scope.isSelected=function(answer, idx){
    $scope.result[idx] = answer;
  }

  $scope.onSubmit = function(){
    if(Object.keys($scope.result).length == $scope.questions.length)
    {
      angular.forEach($scope.result, function(value, key)
       {
        if(value == $scope.questions[key - 1].answer)
        {
          $scope.correct ++;
        }
        else
        {
          $scope.incorrect++;
        }
      });
    }
  }
});
