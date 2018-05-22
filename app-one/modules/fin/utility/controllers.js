(function() {
'use strict';

angular.module('Finance')

.controller('GSTCompareCtrl', ['DataServices', '$scope', '$filter', function(DataServices, $scope, $filter) {
  $scope.result = {};
  $scope.gstData = {};
  $scope.b2bData = {};

  $scope.browse = function() {
    document.getElementById('uploadFile').click();
  };

  $scope.showContent = function($fileContent) {
    $scope.gstData = angular.fromJson($fileContent);
    angular.forEach($scope.gstData, function(value, key) {
      
    });
    $scope.b2bData = Object.keys($scope.gstData);
  };

  // document.getElementById('uploadFile').addEventListener('change', readSingleFile, false);
  //
  // function readSingleFile(evt) {
  //   var allFiles = document.getElementById('uploadFile').files;
  //   var file = allFiles[0];
  //
  //   var ext = file.name.substr(file.name.length - 4);
  //
  //   if (ext == 'json') {
  //     $scope.filename = file.name;
  //
  //     var reader = new FileReader();
  //     reader.onload = function(e) {
  //       $scope.$apply(function() {
  //         $scope.gstData = angular.fromJson(e.target.result);
  //       });
  //     };
  //     reader.readAsText(file);
  //   } else {
  //     $scope.result.error = 'Please Select JSON only';
  //     document.getElementById('uploadFile').value = "";
  //     $scope.filename ='No file selected';
  //   }
  // }
}]); // gst-compare
})();
