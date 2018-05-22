var app = angular.module('quizApp', []);
app.controller('questionsController', function($scope, $http) {
  $scope.result={};
  $scope.questions=[];
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  $http.get("question.json").then(function(response) {
    $scope.questions = angular.fromJson(response.data.questions);

  });


  $scope.isSelected=function(answer, idx){
    $scope.result[idx] = answer;
  }

  $scope.onSubmit = function(){
    var correct = 0;
    var incorrect = 0;
    if(Object.keys($scope.result).length == $scope.questions.length)
    {
      $scope.show = true;
      angular.forEach($scope.result, function(value, key)
       {
        if(value == $scope.questions[key - 1].answer)
        {
          correct ++;
        }
        else
        {
          incorrect++;
        }
      });
      drawChart(correct,incorrect);
    }
  }
  function drawChart(correct,incorrect) {
     // Define the chart to be drawn.
     var data = google.visualization.arrayToDataTable([
        ['Result', 'Number of answers'],
        ['Correct',  correct],
        ['Incorrect', incorrect]
     ]);

     var options = {title: 'Question Answers'};

     // Instantiate and draw the chart.
     var chart = new google.visualization.ColumnChart(document.getElementById('container'));
     chart.draw(data, options);
  }
  $scope.reset = function(){
        $scope.show = false;
  }

});
